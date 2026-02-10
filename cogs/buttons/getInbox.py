from database.database import DBConnection
from cogs.utils.fetchInbox import fetchInbox
from cogs.utils.emailView import emailView
import httpx

async def getInbox(email: str) -> bool | None:

    with DBConnection() as db:
        password = db.getEmailPassword(email)

        if not password:
            return None
        
    async with httpx.AsyncClient(timeout=None) as session:
        data = await session.post(  
            url = "https://api.mail.tm/token",
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            json = {
                "address": email,
                "password": password[0]
            }
        )
        
        token = data.json()["token"]
        
    emails = await fetchInbox(token)
    view = emailView(emails)

    return {
        "embed": view.getEmbed(),
        "view": view
    }