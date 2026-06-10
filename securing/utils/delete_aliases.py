import logging
import httpx
import re

async def delete_aliases(session: httpx.AsyncClient) -> None:

    response = await session.get(
        url="https://account.live.com/names/manage",
        headers={"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
        follow_redirects=True
    )
    logging.info(f"Delete Aliases response: {response.text}")

    canary = re.search(r'name="canary"\s+value="([^"]+)"', response.text).group(1)
    logging.info(f"Del canary: {canary}")
    aliases = re.findall(
        r'id="idAliasEmail\d+".*?<span class="dirltr\s*">([^<]+@[^<]+)</span>',
        response.text,
        re.DOTALL
    )
    logging.info(f"ALIASES: {aliases}")

    if aliases:
        print(f"[~] - Found Aliases ({aliases})")
        for alias in aliases:
            # Remove Alias
            response = await session.post(
                url = "https://account.live.com/names/Manage",
                headers = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                },
                data = {
                    "canary": canary,
                    "action": "RemoveAlias",
                    "aliasName": alias,
                    "displayName": alias
                }
            )
            print(f"[+] - Removed {alias}")
            logging.info(f"Deleted response: {response.text}")