import urllib.parse
import httpx
import re

async def changePrimaryAlias(session: httpx.AsyncClient, emailName: str, apicanary: str) -> bool:

    try:
        getCanary = await session.get(
            url = "https://account.live.com/AddAssocId",
            headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        )

        canary = urllib.parse.quote(
            re.search(
                r'name="canary" value="([^"]+)"', 
                getCanary.text
            ).group(1),
            safe = ""
        ) 

        # Add Email
        await session.post(
            url="https://account.live.com/AddAssocId?ru=&cru=&fl=",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://account.live.com",
                "Referer": "https://account.live.com/AddAssocId"
            },
            data=f"canary={canary}&PostOption=LIVE&SingleDomain=&UpSell=&AddAssocIdOptions=LIVE&AssociatedIdLive={emailName}&DomainList=outlook.com"
        )

        # Make Primary
        pinfo = await session.post(
            url = "https://account.live.com/API/MakePrimary",
            headers = {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/json",
                "hpgid": "200176",
                "scid": "100141",
                "uiflvr": "1001",
                "canary": apicanary
            },
            json = {
                "aliasName": f"{emailName}@outlook.com",
                "emailChecked": True,
                "removeOldPrimary": True,
                "uiflvr":1001,
                "scid":100141,
                "hpgid":200176
            }
        )

        if "error" in pinfo.json():
            print(f"[X] - Failed to change Primary Alias")
            return False

        return True
    except Exception:
        print(f"[X] - Failed to change Primary Alias")
        return False




    
