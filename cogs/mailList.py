from discord import app_commands
from discord.ext import commands
import discord

from database.database import DBConnection

class mailList(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        group = self.bot.tree.get_command("mail")
        group.add_command(self.listMails)

    @app_commands.command(name="list", description="Lists all security emails")
    async def listMails(self, interaction: discord.Interaction):
        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return

        with DBConnection() as database:
            emails = list(database.getEmails())

        if not emails:
            await interaction.response.send_message(
                embed=discord.Embed(
                    title="No Emails Found",
                    description="You don't have any emails stored",
                    color=0xFF5C5C
                ),
                ephemeral=True
            )
            return
        
        embed = discord.Embed(
            title="Security Email", 
            description=f"{len(emails)} Email(s) have been found:\n", 
            color=0x678DC6,
        ).set_footer(text = "These emails are automaticly deleted after 7 days")

        for email in emails:
            embed.description += f"\n- {email[0]}"

        await interaction.response.send_message(embed=embed, ephemeral=True)

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(mailList(bot))