import httpx
import re

async def getAMC(session: httpx.AsyncClient):
    # Gets AMCSecAuthJWT and scrapes the RequestVerificationToken
    # neccessary to getting the DOB

    await session.get(
        "https://account.microsoft.com",
        follow_redirects = True
    )

    finalPage = await session.get(
        url = "https://account.microsoft.com/",
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0"
        },
        follow_redirects = True
    )
    
    rvt = re.search(r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"', finalPage.text, re.DOTALL).group(1)
    print(f"[+] - Got RequestVerificationToken ({rvt})")
    return rvt
    