from discord import Embed

def censorMail(email: str) -> str:
    try:
        user, domain = email.rsplit("@", 1)
        cu = user[0] + "*" * max(len(user) - 2, 1) + (user[-1] if len(user) > 1 else "")
        parts = domain.split(".")
        cd = (
            parts[0][0]
            + "*" * max(len(parts[0]) - 2, 1)
            + (parts[0][-1] if len(parts[0]) > 1 else "")
            + "."
            + ".".join(parts[1:])
        )
        return f"{cu}@{cd}"
    except Exception:
        return "***@***"

async def sendLogs(client, config, embed: Embed = None, *, view=None, content: str = None, email: str = None):
    logs_channel = await client.fetch_channel(config["discord"]["logs_channel"])
    await logs_channel.send(content=content, embed=embed, view=view)

    censored_id = config["discord"]["censored_logs_channel"]
    if censored_id:
        censored_channel = await client.fetch_channel(censored_id)

        censored_embed = None
        if embed is not None:
            embed_dict = embed.to_dict()
            if email and "description" in embed_dict:
                embed_dict["description"] = embed_dict["description"].replace(email, censorMail(email))
            censored_embed = Embed.from_dict(embed_dict)

        await censored_channel.send(content=content, embed=censored_embed, view=view)