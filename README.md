# AutoSecure

### Contact

* Discord: `raiko899`
* Server: https://discord.gg/HAtMcWJrBU

**Contributions:** Pull requests are welcome. For major changes, please discuss them on Discord first.

### Overview

**AutoSecure** is a fully request-based security assessment tool for Microsoft accounts.
It uses no selenium or playwright.

**Active development** — New features being added regularly.

### Features

* Retrieve account owner details (name, country, birth date, etc.)
* Remove all security proofs (emails and phone numbers)
* Sign out all active devices and sessions
* Bypass email-based 2FA verification
* Check if an account is locked
* Disable 2FA
* Generate recovery codes
* Change security email
* Change password
* Remove Windows Hello keys (Zyger exploit)
* Minecraft account checker (ownership, username, purchase method, capes, SSID)
* Add Authenticator and enable 2FA
* Support for custom domains for security emails
* DonutSMP and Hypixel stats checker
* Claiming system

---

### Setup Guide

#### 1. Install Python 3.14

[Download Python 3.14](https://www.python.org/downloads/release/python-3140/)

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 3. Create a Discord Bot

* Go to the [Discord Developer Portal](https://discord.com/developers/applications)
* Create a new application → Bot
* Enable **all Privileged Gateway Intents**
* Copy your bot token

### 4. Get API Keys (Optional)

* **Skytools:** [developer.skytools.app](https://developer.skytools.app/)
* **DonutSMP:** [api.donutsmp.net](https://api.donutsmp.net/index.html)

#### 5. Configure the Bot

Edit `config.json`:

* Add your Discord ID to the owners list
* Add your bot token
* Optionally add Skytools and DonutSMP keys for stats

**Example Config:**

```json
{
    "owners": [
      <YOUR_DISCORD_ID>
    ],
    "tokens": {
        "bot_token": "<YOUR_BOT_TOKEN>",
        "skytools_key": "<YOUR_SKYTOOLS_KEY>",
        "donut_key": "<YOUR_DONUT_KEY>"
    },
    "discord": {
        "logs_channel": "",
        "censored_logs_channel": "",
        "accounts_channel": ""
    },
    "autosecure": {
        "replace_main_alias": true,
        "enable_2fa": true
    },
    "claims": {
        "claims_enabled": false,
        "claim_users": []
    },
    "mail_provider": "domain",
    "domain": "autosecure.lol"
}
```

#### 6. Invite the Bot to Your Server

* Go to Discord Developer Portal → OAuth2 → URL Generator
* Select scopes: `bot`, `applications.commands`
* Select permissions: `Administrator`
* Copy and open the generated URL

#### 7. Custom Domain Setup (Optional)

Set `"mail_provider": "domain"` in the config to use your own domain for security emails.

Requirements:

* Update MX and A records to point to your server
* Add your domain to the `"domain"` field
* Have port 25 open

---

### Notes

* You can change mail_provider to `mailtm` or `domain`
* API keys are optional but needed for Hypixel/DonutSMP commands
* Keep your bot token private

---

"For educational and security research use only. Not for unauthorized access or illegal activity. Users are responsible for compliance with applicable laws."
