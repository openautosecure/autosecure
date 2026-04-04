from views.utils.parsers.decode import decode
import httpx
import re

async def getCookies(session: httpx.AsyncClient):
    # Gets the cookies and data neccessary for reseting the account

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
        
    return apicanary