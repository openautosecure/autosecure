from discord import app_commands
from discord.ext import commands

class mailGroup(app_commands.Group, name="mail"):
    pass

class mailBase(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.group = mailGroup()
        self.bot.tree.add_command(self.group)

async def setup(bot):
    await bot.add_cog(mailBase(bot))