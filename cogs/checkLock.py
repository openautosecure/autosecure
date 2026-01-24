from discord import app_commands
from discord.ext import commands
import discord
import json

from views.utils.checkLocked import checkLocked

class checkLock(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="check_locked", description="Checks if an account is locked")
    async def checkLock(self, interaction: discord.Interaction, email: str):

        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return

        await interaction.response.defer()

        lockedInfo = await checkLocked(email)
        
        # Not Found
        if lockedInfo:
            # Not Found
            if lockedInfo["StatusCode"] != 500:
                # Suspended
                if "Value" not in lockedInfo or json.loads(lockedInfo["Value"])["status"]["isAccountSuspended"]:
                    await interaction.response.send_message(f"This email is **locked**", ephemeral=True)
                    return
                else:
                    await interaction.response.send_message(f"This email is **not** locked", ephemeral=True)
                    return

        await interaction.response.send_message(f"Failed to check if this email is locked", ephemeral=True)

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(checkLock(bot))
