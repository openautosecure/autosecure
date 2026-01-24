from urllib.parse import quote
import httpx

# Gets __Host-MSAAUTH
async def getMSAAUTH(email: str, flowToken: str, data: dict, code: str = None):

    async with httpx.AsyncClient(timeout=None) as session:

        if not code:
            
            loginData = await session.post(
                url = data["urlPost"],
                headers = {
                    "host": "login.live.com",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Origin": "https://login.live.com",
                    "Connection": "keep-alive",
                    "Referer": "https://login.live.com/",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "same-origin",
                    "Priority": "u=0, i"
                },
                cookies = data["cookies"],
                data = {
                    "login": email,
                    "loginfmt": email,
                    "slk": flowToken,
                    "psRNGCSLK": flowToken,
                    "type": "21",
                    "PPFT": data["ppft"]
                }
            )

        else:

            loginData = await session.post(
                url = data["urlPost"],
                headers = {
                    "host": "login.live.com",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Origin": "https://login.live.com",
                    "Connection": "keep-alive",
                    "Referer": "https://login.live.com/",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "same-origin",
                    "Priority": "u=0, i"
                },
                cookies = data["cookies"],
                data = {
                    "login": email,
                    "loginfmt": email,
                    "SentProofIDE": flowToken,
                    "otc": code,
                    "type": "27",
                    "PPFT": data["ppft"]
                }
            )

        if "__Host-MSAAUTH" in loginData.cookies:
            return loginData.cookies["__Host-MSAAUTH"]

    return None