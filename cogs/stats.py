from discord.ext import commands
from datetime import timedelta
from millify import millify
import discord

from views.utils.minecraft.getDonut import getDonutStats

class Stats(commands.Cog):
    stats = discord.SlashCommandGroup("stats")

    def __init__(self, bot):
        self.bot = bot

    @stats.command(name="donut", description="Checks your donut stats")
    async def checkLock(self, ctx: discord.ApplicationContext, username: str):

        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return

        await ctx.defer(ephemeral=True)

        donut_stats = await getDonutStats(username)
        if not donut_stats:
            await ctx.followup.send("Set up your donut API key first!", ephemeral = True)
            return
        elif donut_stats == "Failed":
            await ctx.followup.send("That player doesn't have stats!", ephemeral = True)
            return
        
        result = donut_stats["result"]
        print(result)
        await ctx.followup.send(
        f"**Money:** {millify(result['money'])}\n"
        f"**Shards:** {result['shards']}\n"
        f"**Kills:** {result['kills']}\n"
        f"**Deaths:** {result['deaths']}\n"
        f"**Playtime:** {timedelta(milliseconds=int(float(result['playtime']))).days} days\n"
        f"**Placed Blocks:** {result['placed_blocks']}\n"
        f"**Broken Blocks:** {result['broken_blocks']}\n"
        f"**Mobs Killed:** {result['mobs_killed']}\n"
        f"**Money Spent on Shop:** {millify(result['money_spent_on_shop'])}\n"
        f"**Money Made from Sell:** {millify(result['money_made_from_sell'])}",
        ephemeral=True
    )

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Stats(bot))