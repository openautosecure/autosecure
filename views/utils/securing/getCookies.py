import code
import urllib.parse
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

    apicanary = re.sub(
        r'\\u([0-9A-Fa-f]{4})',
        lambda match: chr(int(match.group(1), 16)),
        urllib.parse.unquote(
            re.search(
                r'"apiCanary":"([^"]+)"', 
                data.text
            ).group(1)
        )
    )
        
    return apicanary