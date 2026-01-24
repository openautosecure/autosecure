import urllib.parse
import httpx
import re

async def removeServices(session: httpx.AsyncClient):
    
    uatRequest = await session.get(
        url = "https://account.live.com/consent/Manage?guat=1",
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "https://login.live.com/"
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
                "Content-Type": "application/x-www-form-urlencoded"
            },
            follow_redirects = False
        )

        postURL = re.search(r'name="editConsentForm"[^>]*action="([^"]+)"', response.text).group(1)
        canary = urllib.parse.quote(re.search(r'canary"[^>]*value="([^"]+)"', response.text).group(1), safe="")
        
        await session.post(
            url = postURL,
            headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data = f"canary={canary}",
            follow_redirects = False
        )
        print(f"[~] - Removed {ID}")