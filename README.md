# 🔒 AutoSecure

> **Contact:** `salomao31_termedv4` on Discord  
> **Contributions:** PRs welcome — reach out on Discord to discuss major changes.

---

## 📋 Overview

**AutoSecure** is a fully request-based security assessment tool for Microsoft accounts.  
No browser automation (Playwright/Selenium) — just HTTP requests.

> ⚠️ **This tool is for EDUCATIONAL & SECURITY RESEARCH PURPOSES ONLY.**  
> See [Legal Notice](#-legal--ethical-notice) below.

---

## 🚦 Status

✅ **Active development** — New features being added regularly.

---

## ✨ Features

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

## 🛠️ Setup Guide

### 1. Install Python 3.12
[Download Python 3.12](https://www.python.org/downloads/release/python-3120/)

### 2. Create a Discord Bot
- Go to the [Discord Developer Portal](https://discord.com/developers/applications)
- Create a new application → Bot
- Enable **all Privileged Gateway Intents**
- Copy your bot token

### 3. Get API Keys (Optional)
- **Hypixel:** [developer.hypixel.net](https://developer.hypixel.net/)
- **DonutSMP:** [api.donutsmp.net](https://api.donutsmp.net/index.html)

### 4. Configure the Bot
Edit `config.json`:
```json
{
  "bot_token": "YOUR_DISCORD_BOT_TOKEN",
  "owners": [YOUR_DISCORD_ID]
}

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
