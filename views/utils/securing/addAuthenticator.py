from cogs.utils.genTOTP import totp
import httpx
import json
import re

async def addAuthenticator(session: httpx.AsyncClient) -> str:
    # Gets neccessary cookie for auth

    proof_add = await session.get(url = "https://account.live.com/proofs/Add?mpsplit=2&apt=3&mkt=en-US")

    secret_key = re.search(r'[a-z0-9]{4}(?:&nbsp;[a-z0-9]{4}){3}', proof_add.text).group(0).replace("&nbsp;", "")
    proof_id = re.search(r'id="ProofId"[^>]*value="(\d+)"', proof_add.text).group(1)
    canary = json.loads(f'"{re.search(r"\"apiCanary\":\"([^\"]+)\"", proof_add.text).group(1)}"')
    tcxt = json.loads(f'"{re.search(r"\"tcxt\":\"([^\"]+)\"", proof_add.text).group(1)}"')

    otp = await totp(secret_key)
    await session.post(
        url = "https://account.live.com/API/AddVerifyTotp",
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Canary": canary,
            "Tcxt": tcxt
        },
        json = {
            "ProofId": proof_id,
            "TotpCode": otp,
            "uiflvr": 1001,
            "scid": 100109,
            "hpgid": 200335
        },
        follow_redirects=True
    )

    default_url = await session.get(url = "https://account.live.com/proofs/EnableTfa")
    enable_2fa = re.search(r'"EnableTfa":"([^"]+)"', default_url.text).group(1)
    await session.get(url=enable_2fa)

    return secret_key