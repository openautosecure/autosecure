from discord.ext import commands
import discord

from cogs.utils.genTOTP import totp
from cogs.buttons.refreshTOTP import ButtonTOTP

class authCode(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    auth = discord.SlashCommandGroup("auth", "Command related to generating TOTPs")
    @auth.command(name="code", description="Generates an OTP with a 2FA Secret")
    async def code_command(self, ctx: discord.ApplicationContext, secret: str):
        if ctx.author.id not in self.bot.admins:
            return await ctx.respond("You do not have permission!", ephemeral=True)
        
        TOTP = await totp(secret.strip())
        if TOTP:
            await ctx.respond(
                embed=discord.Embed(
                    title="Authenticator Code",
                    description=f"```{TOTP}```"
                ), 
                view=ButtonTOTP(secret.strip(), ctx),
                ephemeral=True
            )
            return
        
        await ctx.respond("This secret is invalid.", ephemeral=True)

def setup(bot: commands.Bot) -> None:
    bot.add_cog(authCode(bot))