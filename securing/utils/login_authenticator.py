from securing.auth.handle_redirects import handle_redirects
from securing.utils.polish_host import polish_host
from securing.utils.get_livedata import livedata
from securing.utils.login_pwd import login_pwd
from shared.gen_totp import totp

import logging
import httpx
import re

async def login_authenticator(session: httpx.AsyncClient, email: str, data: dict) -> None:
        
    secret = data["auth_secret"]
    password = data["password"]

    live_data = await livedata(session)
    pwd_login = await login_pwd(
        session,
        email,
        live_data["urlPost"],
        password,
        live_data["ppft"]
    )

    logging.info(f"Password login response: {pwd_login}")
    sFT_match = re.search(r'"sFT":"([^"]+)"', pwd_login)
    post_url_match = re.search(r'"urlPost":"(https://[^"]+)"', pwd_login)
    proof_match = re.search(r'"arrUserProofs":\[.*?"data":"(\d+)".*?"type":(?:10|14)', pwd_login, re.DOTALL)

    if not sFT_match or not post_url_match or not proof_match:
        print("[X] - Invalid Password / Secret")
        return "invalid"

    sFT = sFT_match.group(1)
    post_url: str = post_url_match.group(1)
    proof_data: str = proof_match.group(1)
    tcode = await totp(secret)

    auth_post = await session.post(
        url = post_url,
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data = {
            "otc": tcode,
            "AddTD": "true",
            "SentProofIDE": proof_data,
            "GeneralVerify": "false",
            "PPFT": sFT,
            "canary": "",
            "sacxt": "1",
            "hpgrequestid": "",
            "hideSmsInMfaProofs": "false",
            "type": "19",
            "login": email,
            "infoPageShown": "0"
        },
        follow_redirects = True
    )
    logging.info(f"Auth login response: {auth_post.text}")

    urlPost = re.search(r'"urlPost":"([^"]+)"', auth_post.text)
    logging.info(f"Extracted urlPost: {urlPost.group(1) if urlPost else 'None'}")
    if not urlPost:
        msaauth = await handle_redirects(session, auth_post.text)
        if not msaauth:
            return None
    ppft = re.search(r'"sFT":"([^"]+)"', auth_post.text).group(1)

    await polish_host(session, {"urlPost": urlPost.group(1), "ppft": ppft})