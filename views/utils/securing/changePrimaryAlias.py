from views.utils.securing.loginPWD import loginPWD
from urllib.parse import unquote
from database import database
import httpx
import re

async def changePrimaryAlias(session: httpx.AsyncClient, emailName: str, apicanary: str) -> bool:
    try:
        response = await session.get(
            url="https://account.live.com/AddAssocId",
            headers={"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
            follow_redirects=True
        )

        # Loop because after loginPWD we may still get the OAuth auto-submit form
        # before finally landing on the AddAssocId canary page.
        for _ in range(4):
            canary = re.search(r'name="canary"\s+value="([^"]+)"', response.text)
            if canary:
                break

            url_post = re.search(r'"urlPost":"([^"]+)"', response.text)
            print(f"URL POST: {url_post.group(1)}")
            if url_post:
                # React SPA login page — PPFT is in ServerData.sFTTag, not in static HTML
                ppft_match = re.search(r'"sFTTag":"[^"]*value=\\"([^"\\]+)\\"', response.text)
                if not ppft_match:
                    print("[X] - Failed to extract PPFT from login page")
                    return False
                ppft = ppft_match.group(1)
                with database.DBConnection() as db:
                    password = db.getEmailPassword(emailName)
                await loginPWD(
                    session=session,
                    email=emailName,
                    post_url=url_post.group(1),
                    password=password,
                    ppft=ppft
                )
                response = await session.get(
                    url="https://account.live.com/AddAssocId",
                    headers={"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
                    follow_redirects=True
                )
                continue

            code_match = re.search(r'<input[^>]*name="code"[^>]*value="([^"]+)"', response.text)
            state_match = re.search(r'<input[^>]*name="state"[^>]*value="([^"]+)"', response.text)
            if code_match and state_match:
                await session.post(
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
                continue

            print(f"[X] - Unrecognised page at AddAssocId flow: {response.url}")
            return False

        if not canary:
            print("[X] - Failed to get AddAssocId canary after max retries")
            return False

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
            },
            data={
                "canary": canary.group(1),
                "PostOption": "LIVE",
                "SingleDomain": "outlook.com",
                "UpSell": "",
                "AddAssocIdOptions": "LIVE",
                "AssociatedIdLive": emailName,
            },
            follow_redirects=True
        )

        # Make Primary
        pinfo = await session.post(
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
