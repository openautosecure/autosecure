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


    # Remove Alias
    await session.post(
        url = "https://account.live.com/names/Manage",
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
    )