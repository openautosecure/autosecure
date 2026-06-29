import httpx

async def get_subscriptions(session: httpx.AsyncClient, verification_token: str):
    # Uses Account VerificationToken
    
    subscriptions = await session.get(
        "https://account.microsoft.com/services/api/subscriptions?excludeWindowsStoreInstallOptions=false&excludeLegacySubscriptions=true&isReact=true&includeCmsData=false",
        headers = {
            "Accept": "application/json, text/plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            "__RequestVerificationToken": verification_token,
            "Correlation-Context": "v=1,ms.b.tel.market=en-US,ms.b.qos.rootOperationName=GLOBAL.SERVICES.GETSUBSCRIPTIONS"
        }
    )

    return subscriptions.json()