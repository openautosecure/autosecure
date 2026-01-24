import urllib.parse
import re

async def decode(code):
    decoded_url = urllib.parse.unquote(code)
    decoded_text = re.sub(
        r'\\u([0-9A-Fa-f]{4})',
        lambda match: chr(int(match.group(1), 16)),
        decoded_url
    )
    
    return decoded_text