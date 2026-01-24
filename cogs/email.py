from discord import app_commands
from discord.ext import commands
import discord
import httpx

from database.database import DBConnection
from cogs.utils.fetchInbox import fetchInbox
from cogs.utils.emailView import emailView

class email(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        group = self.bot.tree.get_command("mail")
        group.add_command(self.emailInbox)

    @app_commands.command(name="inbox", description="Shows the inbox of your email")
    async def emailInbox(self, interaction: discord.Interaction, email: str):
        
        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return

        with DBConnection() as db:
            password = db.getEmailPassword(email)

            if not password:
                await interaction.response.send_message(
                    embed = discord.Embed(
                        description = "This email has not been found",
                        color = 0xFF5C5C
                    ),
                    ephemeral=True
                )
                return
        
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
        
        emails = await fetchInbox(token)
        index = 0

        if not emails:
            await interaction.response.send_message(
                embed = discord.Embed(
                    title = "No Emails Found",
                    description = "You don't have any emails stored",
                    color = 0xFF5C5C
                )
            )
            return
        
        view = emailView(emails)
        await interaction.response.send_message(
            embed=view.getEmbed(),
            view=view,
            ephemeral = True
        )
           
        

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(email(bot))
