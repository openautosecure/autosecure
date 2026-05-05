# AutoSecure

> **New Discord Server:** https://discord.gg/HAtMcWJrBU.
> **Contact:** `salomao31_termedv6` on Discord.
> **Contributions:** PRs welcome — reach out on Discord to discuss major changes.

---
https://discord.gg/HAtMcWJrBU
## 📋 Overview

**AutoSecure** is a fully request-based security assessment tool for Microsoft accounts.  
No browser automation (Playwright/Selenium) — just HTTP requests.

> **This tool is for EDUCATIONAL & SECURITY RESEARCH PURPOSES ONLY.**  
> See [Legal Notice](#-legal--ethical-notice) below.

---

## Status

**Active development** — New features being added regularly.

---

## Features

| Status | Feature |
|--------|---------|
| ✅ | Retrieve account owner info (name, country, birthday, etc.) |
| ✅ | Remove all security proofs (emails, phone numbers) |
| ✅ | Sign out of all active devices |
| ✅ | Bypass email-based 2FA verification |
| ✅ | Check if an account is locked |
| ✅ | Disable 2FA |
| ✅ | Generate recovery code |
| ✅ | Change security email |
| ✅ | Change password |
| ✅ | Remove Windows Hello keys (Zyger exploit demonstration) |
| ✅ | Minecraft account check (ownership, username, purchase method, capes, SSID) |
| ✅ | DonutSMP stats checker |
| ✅ | Hypixel stats checker |
| ❌ | Change primary alias *(planned)* |

---

## Setup Guide

### 1. Install Python 3.12
[Download Python 3.12](https://www.python.org/downloads/release/python-3120/)

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Create a Discord Bot
- Go to the [Discord Developer Portal](https://discord.com/developers/applications)
- Create a new application → Bot
- Enable **all Privileged Gateway Intents**
- Copy your bot token

### 4. Get API Keys (Optional)
- **Skytools:** [developer.skytools.app](https://developer.skytools.app/)
- **DonutSMP:** [api.donutsmp.net](https://api.donutsmp.net/index.html)

### 5. Configure the Bot
Edit `config.json`:

- Add your discord ID to the owners list
- Add your bot token
- Optionally you can add your skytools and donut key for stats
  
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
        "replace_main_alias": true
    }
}

```

### 6. Invite the Bot to Your Server
- Go to the Discord Developer Portal → Your Application → OAuth2 → URL Generator
- Select scopes: `bot`, `applications.commands`
- Select permissions: `Administrator` (or the specific ones you need)
- Copy and open the generated URL to invite the bot

### 7. Run the Bot
```bash
python main.py
```

### Notes
- The bot requires Python 3.12 or higher
- API keys are optional but required for Hypixel/DonutSMP related commands
- Make sure your bot token is kept private and never shared

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
