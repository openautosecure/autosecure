import httpx
import re

async def getAMC(session: httpx.AsyncClient):

    # Gets AMC and AMCJWT
    redirect = await session.get(
        "https://account.microsoft.com",
        follow_redirects=False
    )

    amcLink = redirect.headers["Location"]
    redirect2 = await session.get(
        url = amcLink
    )

    print(dict(session.cookies))

    T = re.search(
        r'<input\s+type="hidden"\s+name="t"\s+id="t"\s+value="([^"]+)"\s*\/?>', 
        redirect2.text
    ).group(1)

    response = await session.post(
        url = r"https://account.microsoft.com/auth/complete-silent-signin?ru=https://account.microsoft.com/auth/complete-silent-signin?ru=https%3A%2F%2Faccount.microsoft.com%2F&wa=wsignin1.0&refd=login.live.com&wa=wsignin1.0",
        data = f"t={T}"
    )

    print(response.text)
    location1 = re.search(r'href="([^"]+)"', response.text).group(1)
    mainPage = await session.get(
        url = location1,
        follow_redirects=True
    )

    print(mainPage.text)
    
    finalPage = await session.get(
        url = "https://account.microsoft.com/",
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0"
        }
    )
    
    rvt = re.search(r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"', finalPage.text, re.DOTALL).group(1)
    print(f"[+] - Got RequestVerificationToken ({rvt})")
    return rvt
    