import httpx

async def logoutAll(session: httpx.AsyncClient, apicanary: str):
    
    try:
        remove = await session.post(
            "https://account.live.com/API/Proofs/DeleteDevices",
            headers = {
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
            print("[+] - Sucessfully Logout all devices")
        else:
            print("[X] - Failed to logout of all devices")

    except Exception as e:
        print("[X] - Failed to logout of all devices")
        print(f"Logout: {remove.text}")
