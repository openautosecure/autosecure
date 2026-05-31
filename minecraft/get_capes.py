import httpx

async def getCapes(ssid: str) :

    async with httpx.AsyncClient(timeout=None) as session:

        response = await session.get(
            url = "https://api.minecraftservices.com/minecraft/profile",
            headers = {
                "Authorization": f"Bearer {ssid}"
            }
        )

        jresponse = response.json()
        if "capes" in jresponse:
            return jresponse["capes"]

        return None