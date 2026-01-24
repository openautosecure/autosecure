from discord import app_commands
from discord.ext import commands
import discord
import json

class setChannel(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @app_commands.command(name="set_channel", description="Sets your channel IDs")
    @app_commands.choices(
        choice=[
            app_commands.Choice(name="Logs", value="logs_channel"),
            app_commands.Choice(name="Hits", value="accounts_channel"),
        ]
    )
    async def setChannels(self, interaction: discord.Interaction, choice: app_commands.Choice[str]):
        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return
        
        with open("config.json", "r") as config:
            newConfig = json.load(config)
        
        match choice.value:
            case "logs_channel":
                newConfig["discord"]["logs_channel"] = int(interaction.channel_id)
            case "accounts_channel":
                newConfig["discord"]["accounts_channel"] = int(interaction.channel_id)
        
        with open("config.json", "w") as config:
            json.dump(newConfig, config, indent=4)
        
        await interaction.response.send_message(f"Successfully set {choice.name} channel!", ephemeral=True)

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(setChannel(bot))