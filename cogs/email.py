from discord import app_commands
from discord.ext import commands
import discord

from cogs.buttons.getInbox import getInbox

class Email(commands.Cog):
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

        inbox = await getInbox(email)

        if not inbox:
            await interaction.response.send_message(
                embed = discord.Embed(
                        description = "This email has not been found",
                        color = 0xFF5C5C
                    ),
                ephemeral=True
            )
            return
        
        await interaction.response.send_message(
            embed = inbox["embed"],
            view = inbox["view"],
            ephemeral = True
        )
async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Email(bot))
