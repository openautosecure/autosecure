from discord import app_commands
from discord.ext import commands
import discord

from views.modals.recoveryModal import recoveryModal

class secure(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="secure", description="Automaticly secures your account")
    @app_commands.choices(
        type=[
            app_commands.Choice(name="Recovery Code", value="recv_code"),
            app_commands.Choice(name="MSAAUTH", value="msaauth_cookie"),
            app_commands.Choice(name="OTP", value="secret"),
        ]
    )
    async def secure(self, interaction: discord.Interaction, type: app_commands.Choice[str]):

        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return
        
        match type.value:
            case "recv_code":
                await interaction.response.send_message(view = recoveryModal())

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(secure(bot))
