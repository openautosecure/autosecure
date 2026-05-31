import httpx

async def get_owner_info(session: httpx.AsyncClient, verificationToken: str):
    # Gets the owner info aka DOB
    
    try:

        getInfo = await session.get(
            "https://account.microsoft.com/profile/api/v1/personal-info",
            headers = {
                "Host": "account.microsoft.com",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "X-Requested-With": "XMLHttpRequest",
                "MS-CV": "oPOn6XQzaUytvOxM.14.96",
                "__RequestVerificationToken": verificationToken,
                "Correlation-Context": "v=1,ms.b.tel.market=en-US,ms.b.qos.rootOperationName=GLOBAL.PROFILE.PERSONALINFO.GETPERSONALINFO",
                "Sec-GPC": "1",
                "Connection": "keep-alive",
                "Referer": "https://account.microsoft.com/profile?lang=en-US",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
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