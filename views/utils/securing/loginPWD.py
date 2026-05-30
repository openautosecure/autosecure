import httpx

async def loginPWD(session: httpx.AsyncClient, email: str, post_url: str, password: str, ppft: str) -> str:
    # Login with Password
    
    password_post = await session.post(
        url = post_url,
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data = {
            "login": email,
            "loginfmt": email,
            "passwd": password,
            "PPFT": ppft
        },
        follow_redirects = True
    )

    return password_post.text