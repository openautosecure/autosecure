import logging
import asyncio
import httpx
import re

async def get_amc(session: httpx.AsyncClient) -> list:
    # Gets AMCSecAuthJWT and scrapes the RequestVerificationToken
    # neccessary to getting the DOB

    response = await session.get(
        "https://account.microsoft.com",
        follow_redirects=True
    )

    logging.info(f"Account Following Response: {response.text}")
    # AMC Cookie and Home Token
    home = await session.get(
        url ="https://account.microsoft.com/profile?lang=en-US",
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        follow_redirects=True
    )

    home_token = re.search(
        r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"',
        home.text,
        re.DOTALL
    ).group(1)

    # Profile Token
    profile_info = await session.get(
        url = "https://account.microsoft.com/profile/about?ru=https%3A%2F%2Faccount.microsoft.com%2Fprofile",
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        follow_redirects=True
    )
    logging.info(f"PROFILE INFO: {profile_info.text}")

    profile_token = re.search(
        r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"',
        profile_info.text,
        re.DOTALL
    ).group(1)

    print(f"[+] - Got RequestVerificationTokens ({[home_token, profile_token]})")
    return [
        home_token,
        profile_token
    ]
