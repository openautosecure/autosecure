from database.database import DBConnection
import httpx
import json

async def generateEmail(email: str, password: str) -> str:

    async with httpx.AsyncClient(timeout=None) as session:

        getDomain = await session.get(
            url = "https://api.mail.tm/domains",
            params = {
                "page": 1
            }
        )

        domain = getDomain.json()["hydra:member"][0]["domain"]
        newEmail = f"{email}@{domain}"
        await session.post(
            url = "https://api.mail.tm/accounts",
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            json = {
                "address": newEmail,
                "password": password
            }
        )

        with DBConnection() as database:
            database.addEmail(f"{email}@{domain}", password)

        print(f"[+] - Generated Security Email ({email}@{domain})")

        token = await session.post(
            url = "https://api.mail.tm/token",
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            json = {
                "address": newEmail,
                "password": password
            }
        )

        return [
            newEmail,
            token.json()["token"]
        ]


    