from views.utils.handleRedirects import handleRedirects
from urllib.parse import quote
import asyncio
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

    else:
        
        payload = {
            "login": email,
            "loginfmt": email,
            "SentProofIDE": flowToken,
            "otc": code,
            "PPFT": odata["ppft"]
        }

        loginData = None
        urlPost = None

        for i, type_val in enumerate(["27", "24"]):
            payload["type"] = type_val

            # Small delay before the second attempt to avoid rate-limit errors
            if i > 0:
                await asyncio.sleep(1.5)

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
                data = payload,
                follow_redirects = False
            )

            print(f"Attempt {i+1} (type={type_val}) - status={loginData.status_code}")

            # If we got an error response body (e.g. rate-limit HTML), skip
            if loginData.status_code not in (200, 302):
                print(f"[X] - Unexpected status {loginData.status_code} on type={type_val}, trying next")
                continue

            urlPost = re.search(r'"urlPost"\s*:\s*"([^\"]+)"', loginData.text)
            if urlPost:
                print(f"[+] - Got urlPost on type={type_val}, breaking")
                break

        if loginData is None:
            print("[X] - getMSAAUTH: no login attempt succeeded")
            return None

    print(loginData.text)
    if '__Host-MSAAUTH' in session.cookies:
        print(f"MSAAUTH: {dict(session.cookies)['__Host-MSAAUTH']}")
        
        if not urlPost:
            data = await handleRedirects(session, loginData.text)
            return data
        
        ppft_match = re.search(r'"sFT"\s*:\s*"([^"]+)"', loginData.text)
        if not ppft_match:
            print("[X] - getMSAAUTH: could not find sFT/ppft in response")
            return None

        ppft = quote(ppft_match.group(1), safe='-*')

        return {
            "urlPost" : urlPost.group(1),
            "ppft": ppft
        }
    
    return None
