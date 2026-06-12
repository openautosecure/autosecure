from database.database import DBConnection

from shared.fetch_inbox import fetchInbox
from shared.email_view import emailView

async def get_inbox(email: str) -> dict | None:

    with DBConnection() as db:
        known = [e[0] for e in db.get_security_emails()]

    if email not in known:
        return None
    
    emails = await fetchInbox(email)
    view = emailView(emails, email)

    return {
        "embed": view.getEmbed(), 
        "view": view
    }