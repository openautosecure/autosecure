import httpx
import json

donut_key = json.load(open("config.json", "r+"))["tokens"]["donut_key"]
async def getDonutStats(username: str) -> dict:

    async with httpx.AsyncClient() as session:

        get_stats = session.post(
            url = f"https://api.donutsmp.net/v1/stats/{username}",
            headers = {
                "Authorization": donut_key
            }
        )

        return {
            "playtime": get_stats["playtime"],
            "shards": get_stats["shards"],
            "nw": get_stats["money"]
        }
    

    