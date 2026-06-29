import httpx

async def get_devices(session: httpx.AsyncClient, verification_token: str):
    # Uses Account VerificationToken
    
    devices = await session.get(
        "https://account.microsoft.com/home/api/devices/devices-summary",
        headers = {
            "Accept": "application/json, text/plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            "__RequestVerificationToken": verification_token,
            "Correlation-Context": "v=1,ms.b.tel.market=en-US,ms.b.qos.rootOperationName=GLOBAL.HOME.DEVICES.GETDEVICESSUMMARYINFO"
        }
    )
    
    return devices.json()
    