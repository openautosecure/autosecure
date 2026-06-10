from urllib.parse import unquote
import logging
import httpx
import re

async def change_alias(session: httpx.AsyncClient, email: str, canary: str, apicanary: str) -> False | str:
    
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
        },
        data={
            "canary": canary,
            "PostOption": "LIVE",
            "SingleDomain": "outlook.com",
            "UpSell": "",
            "AddAssocIdOptions": "LIVE",
            "AssociatedIdLive": email,
        },
        follow_redirects=True
    )

    await session.post(
        url="https://account.live.com/API/MakePrimary",
        headers={
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
            "Referer": "https://account.live.com/AddAssocId",
        },
        json={
            "aliasName": f"{email}@outlook.com",
            "emailChecked": True,
            "removeOldPrimary": False,
            "uiflvr": 1001,
            "scid": 100141,
            "hpgid": 200176
        }
    )

    print(f"[+] - Changed Primary Alias ({email}@outlook.com)")

async def change_primary_alias(session: httpx.AsyncClient, email: str, apicanary: str) -> bool:
        
        try:
              
            response = await session.get(
                url="https://account.live.com/AddAssocId",
                headers={
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                },
                follow_redirects=True
            )

            code_match = re.search(r'<input[^>]*name="code"[^>]*value="([^"]+)"', response.text)
            state_match = re.search(r'<input[^>]*name="state"[^>]*value="([^"]+)"', response.text)

            response = await session.post(
                url="https://account.live.com/auth/redirect",
                data={
                    "code": unquote(code_match.group(1)),
                    "state": unquote(state_match.group(1))
                },
                headers={
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            )

            response = await session.get(
                url="https://account.live.com/AddAssocId",
                headers={"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
                follow_redirects=True
            )

            canary = re.search(r'name="canary"\s+value="([^"]+)"', response.text)
            if canary:
                  await change_alias(session, email, canary.group(1), apicanary)
                  return canary.group(1)
            
            print(f"[X] - Failed to change primary alias ({email})")
            return False
        
        except Exception as e:
            logging.error(f"Error changing primary alias: {e}")
            print(f"[X] - Failed to change primary alias ({email}@outlook.com)")
        