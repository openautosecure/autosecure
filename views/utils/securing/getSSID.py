import httpx

async def getSSID(xbl: str):
    
    async with httpx.AsyncClient(timeout=None) as session:

        response = await session.post(
            url = "https://api.minecraftservices.com/authentication/login_with_xbox",
            json = {
                "identityToken": xbl,
                "ensureLegacyEnabled": True
            }
        )

        jresponse = response.json()
        if "access_token" in jresponse:
            return jresponse["access_token"]

        return None
    