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
        
        response = response.json()
        if response["nameChangeAllowed"]:
            return True
        
        todayDate = datetime.datetime.now()

        if "changedAt" in response:
            changeDate = response["changedAt"]
        else:
            changeDate = response["createdAt"]

        finalDate = (parser.parse(changeDate) + datetime.timedelta(days=31)).replace(tzinfo=None)

        # Amount of days to change username
        return (finalDate - todayDate).days