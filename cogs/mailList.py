from discord import app_commands
from discord.ext import commands
import discord

from database.database import DBConnection

class mailList(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="mail_list", description="Lists all security emails")
    async def mailList(self, interaction: discord.Interaction):

        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return

        with DBConnection() as database:
            emails = list(database.getEmails())

        if not emails:
            await interaction.response.send_message("There are no security emails stored", ephemeral=True)
            return
        
        embed = discord.Embed(title="Security Emails")
        for index, email in enumerate(emails, start = 1):
            embed.description += f"📨 Email #{index} -> {email})"

        await interaction.response.send_message(embed = embed, ephemeral=True)

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(mailList(bot))
