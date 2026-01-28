from discord import app_commands
from discord.ext import commands
import discord
import json

from views.buttons.linkAccount import ButtonViewOne
from views.modals.modal_three import MyModalThree
from views.modals.embeds import embeds

class sendGroup(app_commands.Group, name="send"):
    def __init__(self, bot):
        super().__init__()
        self.bot = bot
    
    @app_commands.command(name="embed", description="Sends the verification embed")
    @app_commands.choices(
        type=[
            app_commands.Choice(name="Default", value="default"),
            app_commands.Choice(name="Custom", value="custom")
        ]
    )
    async def embed_command(self, interaction: discord.Interaction, type: app_commands.Choice[str]):
        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message(
                "You do not have permission to execute this command!", 
                ephemeral=True
            )
            return
        
        config = json.load(open("config.json", "r+"))
        
        if not config["discord"]["logs_channel"] or not config["discord"]["accounts_channel"]:
            await interaction.response.send_message(
                "You must set the Logs and Hits channel first with /set_channel!", 
                ephemeral=True
            )
            return

        match type.value:
            case "default":
                dembed = embeds["default_embed"]
                await interaction.response.defer(ephemeral=True)
                await interaction.channel.send(
                    embed = discord.Embed(
                        title = dembed[0],
                        description = dembed[1],
                        color = 0x678DC6
                    ),
                    view = ButtonViewOne()
                )
                await interaction.followup.send("Sent!", ephemeral=True)
            case "custom":
                await interaction.response.send_modal(MyModalThree())

class sendEmbed(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.bot.tree.add_command(sendGroup(bot))

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(sendEmbed(bot))