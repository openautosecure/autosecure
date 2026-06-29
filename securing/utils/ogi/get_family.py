import httpx

async def get_family(session: httpx.AsyncClient, verification_token: str):
    # Uses Account VerificationToken
    
    family = await session.get(
        "https://account.microsoft.com/home/api/family/family-summary",
        headers = {
            "Accept": "application/json, text/plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            "__RequestVerificationToken": verification_token,
            "Correlation-Context": "v=1,ms.b.tel.market=en-US,ms.b.qos.rootOperationName=GLOBAL.HOME.FAMILY.GETFAMILYSUMMARY"
        }
    )
    
    return family.json()
    