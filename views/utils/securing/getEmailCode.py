import httpx
import asyncio
import time
import re

async def getEmailCode(token: str) -> str:

    async with httpx.AsyncClient(timeout=None) as session:
        
        while True:

            checkEmails = await session.get(
                url = "https://api.mail.tm/messages",
                headers = {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": f"Bearer {token}"
                }
            )

            rJson = checkEmails.json()
            if rJson:
                
                print(rJson)
                ID = rJson[0]["id"]
                getEmail = await session.get(
                    url = f"https://api.mail.tm/messages/{ID}",
                    headers = {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "authorization": f"Bearer {token}"
                    }
                )

                emailText = getEmail.json()["text"]
                code = re.search(r'Security code:\s*(\d+)', emailText).group(1)

                return code

            await asyncio.sleep(0.8)
            continue
