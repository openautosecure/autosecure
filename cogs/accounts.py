from discord import app_commands
from discord.ext import commands
import discord

class accounts(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="accounts", description="Shows you all stored accounts")
    async def accounts(self, interaction: discord.Interaction):

        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return

        await interaction.response.send_message(f"**This command is still in progress**", ephemeral=True)

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(accounts(bot))
