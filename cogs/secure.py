from discord import app_commands
from discord.ext import commands
import discord

from database.database import DBConnection

class secure(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="secure", description="Automaticly secures your account")
    @app_commands.choices(
        type=[
            app_commands.Choice(name="Recovery Code", value="recv_code"),
            app_commands.Choice(name="MSAAUTH", value="msaauth_cookie"),
        ]
    )
    async def secure(self, interaction: discord.Interaction, type: app_commands.Choice[str]):

        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return

        await interaction.response.send_message(f"**This command is still in progress.**", ephemeral=True)

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(secure(bot))
