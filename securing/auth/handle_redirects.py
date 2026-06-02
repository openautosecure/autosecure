from urllib.parse import quote, unquote
import logging
import httpx
import re

def get_data(response: str) -> dict:
    logging.info(f"Getting Live Data")
    urlPost = re.search(r'"urlPost"\s*:\s*"([^"]+)"', response)
    ppft = re.search(r'id=\\"i0327\\" value=\\"([^\\]+)\\"', response)
    if not ppft:
        ppft = re.search(r'"sFT"\s*:\s*"([^"]+)"', response)

    return {
        "urlPost": urlPost.group(1),
        "ppft": quote(ppft.group(1), safe='-*')
    }

async def submit_form(session: httpx.AsyncClient, action_url: str, redirect: str) -> str:
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
async def handle_fido(session: httpx.AsyncClient, redirect: str) -> dict:
    postBackUrl = re.search(r"""name=['"]postBackUrl['"]\s+value=['"]([^'"]+)['"]""", redirect).group(1)
    formatURL = postBackUrl.replace('&amp;', '&')

    ru = re.search(r'[?&]ru=([^&"]+)', formatURL).group(1)
    
    response = await session.get(unquote(ru), follow_redirects=True)

    return response.text

# Accept Notice Form
async def handle_notice(session: httpx.AsyncClient, action_url: str, redirect: str) -> str:
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

async def handle_redirects(session: httpx.AsyncClient, response: str) -> dict | None:
    # Handles Microsofts random form popups
    # Response = Original Form without prrid
    # Redirect = Response after handling form
     
    try:

        logging.info(f"Redirect Response: {response}")
        action_url = re.search(r'action="([^"]+)"', response).group(1)
        logging.info(f"Action URL redirect: {action_url}")

        # Family Locked
        if "family" in action_url:
            print(f"[X] - Account is Family Locked")
            return "Family"

        # FIDO passkey interrupt
        if "fido" in action_url:
            print(f"[~] - Handling FIDO")
            fido_page = await submit_form(session, action_url, response)
            logging.info(f"Redirect Response: {fido_page}")
            result = await handle_fido(session, fido_page)

        # Accept notice
        if "privacynotice.account.microsoft.com" in action_url:
            print(f"[~] - Handling Accept Notice Form")
            logging.info(f"Accept Notice Response: {response}")
            result = await handle_notice(session, action_url, response)
    
        # Submit the all forms
        if "pprid" in response:
            redirect = await submit_form(session, action_url, response)

            print(f"[~] - Handling Accrou Notice Form")
            logging.info(f"Accrou Notice Response: {redirect}")

            skip_match = (
                re.search(r'"skip":\s*\{"url"\s*:\s*"([^"]+)"', redirect) or
                re.search(r'"skipUrl"\s*:\s*"([^"]+)"', redirect)
            )
            if skip_match:
                skip_url = skip_match.group(1).replace('\\u0026', '&')
            else:
                ru_match = re.search(r'[?&]ru=([^&"]+)', action_url)
                skip_url = unquote(ru_match.group(1))

            skip_response = await session.get(skip_url, follow_redirects=True)
            return get_data(skip_response.text)

        return get_data(result)
    
    except Exception as e:
        logging.error(f"Error handling redirect: {e}")
        return None
