import httpx

async def checkLocked(email: str) -> dict:

    # Times out sometimes...
    try:

        async with httpx.AsyncClient(timeout=None) as session:

            lockedInfo = await session.post(
                url = "https://support.microsoft.com/nl-NL/api/contactus/v1/ExecuteAlchemySAFAction?SourceApp=soc2",
                headers = {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
                    "Host": "support.microsoft.com",
                    "Content-Type": "application/json"
                },
                json = {
                    "Locale": "nl-NL",
                    "Parameters": {
                        "emailaddress": email
                    },  
                    "ActionId": "signinhelperemailv2",
                    "CorrelationId": "1b846a60-a752-45ee-95cb-b3ddd5b0bacd",
                    "ContextVariables": [],
                    "V2": True
                },
                timeout = 5
            )

            return lockedInfo.json()

    except Exception:
        return None
