import httpx

async def get_creation_date(ssid: str):

    async with httpx.AsyncClient(timeout=None) as session:

        response = await session.get(
            url = "https://api.minecraftservices.com/minecraft/profile/namechange",
            headers = {
                "Authorization": f"Bearer {ssid}"
            }
        )
        
        return response.json()["createdAt"]