import httpx

async def getRecoveryCode(amrp: str, apicanary: str, amsc: str, eni: str):

    async with httpx.AsyncClient(timeout=None) as session:

        data = await session.post(
            url = "https://account.live.com/API/Proofs/GenerateRecoveryCode",
            headers = {
                "host": "account.live.com",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-ms-apiVersion": "2",
                "x-ms-apiTransport": "xhr",
                "uiflvr": "1001",
                "scid": "100109",
                "hpgid": "201030",
                "X-Requested-With": "XMLHttpRequest",
                "Origin": "https://account.live.com",
                "Connection": "keep-alive",
                "Referer": "https://account.live.com/proofs/Manage/additional",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "canary": apicanary,
                "cookie": f"amsc={amsc}; AMRPSSecAuth={amrp};"
            },
            json = {
                "encryptedNetId": eni,
                "uiflvr": 1001,
                "scid": 100109,
                "hpgid": 201030
            }
        )

        return data.json()["recoveryCode"]