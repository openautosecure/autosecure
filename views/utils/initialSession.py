import fake_useragent
import httpx

def getSession() -> httpx.AsyncClient:

    return httpx.AsyncClient(
        timeout = None,
        headers = {
            "User-Agent": fake_useragent.UserAgent().chrome,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
        }
    )