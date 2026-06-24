import asyncio
import httpx
import re

async def get_amc(session: httpx.AsyncClient):
    # Gets AMCSecAuthJWT and scrapes the RequestVerificationToken
    # neccessary to getting the DOB

    for attempt in range(3):
        try:
            await session.get(
                "https://account.microsoft.com",
                follow_redirects=True
            )

            # Complete getting AMC cookie
            await session.get(
                url =" https://account.microsoft.com/profile?lang=en-US",
                headers = {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                },
                follow_redirects=True
            )   

            # Get request token from profile            
            profile_info = await session.get(
                url = "https://account.microsoft.com/profile",
                headers = {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                }
            )

            rvt = re.search(
                r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"', 
                profile_info.text, 
                re.DOTALL
            ).group(1)
            
            print(f"[+] - Got RequestVerificationToken ({rvt})")
            return rvt
        except httpx.ConnectError:
            if attempt == 2:
                raise
            await asyncio.sleep(2)
    