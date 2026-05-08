import httpx
import json

async def generateEmail(username: str, password: str) -> list:
    config = json.load(open("config.json", "r"))

    if config["mail_provider"] == "domain":
        email = f"{username}@{config['mail_domain']}"
        return [email, email]

    async with httpx.AsyncClient(timeout=None) as session:
        getDomain = await session.get(
            url="https://api.mail.tm/domains",
            params={"page": 1}
        )
        domain = getDomain.json()["hydra:member"][0]["domain"]
        finalEmail = f"{username}@{domain}"

        await session.post(
            url="https://api.mail.tm/accounts",
            headers={"Accept": "application/json", "Content-Type": "application/json"},
            json={"address": finalEmail, "password": password}
        )

        token = await session.post(
            url="https://api.mail.tm/token",
            headers={"Accept": "application/json", "Content-Type": "application/json"},
            json={"address": finalEmail, "password": password}
        )

        return [token.json()["token"], finalEmail]
