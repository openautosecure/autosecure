from discord import app_commands
from discord.ext import commands
import discord
import json

from views.modals.modal_three import MyModalThree

class sendEmbed(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="send_embed", description="Sends the verification embed")
    async def verificationEmbed(self, interaction: discord.Interaction):
        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return

        config = json.load(open("config.json", "r+"))
        
        if not config["discord"]["logs_channel"] or not config["discord"]["accounts_channel"]:
            await interaction.response.send_message(
                "You must set the Logs and Hits channel first with /set_channel!", 
                ephemeral = True 
            )
            return
        
        await interaction.response.send_modal(MyModalThree())
        await interaction.channel.send(
            "Embed sent!",
            ephemeral = True
        )

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(sendEmbed(bot))
