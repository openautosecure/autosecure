import httpx
import re

async def securityInformation(session: httpx.AsyncClient):

    secInfo = await session.get(
        url = "https://account.live.com/proofs/Manage/additional",
    )

    match = re.search(
        r'var\s+t0\s*=\s*(\{.*?\});',
        secInfo.text,
        re.DOTALL
    )

    return match.group(1)
