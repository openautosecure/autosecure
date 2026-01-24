# AutoSecure

**Contact:** `maka677` / `salomao31_termedv4`

**Big thanks to these contributors**:
- `Enrique (22robin)`

# IMPORTANT LEGAL AND ETHICAL NOTICE – READ BEFORE USING 

**This tool is provided STRICTLY for EDUCATIONAL, RESEARCH, and SECURITY TESTING PURPOSES ONLY.**

- This project demonstrates concepts in account authentication, session handling, automation, or security testing.
- **It is NOT intended, designed, or to be used for unauthorized access, account takeover, credential stuffing, phishing, fraud, or any illegal activity.**
- Using this tool against any account or service **without explicit written permission** from the owner is **illegal** and violates laws such as the Computer Fraud and Abuse Act (CFAA) in the US, and equivalent laws in other jurisdictions.
- The author(s) **do not condone**, encourage, or take any responsibility for misuse of this code.
- If you are a security researcher or student, use this **only in controlled lab environments**, on accounts/services you own, or with explicit permission (e.g., bug bounty programs that allow such testing).
- Microsoft / Minecraft / any other mentioned services: **This is not affiliated with, endorsed by, or targeted at Microsoft in any malicious way.**

**Misuse of this tool may result in permanent bans, legal consequences, or account termination.**

If you believe this repository violates GitHub's / GitLab's terms, please contact the maintainer directly before reporting so we can address any concerns.

By using, cloning, or forking this repository, you agree to use it **only in compliance with all applicable laws** and for **ethical purposes only**.


---

## Overview

**It is fully request based.** No browser simulation aka playwright/selenium is used.

---
### Status

- Adding Features
  
## Features

* [ ] - Get Owners Info (Name, Country...)
* [ ] - Grabs all purchases
* [ ] - Grabs Xbox gamertag
* [ ] - Grabs subscriptions
* [X] - Change primary alias
* [X] - Removes all security proofs (emails)
* [X] - Signs out of all devices
* [X] - Bypasses email 2FA verification
* [X] - Checks if an account is locked
* [X] - Disables 2FA
* [X] - Improved embeds 
* [X] - Gets recovery code
* [X] - Changes security email
* [X] - Changes password
* [X] - Removes Windows Hello keys (Zyger exploit)
* [X] - Checks Minecraft (Owns MC, username/no name set, purchase method, capes, SSID)

---

## How to Set Up

1. **Install Python 3.12:**
   [Download Here](https://www.python.org/downloads/release/python-3120/)

2. **Create a Bot:**
   Get a Discord bot token and enable all intents [here](https://discord.com/developers/applications).

3. **Get API Keys:**

   * [Hypixel](https://developer.hypixel.net/) for Hypixel stats. (Optional)
    
4. **Configure the Bot:**
   Edit `config.json` and add:

   ```python
   bot_token = "YOUR_DISCORD_BOT_TOKEN"
   owners = [YOUR_DISCORD_ID]
   ```

5. **Install Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

6. **Run the Bot:**

   ```bash
   python bot.py
   ```

7. **Set Logs Channel:**
   Use `/set` to select where logs go.

8. **Set your Verification Embed:**
   Use `send_embed` to send the verification embed in the same channel you are in.
   
---
