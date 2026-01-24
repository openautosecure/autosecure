import httpx

async def getMethod(ssid: str):

    async with httpx.AsyncClient(timeout=None) as session:

        licenses = await session.get(
            url = "https://api.minecraftservices.com/entitlements/license?requestId=c24114ab-1814-4d5c-9b1f-e8825edaec1f",
            headers = {
                "Authorization": f"Bearer {ssid}"
            }
        )

        licenses_json = licenses.json()
        if "items" in licenses_json:
            for item in licenses_json["items"]:
                if (item["name"] == "product_minecraft" or item["name"] == "game_minecraft"):
                    if item["source"] == "GAMEPASS":
                        return "Gamepass"
                    elif (item["source"] == "PURCHASE" or item["source"] == "MC_PURCHASE"):
                        return "Purchased"

        return None