from discord import app_commands
from discord.ext import commands
import discord
import httpx

from database.database import DBConnection
from cogs.utils.fetchInbox import fetchInbox
from views.buttons.button_refresh import ButtonRefresh

class email(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="email", description="Shows the inbox of your email")
    async def email(self, interaction: discord.Interaction, email: str):

        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return

        with DBConnection() as db:
            password = db.getEmailPassword(email)

            if not password:
                await interaction.response.send_message("This email has not been found.", ephemeral=True)
        
        
        async with httpx.AsyncClient(timeout=None) as session:

            data = await session.post(  
                url = "https://api.mail.tm/token",
                headers = {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                json = {
                    "address": email,
                    "password": password[0]
                }
            )

            token = data.json()["token"]
        
        getEmails = await fetchInbox(token, email, password[0])

        interaction = await interaction.response.send_message(
            embed = getEmails,
            view = ButtonRefresh(token, email, password[0], interaction),
            ephemeral=True
        )
        return

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(email(bot))
