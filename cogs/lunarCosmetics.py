from discord import app_commands
from discord.ext import commands
import discord

class Lunar(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        group = self.bot.tree.get_command("cosmetics")
        group.add_command(self.emailInbox)

    @app_commands.command(name="lunar", description="Shows the lunar cosmetics associated with this account")
    async def lunarCosmetics(self, interaction: discord.Interaction, ssid: str):
        
        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return
        


        

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Lunar(bot))
