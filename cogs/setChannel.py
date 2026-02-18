from discord.ext import commands
import discord
import json

class setChannel(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    set = discord.SlashCommandGroup("set")
    @set.command(name="channel", description="Sets your channel ID")
    async def setChannels(
        self, 
        ctx: discord.ApplicationContext, 
        choice: str = discord.Option(description="Choose channel type", choices=["Logs", "Hits"])
    ):
        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return
        
        with open("config.json", "r") as config:
            newConfig = json.load(config)
        
        match choice.lower():
            case "logs":
                newConfig["discord"]["logs_channel"] = int(ctx.channel_id)
            case "hits":
                newConfig["discord"]["accounts_channel"] = int(ctx.channel_id)
        
        with open("config.json", "w") as config:
            json.dump(newConfig, config, indent=4)
        
        await ctx.respond(f"Successfully set {choice} channel!", ephemeral=True)

def setup(bot: commands.Bot) -> None:
    bot.add_cog(setChannel(bot))