from discord.ext import commands
import discord

class Goon(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @discord.slash_command(name="goon", description="goons")
    async def code_command(self, ctx: discord.ApplicationContext):
        ctx.response.send_message("https://pornhub.com", ephemeral=True)

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Goon(bot))