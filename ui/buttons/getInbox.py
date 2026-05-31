from cogs.utils.fetchInbox import fetchInbox
from cogs.utils.emailView import emailView
from database.database import DBConnection
import httpx
import json

async def getInbox(email: str) -> dict | None:
    config = json.load(open("config.json", "r"))

    if config["mail_provider"] == "domain":
        with DBConnection() as db:
            known = [e[0] for e in db.getSecurityEmails()]

        if email not in known:
            return None
        
        emails = await fetchInbox(email)
        view = emailView(emails, email)

        return {
            "embed": view.getEmbed(), 
            "view": view
        }

    with DBConnection() as db:
        password = db.getEmailPassword(email)

    if not password:
        return None

    async with httpx.AsyncClient(timeout=None) as session:
        data = await session.post(
            url="https://api.mail.tm/token",
            headers={"Accept": "application/json", "Content-Type": "application/json"},
            json={"address": email, "password": password[0]}
        )
        token = data.json()["token"]

    emails = await fetchInbox(token)
    view = emailView(emails, token)
    return {
        "embed": view.getEmbed(),
        "view": view
    }
