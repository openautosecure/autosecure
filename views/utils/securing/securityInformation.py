import httpx
import re

async def securityInformation(amrp: str):

    async with httpx.AsyncClient(timeout=None) as session:

        secInfo = await session.get(
            url = "https://account.live.com/proofs/Manage/additional",
            headers = {
                "Cookie": f"AMRPSSecAuth={amrp}"
            }
        )

        match = re.search(
            r'var\s+t0\s*=\s*(\{.*?\});',
            secInfo.text,
            re.DOTALL
        )

        return match.group(1)
