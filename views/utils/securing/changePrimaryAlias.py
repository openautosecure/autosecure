import urllib.parse
import httpx
import re

async def changePrimaryAlias(emailName: str, amrp: str, apicanary: str, amsc: str):

    async with httpx.AsyncClient(timeout=None) as session:

        getCanary = await session.get(
            url = "https://account.live.com/AddAssocId",
            headers = {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": f"AMRPSSecAuth={amrp}; amsc={amsc}"
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
                "Cookie": f"AMRPSSecAuth={amrp}; amsc={amsc}",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://account.live.com",
                "Referer": "https://account.live.com/AddAssocId"
            },
            data=f"canary={canary}&PostOption=LIVE&SingleDomain=&UpSell=&AddAssocIdOptions=LIVE&AssociatedIdLive={emailName}&DomainList=outlook.com",
            timeout = None
        )

        # Make Primary
        await session.post(
            url = "https://account.live.com/API/MakePrimary",
            headers = {
                "Cookie": f"AMRPSSecAuth={amrp}; amsc={amsc}",
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
                "emailChecked": False,
                "removeOldPrimary": True,
                "uiflvr":1001,
                "scid":100141,
                "hpgid":200176
            },
            timeout=None
        )

        print("[+] - Changed Primary Email")


    

