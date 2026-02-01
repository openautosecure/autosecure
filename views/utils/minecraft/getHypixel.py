import httpx
import hypixel

hypixel.Player.getRank()
async def getHypixelStats(username: str, hypixel_key: str) -> dict:

    playerStats = {

    }

    async with httpx.AsyncClient(timeout=None) as session:

        getRank = session.post(
            
        )

    