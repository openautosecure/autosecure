import httpx

async def polishHost(host: str, amsc: str) -> str:

    async with httpx.AsyncClient(timeout=None) as session:

        data = await session.get(
            url = "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=21&ct=1708978285&rver=7.5.2156.0&wp=SA_20MIN&wreply=https://account.live.com/proofs/Add?apt=2&uaid=0637740e739c48f6bf118445d579a786&lc=1033&id=38936&mkt=en-US&uaid=0637740e739c48f6bf118445d579a786",
            headers = {
                "cookie": f"__Host-MSAAUTH={host}; amsc=${amsc}"
            },
            follow_redirects = False
        )
    
        return data.cookies["__Host-MSAAUTH"]
