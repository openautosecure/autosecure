import httpx
import re

async def getT(msaauth: str, amsc: str):

    async with httpx.AsyncClient(timeout=None) as session:

        fetchT = await session.get(
            url = "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=21&ct=1708978285&rver=7.5.2156.0&wp=SA_20MIN&wreply=https://account.live.com/proofs/Add?apt=2&uaid=0637740e739c48f6bf118445d579a786&lc=1033&id=38936&mkt=en-US&uaid=0637740e739c48f6bf118445d579a786",
            headers = {
                "cookie": f"__Host-MSAAUTH={msaauth}; amsc={amsc}"
            },
            follow_redirects = False
        )

        match = re.search(
            r'<input\s+type="hidden"\s+name="t"\s+id="t"\s+value="([^"]+)"\s*\/?>', 
            fetchT.text
        )

        if match:
            return match.group(1)

        # Account needs to accept TOS to be fixed
        return None 
    