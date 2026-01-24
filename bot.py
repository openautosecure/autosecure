from discord.ext import commands
import logging
import discord
import httpx
import json
import sys
import os

from views.buttons.button_one import ButtonViewOne
from database.database import DBConnection

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
        self.admins = config["owners"]
    
    async def setup_hook(self) -> None:
        await self.load_cogs()
        try:
            synced = await self.tree.sync()
            self.logger.info(f"Synced {len(synced)} application commands (global).")
        except Exception as e:
            self.logger.exception(f"Failed to sync application commands: {e}")
    
    async def on_ready(self):
        self.add_view(ButtonViewOne())
    
    @staticmethod
    def setup_logging() -> None:
        logging.getLogger("discord").setLevel(logging.INFO)
        logging.getLogger("discord.http").setLevel(logging.WARNING)
        logging.getLogger("httpx").setLevel(logging.DEBUG)
        logging.getLogger("httpcore").setLevel(logging.DEBUG)
        
        logging.basicConfig(
            level=logging.INFO,
            format="%(levelname)s | %(asctime)s | %(name)s | %(message)s",
            stream=sys.stdout,
        )
        
        original_send = httpx.AsyncClient.send
        async def logged_send(self, request, **kwargs):
            logger = logging.getLogger("httpx.response")
            response = await original_send(self, request, **kwargs)
            try:
                logger.debug(f"URL {request.url}: Response {response.text}")
            except:
                pass
            return response

        httpx.AsyncClient.send = logged_send
    
    async def load_cogs(self, directory="./cogs") -> None:
        for file in os.listdir(directory):
            if file.endswith(".py") and not file.startswith("_"):
                await self.load_extension(
                    f"{directory[2:].replace('/', '.')}.{file[:-3]}"
                )
                self.logger.info(f"Loaded: {file[:-3]}")
            elif not (
                file in ["__pycache__", "utils"] or file.endswith(("pyc", "txt"))
            ) and not file.startswith("_"):
                await self.load_cogs(f"{directory}/{file}")
        await self.load_extension("jishaku")

with DBConnection() as database:
    database.cursor.execute("""
            CREATE TABLE IF NOT EXISTS `security_emails` (
                email TEXT,
                password TEXT
            )
        """)
    database.conn.commit()

bot = DiscordBot()
bot.remove_command("help")
bot.setup_logging()
bot.run(
    config["tokens"]["bot_token"], 
    log_handler=None
)