from discord import app_commands
from discord.ext import commands
import discord

from cogs.utils.genTOTP import totp
from views.buttons.cogs.totpRefresh import ButtonTOTP

class AuthGroup(app_commands.Group, name="auth"):
    def __init__(self, bot):
        super().__init__()
        self.bot = bot

    @app_commands.command(name="code", description="Generates an OTP with a 2FA Secret")
    async def code_command(self, interaction: discord.Interaction, secret: str):
        if interaction.user.id not in self.bot.admins:
            return await interaction.response.send_message("You do not have permission!", ephemeral=True)
        
        TOTP = await totp(secret.strip())
        if TOTP:
            await interaction.response.send_message(
                embed=discord.Embed(
                    title="Authenticator Code",
                    description=f"```{TOTP}```"
                ), 
                view=ButtonTOTP(secret.strip(), interaction),
                ephemeral=True
            )
            return
        
        await interaction.response.send_message("This secret is invalid.", ephemeral=True)

class AuthCog(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.bot.tree.add_command(AuthGroup(bot))

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(AuthCog(bot))