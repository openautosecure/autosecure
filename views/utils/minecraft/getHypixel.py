
import hypixel
import httpx
import json

hypixel_key = json.load(open("config.json", "r+"))["tokens"]["hypixel_key"]
hypixel.setKeys([hypixel_key])
async def getHypixelStats(username: str) -> dict:

    async with httpx.AsyncClient(timeout=None) as session:

        getRank = session.post(
            
        )

    