import logging
import httpx

async def remove_zyger(session: httpx.AsyncClient, apicanary: str):
    # Removes loggin through pass keys aka Zyger
    
    remove = await session.post(
        url = "https://account.live.com/API/Proofs/RevokeWindowsHelloProofs",
        headers = {
            "host": "account.live.com",
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
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
    
    if remove.status_code == 200:
        print("[+] - Removed Zyger")
    else:
        print("[X] - Failed to remove Zyger")
        logging.error(f"Failed to remove Zyger: {remove.text}")
