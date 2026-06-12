from database.database import DBConnection
import asyncio
import httpx
import json
import re

config = json.load(open("config.json", "r"))

async def get_email_code(mail: str) -> str:

    while True:

        with DBConnection() as db:
            row = db.mark_unused(mail)

        if row:
            email_id, body = row
            match = re.search(r'Security code[:\s]+(\d{4,8})', body, re.IGNORECASE)
            if match:
                with DBConnection() as db:
                    db.mark_used(email_id)
                return match.group(1)
            
        await asyncio.sleep(0.8)
