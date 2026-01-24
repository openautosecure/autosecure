import httpx

async def getProfile(ssid: str):
    
    async with httpx.AsyncClient(timeout=None) as session:

        response = await session.get(
            url = "https://api.minecraftservices.com/minecraft/profile",
            headers = {
                "Authorization": f"Bearer {ssid}"
            }
        )
        
        rjson = response.json()
        if "name" in rjson:
            return rjson["name"]
        
        return None