from database.database import DBConnection

async def fetchInbox(email: str) -> list:

    with DBConnection() as db:
        rows = db.get_emails(email)

    emails = []
    for _, _, from_addr, subject, body, received_at in rows:
        emails.append(f"**From:** {from_addr}\n**Subject:** {subject}\n**Date:** {received_at}\n\n{body}")
        
    return emails[::-1]

