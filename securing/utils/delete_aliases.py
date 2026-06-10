from urllib.parse import unquote
import logging
import httpx
import re

async def delete_aliases(session: httpx.AsyncClient, canary: str) -> None:

    response = await session.get(
        url="https://account.live.com/AddAssocId",
        headers={"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
        follow_redirects=True
    )
    canary = re.search(r'name="canary"\s+value="([^"]+)"', response.text)

    