import httpx

async def getWLSSC(msaauth: str, urlPost: str, ppft: str):
    
    # Polish request
    async with httpx.AsyncClient(timeout=None) as session:

        fetchWLSSC = await session.post(
            url = urlPost,
            headers = {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": f"__Host-MSAAUTH={msaauth}"
            },
            data = f"PPFT={ppft}&canary=&LoginOptions=3&type=28&hpgrequestid=&ctx="
        )

        return fetchWLSSC.headers["WLSSC"]