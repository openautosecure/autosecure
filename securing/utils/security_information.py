import logging
import httpx
import html
import re

async def security_information(session: httpx.AsyncClient):

    sec_info = await session.get(
        url = "https://account.live.com/proofs/Manage/additional",
    )
    logging.info(f"Security Info: {sec_info.text}")

    url = html.unescape(re.search(r'href="([^"]+)"', sec_info.text).group(1))
    response = await session.get(
        url = url
    )

    action  = re.search(r'action="([^"]+)"', response.text).group(1)
    pprid = re.search(r'name="pprid"[^>]*value="([^"]+)"', response.text).group(1)
    nap = re.search(r'name="NAP"[^>]*value="([^"]+)"', response.text).group(1)
    anon = re.search(r'name="ANON"[^>]*value="([^"]+)"', response.text).group(1)
    t = re.search(r'name="t"[^>]*value="([^"]+)"', response.text).group(1)

    response = await session.post(
        url = action,
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data = {
            "pprid": pprid,
            "NAP": nap,
            "ANON": anon,
            "t": t
        },
        follow_redirects=True
    )
    
    logging.info(f"Security Info: {response.text}")
    match = re.search(
        r'var\s+t0\s*=\s*(\{.*?\});',
        response.text,
        re.DOTALL
    )

    return match.group(1)
