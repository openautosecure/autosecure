import httpx
import json

donut_key = json.load(open("config/config.json", "r"))["tokens"]["donut_key"]
async def get_donut_stats(username: str) -> dict:

    if not donut_key:
        return False
    
    async with httpx.AsyncClient() as session:

        response = await session.post(
            url = f"https://api.donutsmp.net/v1/stats/{username}",
            headers = {
                "Authorization": donut_key
            }
        )
        stats = response.json()

        if response.status_code == 500:
            return "Failed"
        
        if "kills" in stats:
            stats["kd"] = round(stats["kills"] / stats["deaths"], 2)
        
        return stats
    

    