import httpx

async def get_gamertag(xbl: str) -> str:

    async with httpx.AsyncClient(timeout=None) as session:

        gamertag = await session.post(
            url = "https://xsts.auth.xboxlive.com/xsts/authorize",
            headers = {
                "content-type": "application/json",
                "Accept": "*/*"
            },
            json = {
                "Properties" : {
                    "SandboxId" : "RETAIL",
                    "UserTokens" : [
                        xbl
                    ]
                },
                "RelyingParty": "http://xboxlive.com",
                "TokenType": "JWT"
            }
        )