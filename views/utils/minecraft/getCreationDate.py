from dateutil import parser
import datetime
import httpx

async def getUsernameInfo(ssid: str):

    async with httpx.AsyncClient(timeout=None) as session:

        response = await session.get(
            url = "https://api.minecraftservices.com/minecraft/profile/namechange",
            headers = {
                "Authorization": f"Bearer {ssid}"
            }
        )
        
        return response.json()["createdAt"]