import httpx
import codecs
import re

async def removeProof(session: httpx.AsyncClient, apicanary: str):

    proofs = await session.get(
        "https://account.live.com/proofs/manage/additional?mkt=en-US&refd=account.microsoft.com&refp=security",
        headers = {
            "Accept-Language": "en-US,en;q=0.5",
            "Referer": "https://login.live.com/"
        },
        follow_redirects = False
    )

    proofIds = re.findall(
        r'"proofId":"([^"]+)"', 
        proofs.text
    )
    decodedProofs = [codecs.decode(ID, "unicode_escape") for ID in proofIds]

    for proof in decodedProofs:
        
        await session.post(
            url = "https://account.live.com/API/Proofs/DeleteProof",
            headers = {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/json",
                "canary": apicanary
            },
            json = {
                "proofId": proof,
                "uaid": "114b68368b7b46afa44c82a8246e4a44",
                "uiflvr": 1001,
                "scid": 100109,
                "hpgid": 201030
            }
        )
