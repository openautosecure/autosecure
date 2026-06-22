from database.database import DBConnection
from shared.fetch_inbox import fetchInbox
from shared.email_view import emailView

async def get_inbox(email: str) -> dict:
    
    emails = await fetchInbox(email)
    view = emailView(emails, email)

    return {
        "embed": view.getEmbed(), 
        "view": view
    }