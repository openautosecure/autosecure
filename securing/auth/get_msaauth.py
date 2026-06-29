from securing.auth.handle_redirects import handle_redirects
from urllib.parse import quote
import logging
import httpx
import re

async def get_msaauth(session: httpx.AsyncClient, email: str, flowtoken: str, odata: dict, code: str, ppft: str = None) -> dict | None:
    # First post request that gets __Host-MSAAUTH
    
    if not code:
        
        loginData = await session.post(
            url = odata["urlPost"],
            headers = {
                "host": "login.live.com",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://login.live.com",
                "Referer": "https://login.live.com/",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Priority": "u=0, i"
            },
            data = {
                "login": email,
                "loginfmt": email,
                "slk": flowtoken,
                "psRNGCSLK": flowtoken,
                "type": "21",
                "PPFT": odata["ppft"]
            },
            follow_redirects = True
        )

        urlPost = re.search(r'"urlPost"\s*:\s*"([^\"]+)"', loginData.text)

    else:
        
        payload = {
            "login": email,
            "loginfmt": email,
            "SentProofIDE": flowtoken,
            "PPFT": odata["ppft"]
        }

        for i in range(2):
            
            # 1 - Normal Email OTP (Type 24)
            # 2 - Primary Email working as Security Email too (Type 27)
            # 3 - Phone Number
            match i:
                case 0:
                    payload["otc"] = code
                    payload["type"] = "27"
                case 1:
                    payload.pop("otc")
                    payload["npotc"] = code
                    payload["type"] = "24"
 
            loginData = await session.post(
                url = odata["urlPost"],
                headers = {
                    "host": "login.live.com",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Origin": "https://login.live.com",
                    "Referer": "https://login.live.com/",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "same-origin",
                    "Priority": "u=0, i"
                },
                data = payload,
                follow_redirects = True
            )

            print(f"Login attempt {i}")
            logging.info(f"Login attempt {i+1} response: {loginData.text}")
            urlPost = re.search(r'"urlPost"\s*:\s*"([^\"]+)"', loginData.text)
            print(dict(session.cookies))
            if '__Host-MSAAUTH' in session.cookies:
                break

    if '__Host-MSAAUTH' in session.cookies:
        logging.info(f"MSAAUTH cookie for {email}: {dict(session.cookies)['__Host-MSAAUTH']}")
        
        if not urlPost:
            data = await handle_redirects(session, loginData.text)
            return data
        
        ppft = quote(re.search(r'"sFT"\s*:\s*"([^"]+)"', loginData.text).group(1), safe='-*')

        return {
            "urlPost" : urlPost.group(1),
            "ppft": ppft
        }
    
    return None
