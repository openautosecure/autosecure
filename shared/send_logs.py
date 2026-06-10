from discord import Embed
import json

config = json.load(open("config.json", "r+"))
logs_channel = config["discord"]["logs_channel"]
censored_logs_channel = config["discord"]["censored_logs_channel"]

def censor_mail(email: str) -> str:
    try:
        user, domain = email.rsplit("@", 1)

        def mask(s: str) -> str:
            if len(s) <= 1:
                return "*"
            if len(s) == 2:
                return s[0] + "*"
            return s[0] + "*" * (len(s) - 2) + s[-1]

        parts = domain.split(".")
        cd = mask(parts[0]) + "." + ".".join(parts[1:])
        return f"{mask(user)}@{cd}"
    except Exception:
        return "***@***"

async def send_logs(client, embed: Embed = None, *, view=None, content: str = None, email: str = None, conly: bool = False):
    if not conly:
        logs_channel = await client.fetch_channel()
        await logs_channel.send(content=content, embed=embed, view=view)

    if censored_logs_channel and censored_logs_channel != logs_channel:
        censored_channel = await client.fetch_channel(censored_logs_channel)

        censored_embed = None
        if embed is not None:
            embed_dict = embed.to_dict()
            if email and "description" in embed_dict:
                embed_dict["description"] = embed_dict["description"].replace(email, censor_mail(email))
            censored_embed = Embed.from_dict(embed_dict)

        await censored_channel.send(content=content, embed=censored_embed, view=view)