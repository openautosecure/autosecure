from urllib.parse import unquote
import urllib.parse
import httpx
import re

async def changePrimaryAlias(session: httpx.AsyncClient, emailName: str, apicanary: str) -> bool:

    # Fixed unc
    try:
        getCanary = await session.get(
            url = "https://account.live.com/AddAssocId",
            headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            follow_redirects = True
        )
        
        print(f"GETCANARY PRIMARY TEXT - {getCanary.text}")
        print(f"GETCANARY PRIMARY COOKIES - {dict(getCanary.cookies)}")
        code = unquote(re.search(r'<input[^>]*name="code"[^>]*value="([^"]+)"', getCanary.text).group(1))
        state = unquote(re.search(r'<input[^>]*name="state"[^>]*value="([^"]+)"', getCanary.text).group(1))

        response = await session.post(
            url = "https://account.live.com/auth/redirect",
            data = {
                "code": code,
                "state": state 
            },
            headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        )
        
        print(f"Auth Redirect Response: {response.text}")
        print(f"Auth Redirect Headers: {response.headers}")

        getCanary = await session.get(
            url = "https://account.live.com/AddAssocId",
            headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        )

        canary_match = re.search(
            r'name="canary" value="([^"]+)"', 
            getCanary.text
        )

        if not canary_match:
            print("[X] - changePrimaryAlias: could not find canary in second AddAssocId response")
            return False

        canary = urllib.parse.quote(
            canary_match.group(1),
            safe = ""
        )

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
