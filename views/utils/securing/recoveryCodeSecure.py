from views.utils.securing.getEmailCode import getEmailCode
from urllib.parse import unquote
import codecs
import httpx
import json
import re

async def recoveryCodeSecure(email: str, recoveryCode: str, new_email: str, new_password: str, email_token: str):
    
    async with httpx.AsyncClient(timeout=None) as session:

        data = await session.get(url=f"https://account.live.com/ResetPassword.aspx?wreply=https://login.live.com/oauth20_authorize.srf&mn={email}")
        
        amsc = data.cookies["amsc"]
        serverData = json.loads(re.search(r"var\s+ServerData=(.*?)(?=;|$)", data.text).group(1))

        decoded_token = codecs.decode(unquote(serverData["sRecoveryToken"]), "unicode_escape")

        recToken = await session.post(
            url = "https://account.live.com/API/Recovery/VerifyRecoveryCode",
            headers = {
                "Content-type": "application/json; charset=utf-8",
                "Accept-encoding": "gzip, deflate, br, zstd",
                "Accept": "application/json",
                "Connection": "keep-alive",
                "Cookie": f"amsc={amsc}",
                "canary": serverData["apiCanary"],
                "hpgid": "200284",
                "hpgact": "0"
            },
            json = {
                "recoveryCode": recoveryCode,
                "code": recoveryCode,
                "scid": 100103,
                "token": decoded_token,
                "uiflvr": 1001
            }
        )
    
        recJson = recToken.json()
        if recToken.status_code == 200:

            canary = recJson["apiCanary"]
            token = recJson["token"]

            sendCode = await session.post(
                url = "https://account.live.com/api/Proofs/SendOtt", 
                headers = {
                    "Content-type": "application/json; charset=utf-8",
                    "Accept": "application/json",
                    "canary": canary,
                    "hpgid": "200284",
                    "hpgact": "0",
                    "Cookie": f"amsc={amsc}"
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
                        "hpgact": "0",
                        "Cookie": f"amsc={amsc}"
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
                        "hpgact": "0",
                        "Cookie": f"amsc={amsc}"
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
                if "recoveryCode" in finishJson:
                    return finishJson["recoveryCode"]
                
            return None
