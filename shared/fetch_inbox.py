import httpx
import json
from database.database import DBConnection

async def fetchInbox(type: str) -> list:
    config = json.load(open("config.json", "r"))

    if config["mail_provider"] == "domain":
        with DBConnection() as db:
            rows = db.get_emails(type)
        emails = []

        for _, _, from_addr, subject, body, received_at in rows:
            emails.append(f"**From:** {from_addr}\n**Subject:** {subject}\n**Date:** {received_at}\n\n{body}")

        return emails[::-1]

    async with httpx.AsyncClient(timeout=None) as session:
        getEmails = await session.get(
            url="https://api.mail.tm/messages",
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": f"Bearer {type}"
            }
        )

        emails = getEmails.json()
        emailsText = []

        if emails:
            for email in emails:
                response = await session.get(
                    url=f"https://api.mail.tm/messages/{email['id']}",
                    headers={
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "authorization": f"Bearer {type}"
                    }
                )
                emailsText.append(response.json()["text"])

        return emailsText[::-1]
