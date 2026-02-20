from urllib.parse import quote
import httpx
import re

async def handleRedirects(session: httpx.AsyncClient, page_response: str) -> dict:

    actionURL = re.search(r'action="([^"]+)"', page_response).group(1)
    if "family" in actionURL:
        return "Family"
    
    cid, actioncode = re.search(
        r'id="correlation_id"\s+value="([^"]+)".*?id="code"\s+value="([^"]+)"',
        page_response,
        re.DOTALL
    ).groups()

    print(f"Action: {actionURL}")
    print(f"CID: {cid}")
    print(f"Code: {actioncode}")
    
    acceptNotice = await session.post(
        url = actionURL,
        data = {
            "correlation_id": cid,
            "code": actioncode
        }
    )

    print(f"Accept Notice Headers: {acceptNotice.headers}")
    print(f"Accept Notice HTML: {acceptNotice.text}")

    postURL = re.search(r"var redirectUrl = '([^']+)';", acceptNotice.text).group(1).replace(r"\\u0026", "&")

    response = await session.post(postURL)
    print(f"Response Headers: {response.headers}")
    print(f"Response HTML: {response.text}")

    urlPost = re.search(r'"urlPost"\s*:\s*"([^"]+)"', response.text)
    ppft = quote(re.search(r'"sFT"\s*:\s*"([^"]+)"', response.text).group(1), safe='-*')

    return {
        "urlPost": urlPost,
        "PPFT": ppft
    }