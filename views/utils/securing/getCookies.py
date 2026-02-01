from views.utils.parsers.decode import decode
import httpx
import re

# Gets amsc too
async def getCookies(session: httpx.AsyncClient):
        
    data = await session.get(
        url = "https://account.live.com/password/reset",
        headers = {
            "host": "account.live.com"
        },
        follow_redirects = False
    )

    apicanary = await decode(
        re.search(
            r'"apiCanary":"([^"]+)"', 
            data.text
        ).group(1)
    )
    amsc = data.cookies["amsc"]
        
    return apicanary