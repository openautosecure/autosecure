import httpx

async def get_contacts(session: httpx.AsyncClient, verification_token: str):
    # Uses Account VerificationToken
    
    contacts = await session.get(
        "https://account.microsoft.com/profile/api/v1/contact-info?includeEmails=true&includePhones=true&includeAddresses=true&includePermissionLink=true",
        headers = {
            "Accept": "application/json, text/plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            "__RequestVerificationToken": verification_token,
            "Correlation-Context": "v=1,ms.b.tel.market=en-US,ms.b.qos.rootOperationName=GLOBAL.HOME.FAMILY.GETFAMILYSUMMARY"
        }
    )
    
    return contacts.json()