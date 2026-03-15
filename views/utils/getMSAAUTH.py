from views.utils.handleRedirects import handleRedirects
from urllib.parse import quote
import httpx
import re

# Gets __Host-MSAAUTH
async def getMSAAUTH(session: httpx.AsyncClient, email: str, flowToken: str, odata: dict, code: str) -> dict | None:

    print(f"Data: {odata}")
    print(f"Code: {code}") 
    
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
                "slk": flowToken,
                "psRNGCSLK": flowToken,
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
            "SentProofIDE": flowToken,
            "otc": code,
            "PPFT": odata["ppft"]
        }

        for i in range(2):

            match i:
                case 0:
                    payload["type"] = "27"
                case 1:
                    payload["type"] = "24"

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
                data = payload
            )

            print(f"Attemp Number {i} \n Response: {loginData.text}")
            urlPost = re.search(r'"urlPost"\s*:\s*"([^\"]+)"', loginData.text)
            if urlPost:
                break

    if '__Host-MSAAUTH' in session.cookies:
        print(f"MSAAUTH: {dict(session.cookies)['__Host-MSAAUTH']}")
        
        print(f"First urlPost: {urlPost}")
        if not urlPost:
            data = await handleRedirects(session, loginData.text)
            return data
        
        ppft = quote(re.search(r'"sFT"\s*:\s*"([^"]+)"', loginData.text).group(1), safe='-*')

        return {
            "urlPost" : urlPost.group(1),
            "ppft": ppft
        }
    
    return None
