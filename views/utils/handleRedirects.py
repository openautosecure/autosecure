from urllib.parse import quote, unquote
import logging
import httpx
import re

def getData(response: str) -> dict:
    urlPost = re.search(r'"urlPost"\s*:\s*"([^"]+)"', response)
    ppft = re.search(r'"sFT"\s*:\s*"([^"]+)"', response)

    return {
        "urlPost": urlPost.group(1),
        "ppft": quote(ppft.group(1), safe='-*')
    }

async def submitForm(session: httpx.AsyncClient, action_url: str, redirect: str) -> str:
    pprid = re.search(r'name="pprid"[^>]+value="([^"]+)"', redirect).group(1)
    ipt = re.search(r'name="ipt"[^>]+value="([^"]+)"', redirect).group(1)
    
    response = await session.post(
        url = action_url,
        data = {
            "pprid": pprid,
            "ipt": ipt
        },
        follow_redirects=True
    )
    rtext = response.text
    return rtext

# FIDO Passkey interruption
async def handleFIDO(session: httpx.AsyncClient, redirect: str) -> dict:
    postBackUrl = re.search(r"""name=['"]postBackUrl['"]\s+value=['"]([^'"]+)['"]""", redirect).group(1)
    formatURL = postBackUrl.replace('&amp;', '&')

    ru = re.search(r'[?&]ru=([^&"]+)', formatURL).group(1)
    
    response = await session.get(unquote(ru), follow_redirects=True)

    return getData(response.text)

# Accept Notice Form
async def handleNotice(session: httpx.AsyncClient, action_url: str, redirect: str) -> str:
    cid, actioncode = re.search(
        r'id="correlation_id"\s+value="([^"]+)".*?id="code"\s+value="([^"]+)"',
        redirect,
        re.DOTALL
    ).groups()
    
    acceptNotice = await session.post(
        url = action_url,
        data = {
            "correlation_id": cid,
            "code": actioncode
        }
    )
    postURL = re.search(r"var redirectUrl = '([^']+)';", acceptNotice.text).group(1).replace(r"\\u0026", "&")
    response = await session.post(postURL)

    return response.text

async def handleRedirects(session: httpx.AsyncClient, response: str) -> dict:
    # Handles Microsofts random form popups

    action_url = re.search(r'action="([^"]+)"', response).group(1)
    logging.info(f"Action URL redirect: {action_url}")
    # Family Locked
    if "family" in action_url:
        print(f"[X] - Account is Family Locked")
        return "Family"

    # Submit the all forms
    if "pprid" in response:
        redirect = await submitForm(session, action_url, response)

        # Accrou Notice Form
        if '"iAddProofViewSkip"' in redirect:
            print(f"[~] - Handling Accrou Notice Form")
            logging.info(f"Accrou Notice Response: {redirect}")
    
            
            skip_url = re.search(r'"skip":\{"url":"([^"]+)"', redirect).group(1)
            skip_response = await session.get(skip_url, follow_redirects=True)
    
            return getData(skip_response.text)

    elif "interrupt/passkey" in action_url:
        print(f"[~] - Handling FIDO")
        result = await handleFIDO(session, redirect)
        return getData(result)
    
    # Accept notice
    print(f"[~] - Handling Accept Notice Form")
    result = await handleNotice(session, action_url, redirect)
    return getData(result)