import httpx


async def get_cards(session: httpx.AsyncClient, verification_token: str):
    # Uses Account VerificationToken
    
    cards = await session.get(
        "https://account.microsoft.com/home/api/payment-instruments/pi-summary",
        headers = {
            "Accept": "application/json, text/plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            "__RequestVerificationToken": verification_token,
            "Correlation-Context": "v=1,ms.b.tel.market=en-US,ms.b.qos.rootOperationName=GLOBAL.HOME.PAYMENTINSTRUMENTS.GETPAYMENTINSTRUMENTSSUMMARY",
        },
        follow_redirects=True
    )
    
    return cards.json()
    