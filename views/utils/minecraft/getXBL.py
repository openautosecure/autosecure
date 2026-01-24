import httpx
import base64
import json
import re

async def getXBL(mssauth: str) -> dict:

    async with httpx.AsyncClient(timeout=None) as session:

        try: 
            
            data = await session.get(
                url = "https://sisu.xboxlive.com/connect/XboxLive/?state=login&cobrandId=8058f65d-ce06-4c30-9559-473c9275a65d&tid=896928775&ru=https://www.minecraft.net/en-us/login&aid=1142970254",
                follow_redirects = False
            )

            location = data.headers["Location"]
            acessTokenRedirect = await session.get(
                url = location,
                headers = {
                    "Cookie": f"__Host-MSAAUTH={mssauth}"
                },
                follow_redirects = False
            )

            location = acessTokenRedirect.headers["Location"]
            accessTokenRedirect = await session.get(
                url = location,
                follow_redirects = False
            )

            # https://www.minecraft.net/en-us/login#state=login&accessToken=<token>
            location = accessTokenRedirect.headers["Location"]
            token = re.search(r'accessToken=([^&#]+)', location)
            if not token:
                return None

            accessToken = token.group(1) + "=" * ((4 - len(token.group(1)) % 4) % 4)

            decoded_data = base64.b64decode(accessToken).decode('utf-8')
            json_data = json.loads(decoded_data)

            uhs = json_data[0].get('Item2',{}).get('DisplayClaims',{}).get('xui',[{}])[0].get('uhs')

            xsts = ""
            for item in json_data:
                if item.get('Item1') == "rp://api.minecraftservices.com/":
                    xsts = item.get('Item2', {}).get('Token', '')
                    break
                
            return {"xbl": f"XBL3.0 x={uhs};{xsts}"}
        
        except Exception:
            return None