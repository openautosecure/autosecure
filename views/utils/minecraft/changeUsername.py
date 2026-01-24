import httpx
import hypixel

async def changeUsername(ssid: str, current_username: str) -> None:

    async with httpx.AsyncClient() as session:

        response = await session.put(
            url = f"https://api.minecraftservices.com/minecraft/profile/name/{current_username}_",
            headers = {""
                "Content-Type": "application/json",
                "Authorization": f"Bearer {ssid}"
            }
        )

        if 200 <= response.status_code < 300:
            print(f"[~] - Changed IGN to {current_username}_")
        else:
            print(f"[~] - Failed to change IGN")


    