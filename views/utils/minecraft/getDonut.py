import httpx
import json

donut_key = json.load(open("config.json", "r+"))["tokens"]["donut_key"]
async def getDonutStats(username: str) -> dict:

    if not donut_key:
        return False
    
    async with httpx.AsyncClient() as session:

        stats = await session.post(
            url = f"https://api.donutsmp.net/v1/stats/{username}",
            headers = {
                "Authorization": donut_key
            }
        )
        
        if stats.status_code == 500:
            return "Failed"
        
        return stats.json()
    

    