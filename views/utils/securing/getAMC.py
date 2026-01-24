import httpx
import re

async def getAMC(session: httpx.AsyncClient):

    # Gets AMC and AMCJWT
    redirect = await session.get(
        "https://account.microsoft.com",
        allow_redirects=False
    )

    amcLink = redirect.headers["Location"]
    redirect2 = await session.get(
        url = amcLink
    )

    T = re.search(
        r'<input\s+type="hidden"\s+name="t"\s+id="t"\s+value="([^"]+)"\s*\/?>', 
        redirect2.text
    ).group(1)

    await session.post(
        url = r"https://account.microsoft.com/auth/complete-silent-signin?ru=https://account.microsoft.com/auth/complete-silent-signin?ru=https%3A%2F%2Faccount.microsoft.com%2F&wa=wsignin1.0&refd=login.live.com&wa=wsignin1.0",
        data = f"t={T}"
    )

    step_js = session.get(
        "https://account.microsoft.com/"
    )

    rvt = re.search(r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"', step_js.text, re.DOTALL).group(1)
    return rvt
    