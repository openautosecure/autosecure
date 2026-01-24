import httpx
import re

async def getLiveData() -> dict:

    async with httpx.AsyncClient(timeout=None) as session:

        response = await session.post("https://login.live.com")

        urlPost = re.search(
            r'https://login\.live\.com/ppsecure/post\.srf\?contextid=[0-9a-zA-Z]{1,100}&opid=[0-9a-zA-Z]{1,100}&bk=[a-zA-Z0-9]{1,100}&uaid=[0-9a-zA-Z]{1,100}&pid=0',
            response.text
        ).group(0)

        ppft = re.search(
            r'value=\\?"([^"]+)"', 
            response.text
        ).group(1)

        return {
            "urlPost": urlPost,
            "ppft": ppft,
            "cookies": response.cookies,
            "headers": response.headers
        }