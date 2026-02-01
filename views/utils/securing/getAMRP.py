import httpx

async def getAMRP(session: httpx.AsyncClient, T: str):

    fetchAMRP = await session.post(
        url = "https://account.live.com/proofs/Add?apt=2&wa=wsignin1.0",
        data = {
            "t": T
        },
        follow_redirects = False
    )
    
    if "AMRPSSecAuth" in fetchAMRP.cookies:
        return True
    
    return None