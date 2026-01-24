import httpx

async def getAMRP(T, amsc):

    async with httpx.AsyncClient(timeout=None) as session:

        fetchAMRP = await session.post(
            url = "https://account.live.com/proofs/Add?apt=2&wa=wsignin1.0",
            headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Cookie": f"amsc={amsc}; MSPAuth=Disabled; MSPProof=Disabled;"
            },
            data = {
                "t": T
            },
            follow_redirects = False
        )

        if "AMRPSSecAuth" in fetchAMRP.cookies:
            return fetchAMRP.cookies["AMRPSSecAuth"]

        return None