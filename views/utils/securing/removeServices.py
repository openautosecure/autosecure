import urllib.parse
import httpx
import re

async def removeServices(amrp: str, amsc: str):
    
    async with httpx.AsyncClient(timeout=None) as session:

        uatRequest = await session.get(
            url = "https://account.live.com/consent/Manage?guat=1",
            headers={
                "Cookie": f"AMRPSSecAuth={amrp}; amsc={amsc}",
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://login.live.com/",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
            }
        )

        client_ids = re.findall(
            r'client_id=([A-F0-9]{16})', 
            uatRequest.text
        )
    
        if not client_ids:
            print("[+] - No Services Found")
            return

        print("[~] - Removing Services")
        for ID in client_ids:

            response = await session.get(
                url = f"https://account.live.com/consent/Edit?client_id={ID}",
                headers = {
                    "Cookie": f"AMRPSSecAuth={amrp}; amsc={amsc}",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                follow_redirects = False
            )

            postURL = re.search(r'name="editConsentForm"[^>]*action="([^"]+)"', response.text).group(1)
            canary = urllib.parse.quote(re.search(r'canary"[^>]*value="([^"]+)"', response.text).group(1), safe="")

            await session.post(
                url = postURL,
                headers = {
                    "Cookie": f"AMRPSSecAuth={amrp}; amsc={amsc}",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data = f"canary={canary}",
                follow_redirects = False
            )

            print(f"[~] - Removed {ID}")
