from discord import ApplicationContext
from discord.ext import commands
import discord

class accounts(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @discord.slash_command(name="accounts", description="Shows you all stored accounts")
    async def accounts(self, ctx: ApplicationContext):
        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return
        
        await ctx.respond(f"**This command is still in progress**", ephemeral=True)

def setup(bot: commands.Bot) -> None:
    bot.add_cog(accounts(bot))