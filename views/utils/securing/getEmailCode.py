import asyncio
import json
import re
import httpx
from database.database import DBConnection

async def getEmailCode(type: str) -> str:
    config = json.load(open("config.json", "r"))

    if config["mail_provider"] == "domain":
        while True:
            with DBConnection() as db:
                row = db.markUnused(type)
            if row:
                email_id, body = row
                match = re.search(r'Security code[:\s]+(\d{4,8})', body, re.IGNORECASE)
                if match:
                    with DBConnection() as db:
                        db.markCreated(email_id)
                    return match.group(1)
            await asyncio.sleep(0.8)

    async with httpx.AsyncClient(timeout=None) as session:
        while True:
            checkEmails = await session.get(
                url="https://api.mail.tm/messages",
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": f"Bearer {type}"
                }
            )
            rJson = checkEmails.json()
            if rJson and not rJson[0]["seen"]:
                ID = rJson[0]["id"]
                getEmail = await session.get(
                    url=f"https://api.mail.tm/messages/{ID}",
                    headers={
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "authorization": f"Bearer {type}"
                    }
                )
                emailText = getEmail.json()["text"]
                code = re.search(r'Security code:\s*(\d+)', emailText).group(1)
                return code
            await asyncio.sleep(0.8)
