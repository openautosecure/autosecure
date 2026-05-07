import httpx

async def getOwnerInfo(session: httpx.AsyncClient, verificationToken: str):
    # Gets the owner info aka DOB
    
    try:

        getInfo = await session.get(
            "https://account.microsoft.com/profile/api/v1/personal-info",
            headers={
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "X-Requested-With": "XMLHttpRequest",
                "__RequestVerificationToken": verificationToken,
                "Correlation-Context": "v=1,ms.b.tel.market=en-US,ms.b.qos.rootOperationName=GLOBAL.PROFILE.PERSONALINFO.GETPERSONALINFO",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin"
            }
        )

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