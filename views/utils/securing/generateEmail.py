import httpx

async def generateEmail(email: str, password: str) -> list:

    async with httpx.AsyncClient(timeout=None) as session:
        
        getDomain = await session.get(
            url = "https://api.mail.tm/domains",
            params = {
                "page": 1
            }
        )

        domain = getDomain.json()["hydra:member"][0]["domain"]
        finalEmail = f"{email}@{domain}"
        await session.post(
            url = "https://api.mail.tm/accounts",
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            json = {
                "address": finalEmail,
                "password": password
            }
        )

        token = await session.post(
            url = "https://api.mail.tm/token",
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            json = {
                "address": finalEmail,
                "password": password
            }
        )

        return [
            token.json()["token"],
            finalEmail
        ]


    