import httpx

async def get_capes(ssid: str) :

    async with httpx.AsyncClient(timeout=None) as session:

        response = await session.get(
            url = "https://api.minecraftservices.com/minecraft/profile",
            headers = {
                "Authorization": f"Bearer {ssid}"
            }
        )

        jresponse = response.json()
        return jresponse["capes"]