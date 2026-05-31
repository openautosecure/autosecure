from discord.ext import commands
import discord

class Goon(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @discord.slash_command(name="config", description="Set up your bot config")
    async def command(self, ctx: discord.ApplicationContext):
        pass

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Goon(bot))