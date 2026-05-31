from fake_useragent import UserAgent
import httpx

def get_session() -> httpx.AsyncClient:

    # Persistent session that handles cookies automaticly
    return httpx.AsyncClient(
        headers = {
            "User-Agent": UserAgent().random,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        },
        timeout = None
    )
