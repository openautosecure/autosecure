import httpx

async def sendAuth(email: str) -> dict:

    async with httpx.AsyncClient(timeout=None) as session:

        sendAuth = await session.post(
            url = "https://login.live.com/GetCredentialType.srf",
            headers = {
                "Accept": "application/json",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Content-Type": "application/json; charset=utf-8",
                "Cookie": "MSPOK=$uuid-899fc7db-4aba-4e53-b33b-7b3268c26691",
                "Referer": "https://login.live.com/",
                "hpgact": "0",
                "hpgid": "33",
                "Origin": "https://login.live.com",
                "Priority": "u=0",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0"
            },
            json = {
                "checkPhones": True,
                "country": "",
                "federationFlags": 3,
                "flowToken": "-DgAlkPotvHRxxasQViSq!n6!RCUSpfUm9bdVClpM6KR98HGq7plohQHfFANfGn4P7PN2GnUuAtn6Nu3dwU!Tisic5PrgO7w8Rn*LCKKQhcTDUPMM2QJJdjr4QkcdUXmPnuK!JOqW7GdIx3*icazjg5ZaS8w1ily5GLFRwdvobIOBDZP11n4dWICmPafkNpj5fKAMg3!ZY2EhKB7pVJ8ir4A$",
                "forceotclogin": True,
                "isCookieBannerShown": True,
                "isExternalFederationDisallowed": True,
                "isFederationDisabled": True,
                "isFidoSupported": True,
                "isOtherIdpSupported": False,
                "isRemoteConnectSupported": False,
                "isRemoteNGCSupported": True,
                "isSignup": False,
                "otclogindisallowed": False,
                "username": email
            } 
        )

        return sendAuth.json()



