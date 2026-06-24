import httpx

async def get_owner_info(session: httpx.AsyncClient, verification_token: str):
    # Gets the owner info aka DOB
    
    try:

        getInfo = await session.get(
            "https://account.microsoft.com/profile/api/v1/personal-info",
            headers = {
                "Accept": "application/json, text/plain, */*",
                "__RequestVerificationToken": verification_token,
                "Correlation-Context": "v=1,ms.b.tel.market=en-US,ms.b.qos.rootOperationName=GLOBAL.PROFILE.PERSONALINFO.GETPERSONALINFO"
            }
        )
        print(getInfo.text)
        response = getInfo.json()
        print(getInfo.text)
        return {
            "Fname" : response["firstName"],
            "Lname" : response["lastName"],
            "region": response["region"],
            "birthday": response["birthday"]
        }
    
    except Exception as e:
        print(f"Exception: {e}")
        return None