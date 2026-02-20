import httpx

async def getCapes(xbl: str) :

    async with httpx.AsyncClient(timeout=None) as session:

        await session.post(
            url = "https://emerald.xboxservices.com/xboxcomfd/settings/privacyonlinesafety",
            headers = {
                "authorization": f"XBL3.0 x={xbl}",
                "content-type": "application/json",
                "accept": "*/*",
                "dnt": "1",
                "origin": "https://www.xbox.com",
                "referer": "https://www.xbox.com/",
                "x-ms-api-version": "1.0"
            },
            data = {
                "setOnlineSafetySettings": [185, 254],
                "clearOnlineSafetySettings": [188, 190, 198, 199, 220, 255]
            }
        )