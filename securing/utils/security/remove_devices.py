import httpx

async def remove_devices(session: httpx.AsyncClient, token: str, devices: dict):

    if device["devices"]:
        for device in devices["devices"]:

            await session.post(
                url = "https://account.microsoft.com/devices/api/disclaim",
                headers = {
                    "Accept": "application/json, text/plain, */*",
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    "__RequestVerificationToken": token,
                    "Correlation-Context": "v=1,ms.b.tel.market=en-US,ms.b.qos.rootOperationName=Devices.Disclaim,ms.b.tel.scenario=ust.amc.devices.disclaim,ms.c.ust.scenarioStep=Index"
                },
                json = {
                    "deviceId": device["id"]
                }
            )
        
        print(f"[~] - Removed Device ({device["model"]})")