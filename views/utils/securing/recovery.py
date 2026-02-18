from views.utils.securing.getEmailCode import getEmailCode
from urllib.parse import unquote
import codecs
import httpx
import json
import re

async def recover(session: httpx.AsyncClient, email: str, recovery_code: str, new_email: str, new_password: str, email_token: str):
    
    data = await session.get(url=f"https://account.live.com/ResetPassword.aspx?wreply=https://login.live.com/oauth20_authorize.srf&mn={email}")

    serverData = json.loads(re.search(r"var\s+ServerData=(.*?)(?=;|$)", data.text).group(1))
    decoded_token = codecs.decode(unquote(serverData["sRecoveryToken"]), "unicode_escape")
    postUrl = re.search(r'"urlPostSltToLogin":"([^"]+)"', data.text).group(1) 

    recToken = await session.post(
        url = "https://account.live.com/API/Recovery/VerifyRecoveryCode",
        headers = {
            "Content-type": "application/json; charset=utf-8",
            "Accept-encoding": "gzip, deflate, br, zstd",
            "Accept": "application/json",
            "Connection": "keep-alive",
            "canary": serverData["apiCanary"],
            "hpgid": "200284",
            "hpgact": "0"
        },
        json = {
            "recoveryCode": recovery_code,
            "code": recovery_code,
            "scid": 100103,
            "token": decoded_token,
            "uiflvr": 1001
        }
    )

    recJson = recToken.json()
    print(recJson)
    if "apiCanary" in recJson:
        canary = recJson["apiCanary"]
        token = recJson["token"]
        sendCode = await session.post(
            url = "https://account.live.com/api/Proofs/SendOtt", 
            headers = {
                "Content-type": "application/json; charset=utf-8",
                "Accept": "application/json",
                "canary": canary,
                "hpgid": "200284",
                "hpgact": "0"
            },
            json = {
                "associationType": "None",
                "action": "VerifyNewProof",
                "channel": "Email",
                "cxt": "MP",
                "proofId": new_email,
                "scid": 100103,
                "token": token,
                "uiflvr": 1001
            }
        )
        
        responseJson = sendCode.json()
        
        if "apiCanary" in responseJson:
            canary = responseJson["apiCanary"]
            code = await getEmailCode(email_token)
            verifyCodeResponse = await session.post(
                url = "https://account.live.com/API/Proofs/VerifyCode",
                headers = {
                    "Content-type": "application/json; charset=utf-8",
                    "Accept": "application/json",
                    "canary": canary,
                    "hpgid": "200284",
                    "hpgact": "0"
                },
                json = {
                    "action": "VerifyOtc",
                    "proofId": new_email,
                    "scid": 100103,
                    "token": token,
                    "uiflvr": 1001,
                    "code": code
                }
            )
            verifyCodeResponseJson = verifyCodeResponse.json()
            canary = verifyCodeResponseJson["apiCanary"]
            
            finishSecure = await session.post(
                url = "https://account.live.com/API/Recovery/RecoverUser",
                headers = {
                    "Content-type": "application/json; charset=utf-8",
                    "Accept": "application/json",
                    "canary": canary,
                    "hpgid": "200284",
                    "hpgact": "0"
                },
                json = {
                    "contactEmail": new_email,
                    "contactEpid": "",
                    "password": new_password,
                    "passwordExpiryEnabled": 0,
                    "scid": 100103,
                    "token": token,
                    "uaid":"6b182876e51a429db0e2cff317076750",
                    "uiflvr": 1001
                }
            )
            finishJson = finishSecure.json()

            print(finishJson)
            print(finishSecure.text)
            
            if "recoveryCode" in finishJson:
                return {
                    "urlPost": postUrl,
                    "recovery_code": finishJson["recoveryCode"]
                }
    else:
        return "invalid"

    return None
