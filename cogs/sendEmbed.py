from views.buttons.linkAccount import ButtonViewOne
from views.modals.modal_three import MyModalThree
from views.modals.embeds import embeds
from discord.ext import commands
import discord
import json

class sendEmbed(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    send = discord.SlashCommandGroup("send")
    @send.command(name="embed", description="Sends the verification embed")
    async def embed_command(
        self, 
        ctx: discord.ApplicationContext, 
        type: str = discord.Option(str, description="Choose embed type", choices=["Default", "Custom"])
    ):
        if ctx.author.id not in self.bot.admins:
            await ctx.respond(
                "You do not have permission to execute this command!", 
                ephemeral=True
            )
            return
        
        config = json.load(open("config.json", "r+"))
        
        if not config["discord"]["logs_channel"] or not config["discord"]["accounts_channel"]:
            await ctx.respond(
                "You must set the Logs and Hits channel first with /set_channel!", 
                ephemeral=True
            )
            return
        
        match type.lower():
            case "default":
                dembed = embeds["default_embed"]
                await ctx.defer(ephemeral=True)
                await ctx.channel.send(
                    embed = discord.Embed(
                        title = dembed[0],
                        description = dembed[1],
                        color = 0x678DC6
                    ),
                    view = ButtonViewOne()
                )
                await ctx.followup.send("Sent!", ephemeral=True)
            case "custom":
                await ctx.send_modal(MyModalThree())

def setup(bot: commands.Bot) -> None:
    bot.add_cog(sendEmbed(bot))