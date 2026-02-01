import urllib.parse
import httpx
import re

async def changePrimaryAlias(session: httpx.AsyncClient, emailName: str, apicanary: str) -> bool:
    # Initial GET to AddAssocId - may redirect to OAuth
    getCanary = await session.get(
        url="https://account.live.com/AddAssocId",
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Priority": "u=0, i"
        },
        follow_redirects=False
    )
    
    # If we get redirected, follow the OAuth flow
    if getCanary.status_code == 302:
        # Follow redirects through OAuth flow and extract code/state from URLs
        current_url = getCanary.headers.get("Location")
        code = None
        state = None
        
        # Manually follow redirects to handle JavaScript redirects
        max_redirects = 20
        for i in range(max_redirects):
            if not current_url:
                break
            
            # Check current URL for code and state before making request
            parsed_url = urllib.parse.urlparse(current_url)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            if 'code' in query_params:
                code = query_params['code'][0]
            if 'state' in query_params:
                state = query_params['state'][0]
            
            if code and state:
                break
            
            # Make request
            response = await session.get(
                url=current_url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "Connection": "keep-alive",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "cross-site" if i == 0 else "same-site",
                    "Sec-Fetch-User": "?1"
                },
                follow_redirects=False
            )
            
            # Check response URL for code and state
            if hasattr(response, 'url') and response.url:
                parsed_response_url = urllib.parse.urlparse(str(response.url))
                response_query = urllib.parse.parse_qs(parsed_response_url.query)
                if 'code' in response_query and not code:
                    code = response_query['code'][0]
                if 'state' in response_query and not state:
                    state = response_query['state'][0]
            
            # Check for form_post response with code and state in form
            if response.status_code == 200 and not (code and state):
                code_match = re.search(r'<input[^>]*name=["\']code["\'][^>]*value=["\']([^"\']+)["\']', response.text, re.IGNORECASE)
                state_match = re.search(r'<input[^>]*name=["\']state["\'][^>]*value=["\']([^"\']+)["\']', response.text, re.IGNORECASE)
                if code_match:
                    code = code_match.group(1)
                if state_match:
                    state = state_match.group(1)
            
            if code and state:
                break
            
            # Check for JavaScript redirects in the response
            if response.status_code == 200:
                # Check for window.location redirects
                js_redirects = re.findall(r'window\.location\s*[=\.]\s*["\']([^"\']+)["\']', response.text, re.IGNORECASE)
                js_redirects.extend(re.findall(r'location\.(?:replace|href)\s*\(["\']([^"\']+)["\']', response.text, re.IGNORECASE))
                js_redirects.extend(re.findall(r'window\.location\.replace\s*\(["\']([^"\']+)["\']', response.text, re.IGNORECASE))
                
                # Check for meta refresh
                meta_refresh = re.search(r'<meta[^>]*http-equiv=["\']refresh["\'][^>]*content=["\']\d+;\s*url=([^"\']+)["\']', response.text, re.IGNORECASE)
                if meta_refresh:
                    js_redirects.append(meta_refresh.group(1))
                
                # Follow the first JavaScript redirect found
                if js_redirects:
                    next_url = js_redirects[0]
                    if not next_url.startswith('http'):
                        # Make absolute URL
                        base_url = str(response.url) if hasattr(response, 'url') and response.url else current_url
                        current_url = urllib.parse.urljoin(base_url, next_url)
                    else:
                        current_url = next_url
                    continue
            
            # Follow HTTP redirect if available
            if response.status_code in (302, 301, 307, 308):
                current_url = response.headers.get("Location")
                if current_url and not current_url.startswith('http'):
                    base_url = str(response.url) if hasattr(response, 'url') and response.url else current_url
                    current_url = urllib.parse.urljoin(base_url, current_url)
            else:
                # No more redirects, break
                break
        
        # POST code and state to /auth/redirect
        if code and state:
            redirect_response = await session.post(
                url="https://account.live.com/auth/redirect",
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Origin": "https://account.live.com",
                    "Referer": current_url if current_url else "https://account.live.com/",
                    "Connection": "keep-alive",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-User": "?1"
                },
                data={
                    "code": code,
                    "state": state
                },
                follow_redirects=True
            )
        else:
            print("[X] - Failed to extract code and state from OAuth flow")
            return False
        
        # Now GET /AddAssocId to get the page with canary
        getCanary = await session.get(
            url="https://account.live.com/AddAssocId",
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Referer": "https://account.live.com/"
            },
            follow_redirects=True
        )
    
    # Extract canary from the response
    canary_match = re.search(r'name="canary" value="([^"]+)"', getCanary.text)
    if not canary_match:
        print("[X] - Failed to find canary in response")
        print(f"[DEBUG] - Response status: {getCanary.status_code}")
        print(f"[DEBUG] - Response length: {len(getCanary.text)}")
        print(f"[DEBUG] - Response preview: {getCanary.text[:500]}")
        return False
    
    canary = urllib.parse.quote(canary_match.group(1), safe="") 
    # Add Email
    await session.post(
        url="https://account.live.com/AddAssocId?ru=&cru=&fl=",
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://account.live.com",
            "Referer": "https://account.live.com/AddAssocId",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1"
        },
        data=f"canary={canary}&PostOption=LIVE&SingleDomain=&UpSell=&AddAssocIdOptions=LIVE&AssociatedIdLive={emailName}&DomainList=outlook.com"
    )
    # Make Primary
    pinfo = await session.post(
        url = "https://account.live.com/API/MakePrimary",
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Origin": "https://account.live.com",
            "Referer": "https://account.live.com/",
            "Connection": "keep-alive",
            "hpgid": "200176",
            "scid": "100141",
            "uiflvr": "1001",
            "canary": apicanary,
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        json = {
            "aliasName": f"{emailName}@outlook.com",
            "emailChecked": True,
            "removeOldPrimary": True,
            "uiflvr": 1001,
            "scid": 100141,
            "hpgid": 200176
        }
    )
    if "error" in pinfo.json():
        print(f"[X] - Failed to change Primary Alias")
        return False
    
    return True