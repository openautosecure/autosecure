import httpx

async def getOwnerInfo(session: httpx.AsyncClient, verificationToken: str):

    try:

        getInfo = await session.get(
            "https://account.microsoft.com/profile/api/v1/personal-info",
            headers={
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "X-Requested-With": "XMLHttpRequest",
                "MS-CV": "LbJd6i44UUmIn7so.5.63",
                "__RequestVerificationToken": verificationToken,
                "Correlation-Context": "v=1,ms.b.tel.market=pt-PT,ms.b.qos.rootOperationName=GLOBAL.HOME.PROFILE.GETPERSONALINFO",
                "Connection": "keep-alive",
                "Referer": "https://account.microsoft.com/profile",
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