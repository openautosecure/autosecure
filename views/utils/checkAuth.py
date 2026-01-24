import httpx

async def checkAuth(flowtoken: str) -> dict:

    async with httpx.AsyncClient(timeout=None) as session:

        response = await session.post(
            url = f"https://login.live.com/GetSessionState.srf?mkt=EN-US&lc=1033&slk={flowtoken}&slkt=NGC",
            headers = {
                "Content-Type": "application/json",
                "Cookie": "MSPOK=$uuid-3d6b1bc3-9fcd-4bd0-a4b1-1a8855505627$uuid-1a3e6d72-d224-456d-868f-4b85ff342088$uuid-58a49dcf-5abd-4a23-95ef-ed1b5999931e;",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.9",
                "Origin": "https://login.live.com",
                "Referer": "https://login.live.com/"
            },
            json = {
                "DeviceCode": flowtoken
            }    
        )

        return response.json()
        

