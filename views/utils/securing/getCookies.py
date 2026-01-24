from views.utils.parsers.decode import decode
import httpx
import re

async def getCookies():
    
    async with httpx.AsyncClient(timeout=None) as session:

        data = await session.get(
            url="https://account.live.com/password/reset",
            follow_redirects = False
        )

        apicanary = await decode(
            re.search(
                r'"apiCanary":"([^"]+)"', 
                data.text
            ).group(1)
        )

        amsc = data.cookies["amsc"]
            
        return [apicanary, amsc]