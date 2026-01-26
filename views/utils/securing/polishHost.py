import httpx

async def polishHost(session: httpx.AsyncClient, postData: dict) -> str:

    # Polish WLSSC
    data = await session.post(
        url = postData["urlPost"],
        headers = {
            "Cache-Control": "max-age=0",
            "Sec-Ch-Ua": '"Chromium";v="143", "Not A(Brand";v="24"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": '"Windows"',
            "Sec-Ch-Ua-Platform-Version": '""',
            "Accept-Language": "en-US,en;q=0.9",
            "Origin": "https://login.live.com",
            "Content-Type": "application/x-www-form-urlencoded",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            "Referer": data["urlPost"],
            "Accept-Encoding": "gzip, deflate, br",
            "Priority": "u=0, i"
        },
        data = f"PPFT={postData["PPFT"]}&canary=&LoginOptions=3&type=28&hpgrequestid=&ctx="
    )
    
    print(data.cookies)
    print(dict(data.cookies))
    return dict(data.cookies)["__Host-MSAAUTH"]
