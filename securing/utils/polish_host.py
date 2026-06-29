import httpx
import re

async def polish_host(session: httpx.AsyncClient, post_data: dict) -> str:
    # Second post request that persists the microsoft session (Polish WLSSC)
    # Gets 2 Crucial Cookies AMCSecAuth and AMCSecAuthJWT
    # Needed to be able to use microsofts account API

    polish = await session.post(
        url = post_data["urlPost"],
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        },
        data = f"PPFT={post_data['ppft']}&canary=&LoginOptions=3&type=28&hpgrequestid=&ctx=",
        follow_redirects=True
    )

    sso_redirect = re.search(r'https://account\.microsoft\.com/auth/complete-sso-with-redirect\?state=[A-Za-z0-9_\-+/=]+', polish.text).group()
    
    auth = await session.get(
        url = sso_redirect,
        follow_redirects=True
    )
    action  = re.search(r'action="([^"]+)"', auth.text).group(1)
    pprid   = re.search(r'name="pprid"[^>]*value="([^"]+)"', auth.text).group(1)
    nap     = re.search(r'name="NAP"[^>]*value="([^"]+)"', auth.text).group(1)
    anon    = re.search(r'name="ANON"[^>]*value="([^"]+)"', auth.text).group(1)
    t       = re.search(r'name="t"[^>]*value="([^"]+)"', auth.text).group(1)

    # Finish Polish
    await session.post(
        url = action,
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data = {
            "pprid": pprid,
            "NAP": nap,
            "ANON": anon,
            "t": t
        },
        follow_redirects=True
    )