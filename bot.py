from discord.ext import commands
import requests
import logging
import discord
import asyncio
import socket
import json
import sys
import os

from views.buttons.linkAccount import ButtonViewOne
from database.database import DBConnection
from mail.server import startServer

config = json.load(open("config.json", "r+"))

class DiscordBot(commands.Bot):
    def __init__(self):
        super().__init__(
            command_prefix="!",
            case_insensitive=True,
            intents=discord.Intents.all(),
            allowed_mentions=discord.AllowedMentions(roles=False, everyone=False, users=True)
        )
        self.logger = logging.getLogger("bot")
        self.admins = map(int, config["owners"])

    async def on_ready(self):
        self.add_view(ButtonViewOne())
        self._startup_guild_sync_done = True

        for guild in self.guilds:
            try:
                await self.sync_commands(guild_ids=[guild.id])  
                self.logger.info(
                    f"Synced application commands (guild={guild.id})."
                )
            except Exception as e:
                self.logger.exception(
                    f"Failed to sync application commands for guild {guild.id}: {e}"
                )

    @staticmethod
    def setup_logging() -> None:
        logging.basicConfig(filename="Logs/securing.log", level=logging.INFO)
        logging.getLogger("discord").setLevel(logging.INFO)
        logging.getLogger("discord.http").setLevel(logging.WARNING)
        logging.getLogger("httpx").setLevel(logging.DEBUG)
        
        logging.basicConfig(
            level=logging.INFO,
            format="%(levelname)s | %(asctime)s | %(name)s | %(message)s",
            stream=sys.stdout,
        )

    async def load_cogs(self, directory="./cogs") -> None:
        for file in os.listdir(directory):
            if file.endswith(".py") and not file.startswith("_"):
                self.load_extension(
                    f"{directory[2:].replace('/', '.')}.{file[:-3]}"
                )
                self.logger.info(f"Loaded: {file[:-3]}")
            elif not (
                file in ["__pycache__", "utils", "buttons", "modals"] or file.endswith(("pyc", "txt"))
            ):
                await self.load_cogs(f"{directory}/{file}")


        with DBConnection() as database:
            database.setupTables()

# Simple check for dynamic ips (Not needed if you're using a VPS)
if config["mail_provider"] == "domain" and config["domain"]:
    domain: str = config["domain"]

    if not domain.startswith("mail."):
        domain = f"mail.{domain}"

    domain_ip = socket.gethostbyname(domain)
    public_ip = requests.get("https://api.ipify.org").text
    if domain_ip != public_ip:
        print(f"""
              [X] - Your public IP has been changed! Update your domain records
              Public IP - {public_ip}
              Domain IP - {domain_ip}
        """)
        exit()
        
asyncio.set_event_loop(asyncio.new_event_loop())
bot = DiscordBot()

async def main():
    async with bot:
        bot.remove_command("help")
        bot.setup_logging()

        if config["mail_provider"] == "domain":
            startServer()

        await bot.load_cogs()
        await bot.start(config["tokens"]["bot_token"])

asyncio.run(main())