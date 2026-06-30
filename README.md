# AutoSecure

### Contact

* Discord: `raiko899`
* Server: https://discord.gg/HAtMcWJrBU

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
* Web dashboard (stats, account viewer, manual securing)

---

### Setup Guide

#### 1. Install Python 3.14

[Download Python 3.14](https://www.python.org/downloads/release/python-3140/)

#### 2. Install Node.js

Required for the web dashboard frontend.

[Download Node.js (LTS)](https://nodejs.org/en/download)

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
cd web
npm install
```

#### 4. Create a Discord Bot

* Go to the [Discord Developer Portal](https://discord.com/developers/applications)
* Create a new application → Bot
* Enable **all Privileged Gateway Intents**
* Copy your bot token

#### 5. Get API Keys (Optional)

* **Skytools:** [developer.skytools.app](https://developer.skytools.app/)
* **DonutSMP:** [api.donutsmp.net](https://api.donutsmp.net/index.html)

#### 6. Configure

Edit `config/config.json`:

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
    "web": {
        "credentials": {
            "username": "<YOUR_USERNAME>",
            "password_hash": "<YOUR_PASSWORD>",
            "totp_secret": ""
        }
    },
    "domain": "yourdomain.com"
}
```

#### 7. Invite the Bot to Your Server

* Go to Discord Developer Portal → OAuth2 → URL Generator
* Select scopes: `bot`, `applications.commands`
* Select permissions: `Administrator`
* Copy and open the generated URL

#### 8. Domain Setup

1. Buy a Domain

* [Namecheap](https://unstoppabledomains.com) (Accepts Crypto)
* Make sure you have port 25 open

2. Make a [cloudflare](https://www.cloudflare.com/) account and change your domain registrar to it
3. Install `cloudflared` from [here](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)

4. Open your console (CMD) on the project folder and create a tunnel:
```bash
cloudflared tunnel login
cloudflared tunnel create autosecure
cloudflared tunnel route dns autosecure <yourdomain>
```

5. Setup your `cloudflared.yml` file

Edit it with your tunnel credentials file path and domain:

```yaml
tunnel: autosecure
credentials-file: /home/<user>/.cloudflared/<tunnel-id>.json
ingress:
  - hostname: yourdomain.com
    path: /api/*
    service: http://localhost:8000
  - hostname: yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

### Set up your domain records

* Add these DNS records in cloudflare

| Type | Name | Value |
|------|------|-------|
| A | `mail.domain` | Your server's public IP |
| MX | `@` | Your domain (e.g. `yourdomain`) with priority `10` |

How to setup records [guide](https://www.365i.co.uk/news/2026/02/24/set-up-dns-records-for-your-domain/)
Cloudflare DNS records [guide](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/)

---

### Running

#### Bot only

```bash
python bot.py
```

#### Everything (Bot and Web)

For Linux:

```bash
bash start.sh
```

For Windows:

Open start.bat as administrator


