from urllib.parse import unquote
import httpx
import re

async def delete_aliases(session: httpx.AsyncClient) -> None:

    response = await session.get(
        url="https://account.live.com/names/manage",
        headers={"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
        follow_redirects=True
    )

    canary = re.search(r'name="canary"\s+value="([^"]+)"', response.text)
    aliases = re.findall(
        r'class="aliasRemoveLink"[^>]*name="([^"]+)"[^>]*data-display="([^"]+)"',
        response.text
    )

    if aliases:
        for alias in aliases:
            # Remove Alias
            await session.post(
                url = "https://account.live.com/names/Manage",
                headers = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                },
                data = {
                    "canary": canary,
                    "action": "RemoveAlias",
                    "aliasName": alias[0],
                    "displayName": alias[1]
                }
            )