from views.utils.handlePolicy import handleAcceptPolicy
from urllib.parse import quote
import httpx
import re

# Gets __Host-MSAAUTH
async def getMSAAUTH(session: httpx.AsyncClient, email: str, flowToken: str, data: dict, code: str) -> dict | None:

    if not code:
        
        loginData = await session.post(
            url = data["urlPost"],
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
                "PPFT": data["ppft"]
            },
            follow_redirects = True
        )

    else:

        loginData = await session.post(
            url = data["urlPost"],
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
                "SentProofIDE": flowToken,
                "otc": code,
                "type": "27",
                "PPFT": data["ppft"]
            },
            follow_redirects = True
        )

    print(loginData.text)
    print(loginData.headers)
    if '__Host-MSAAUTH' in session.cookies:
        print(f"MSAAUTH: {dict(session.cookies)['__Host-MSAAUTH']}")
        urlPost = re.search(r'"urlPost"\s*:\s*"([^"]+)"', loginData.text)
        
        print(f"First urlPost: {urlPost}")
        if not urlPost:
            data = await handleAcceptPolicy(session, loginData.text)
            return data
        
        ppft = quote(re.search(r'"sFT"\s*:\s*"([^"]+)"', loginData.text).group(1), safe='-*')

        return {
            "urlPost" : urlPost.group(1),
            "PPFT": ppft
        }
    
    return None