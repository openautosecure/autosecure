import logging
import httpx
import re

# Home, Profile and Devices
endpoints = [
    "https://account.microsoft.com/profile?lang=en-US",
    "https://account.microsoft.com/profile/about?ru=https%3A%2F%2Faccount.microsoft.com%2Fprofile",
    "https://account.microsoft.com/devices/"
]

async def scrape_token(session: httpx.AsyncClient, url: str) -> str:

    response = await session.get(
        url = url,
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        follow_redirects=True
    )

    token = re.search(
        r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"',
        response.text,
        re.DOTALL
    ).group(1)

    return token

async def get_amc(session: httpx.AsyncClient) -> list:
    # Gets AMCSecAuthJWT and scrapes the RequestVerificationToken
    # There are diferent types of RequestVericationTokens
    # Each one is diferent for each page request

    # AMC Cookie
    response = await session.get(
        "https://account.microsoft.com",
        follow_redirects=True
    )
    logging.info(f"Account Following Response: {response.text}")

    home_token = scrape_token(session, endpoints[0])
    profile_token = scrape_token(session, endpoints[1])
    devices_token = scrape_token(session, endpoints[2])

    print(f"[+] - Got RequestVerificationTokens ({[home_token, profile_token, devices_token]})")
    return {
        "home": home_token,
        "profile": profile_token,
        "devices": devices_token
    }
