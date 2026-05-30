from urllib.parse import quote, unquote
import httpx
import re

async def handleRedirects(session: httpx.AsyncClient, page_response: str) -> dict:
    # Handles Microsofts random form popups
    # 4 Cases | Family Locked, FIDO Passkey, Accept Notice Form and Recovery Form
    redirect_logs = open("logs.txt", "w+")

    actionURL = re.search(r'action="([^"]+)"', page_response).group(1)
    redirect_logs.write(f"Action URL: {actionURL}\n")
    if "family" in actionURL:
        return "Family"
    
    if "pprid" in page_response:
        pprid = re.search(r'name="pprid"[^>]+value="([^"]+)"', page_response).group(1)
        ipt = re.search(r'name="ipt"[^>]+value="([^"]+)"', page_response).group(1)
        
        response = await session.post(
            url = actionURL,
            data = {
                "pprid": pprid,
                "ipt": ipt
            },
            follow_redirects=True
        )
        redirect_logs.write(f"Post Response: {response.text}\n")
        redirect_logs.write(f"Post Headers: {response.headers}\n")

    if "recover" in actionURL:
        redirect_logs.write(f"GOT RECOVERY FORM")

    elif "interrupt/passkey" in actionURL:
        postBackUrl = re.search(r"""name=['"]postBackUrl['"]\s+value=['"]([^'"]+)['"]""", response.text).group(1).replace('&amp;', '&')
        ru = re.search(r'[?&]ru=([^&"]+)', postBackUrl).group(1)
        
        response = await session.get(unquote(ru), follow_redirects=True)
        redirect_logs.write(f"Get Response: {response.text}")

        urlPost = re.search(r'"urlPost"\s*:\s*"([^"]+)"', response.text)
        ppft = re.search(r'"sFT"\s*:\s*"([^"]+)"', response.text)

        return {
            "urlPost": urlPost.group(1),
            "ppft": quote(ppft.group(1), safe='-*')
        }

    cid, actioncode = re.search(
        r'id="correlation_id"\s+value="([^"]+)".*?id="code"\s+value="([^"]+)"',
        page_response,
        re.DOTALL
    ).groups()
    
    acceptNotice = await session.post(
        url = actionURL,
        data = {
            "correlation_id": cid,
            "code": actioncode
        }
    )
    postURL = re.search(r"var redirectUrl = '([^']+)';", acceptNotice.text).group(1).replace(r"\\u0026", "&")
    response = await session.post(postURL)

    urlPost = re.search(r'"urlPost"\s*:\s*"([^"]+)"', response.text).group(1)
    ppft = quote(re.search(r'"sFT"\s*:\s*"([^"]+)"', response.text).group(1), safe='-*')

    return {
        "urlPost": urlPost,
        "ppft": ppft
    }