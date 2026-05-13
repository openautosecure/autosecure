from urllib.parse import unquote
import httpx
import re

async def changePrimaryAlias(session: httpx.AsyncClient, emailName: str, apicanary: str) -> bool:

    # Fixed unc
    try:
        getCanary = await session.get(
            url = "https://account.live.com/AddAssocId",
            headers = {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            },
            follow_redirects = True
        )

        code = unquote(re.search(r'<input[^>]*name="code"[^>]*value="([^"]+)"', getCanary.text).group(1))
        state = unquote(re.search(r'<input[^>]*name="state"[^>]*value="([^"]+)"', getCanary.text).group(1))

        await session.post(
            url = "https://account.live.com/auth/redirect",
            data = {
                "code": code,
                "state": state 
            },
            headers = {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        )

        getCanary = await session.get(
            url = "https://account.live.com/AddAssocId",
            headers = {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            }
        )
        canary = re.search(r'name="canary"\s+value="([^"]+)"', getCanary.text).group(1)

        # Add Email
        await session.post(
            url="https://account.live.com/AddAssocId?ru=&cru=&fl=",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://account.live.com",
                "Referer": "https://account.live.com/AddAssocId",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-User": "?1",
                "Sec-Fetch-Dest": "document",
                "Sec-Ch-Ua": '"Chromium";v="143", "Not A(Brand";v="24"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Ch-Ua-Platform-Version": '""',
                "Priority": "u=0, i"
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
                "canary": apicanary,
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Sec-Ch-Ua": '"Chromium";v="143", "Not A(Brand";v="24"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Ch-Ua-Platform-Version": '""',
                "Referer": "https://account.live.com/AddAssocId",
                "Priority": "u=1, i"
            },
            json = {
                "aliasName": f"{emailName}@outlook.com",
                "emailChecked": True,
                "removeOldPrimary": True,
                "uiflvr": 1001,
                "scid": 100141,
                "hpgid": 200176
            }
        )

        if "error" in pinfo.json():
            print(f"[X] - Failed to change Primary Alias - {pinfo.text}")
            return False
        return True
    
    except Exception as e:
        print(f"[X] - Failed to change Primary Alias - {e}")
        return False
