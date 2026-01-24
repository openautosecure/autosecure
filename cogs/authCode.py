from discord import app_commands
from discord.ext import commands
import discord

from cogs.utils.genTOTP import totp
from views.buttons.button_totp import ButtonTOTP

class authCode(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="authcode", description="Generates an OTP with a 2FA Secret")
    async def authCode(self, interaction: discord.Interaction, secret: str):

        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
        
        TOTP = await totp(secret.strip())

        if TOTP:

            interaction = await interaction.response.send_message(
                embed = discord.Embed(
                    title = "Authenticator Code",
                    description = f"```{TOTP}```"
                ), 
                view = ButtonTOTP(
                    secret.strip(),
                    interaction
                ),
                ephemeral = True
            )
            return
        
        await interaction.response.send_message("This secret is invalid.", ephemeral = True)

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(authCode(bot))
