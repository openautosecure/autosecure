import httpx

async def get_owner_info(session: httpx.AsyncClient, verification_token: str):
    # Uses Profile RequestVerificationToken

    get_info = await session.get(
        "https://account.microsoft.com/profile/api/v1/personal-info",
        headers = {
            "Accept": "application/json, text/plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            "__RequestVerificationToken": verification_token,
            "Correlation-Context": "v=1,ms.b.tel.market=en-US,ms.b.qos.rootOperationName=GLOBAL.PROFILE.PERSONALINFO.GETPERSONALINFO"
        }
    )
    
    return get_info.json()
    