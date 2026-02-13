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

    if '__Host-MSAAUTH' in session.cookies:
        print(f"MSAAUTH: {dict(session.cookies)['__Host-MSAAUTH']}")
        urlPost = re.search(r'"urlPost"\s*:\s*"([^"]+)"', loginData.text).group(1)
        
        print(f"First urlPost: {urlPost}")
        if not urlPost:

            actionURL, cid, actioncode = re.search(
                r'action="([^"]+)".*?id="correlation_id" value="([^"]+)".*?id="code" value="([^"]+)"',
                loginData.text,
                re.DOTALL
            ).groups()

            print(f"Action: {actionURL}")
            print(f"CID: {cid}")
            print(f"Code: {code}")
            
            acceptNotice = await session.post(
                url = actionURL,
                data = {
                    "correlation_id": cid,
                    "code": actioncode
                }
            )

            print(acceptNotice.headers)
            print(acceptNotice.text)

            postPage = re.search(r"var redirectUrl = '([^']+)';", acceptNotice.text).group(1).replace(r"\\u0026", "&")

            print(f"Post Page: {acceptNotice.text}")

            response = await session.post(postPage)

            print(response.headers)
            print(response.text)

            urlPost = re.search(r'"urlPost"\s*:\s*"([^"]+)"', response.text).group(1)
            ppft = quote(re.search(r'"sFT"\s*:\s*"([^"]+)"', response.text).group(1), safe='-*')
        
        else:

            ppft = quote(re.search(r'"sFT"\s*:\s*"([^"]+)"', loginData.text).group(1), safe='-*')

        return {
            "urlPost" : urlPost,
            "PPFT": ppft
        }
    
    return None