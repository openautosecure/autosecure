import time
import hmac
import hashlib
import base64
import struct

async def totp(secret: str) -> str | None:

    try:
        secret = secret.upper().replace(" ", "").replace("\n", "").replace("\r", "")

        padding = (8 - len(secret) % 8) % 8
        secret_padded = secret + "=" * padding
        
        k = base64.b32decode(secret_padded)
        c = int(time.time()) // 30
        h = hmac.new(k, struct.pack(">Q", c), hashlib.sha1).digest()
        
        o = h[-1] & 15
        code = struct.unpack(">I", h[o:o+4])[0] & 0x7fffffff
        return f"{code % 1000000:06d}"
        
    except Exception as e:
        return None