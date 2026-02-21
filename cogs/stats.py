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
            embed = discord.Embed(
                title = f"{username.capitalize()}s Stats",
                description = f"""
                    **Money:** {millify(result['money'])}
                    **Shards:** {result['shards']}
                    **Kills:** {result['kills']}
                    **Deaths:** {result['deaths']}
                    **Playtime:** {timedelta(milliseconds=int(float(result['playtime']))).days} days
                    **Placed Blocks:** {result['placed_blocks']}
                    **Broken Blocks:** {result['broken_blocks']}
                    **Mobs Killed:** {result['mobs_killed']}
                    **Money Spent on Shop:** {millify(result['money_spent_on_shop'])}
                    **Money Made from Sell:** {millify(result['money_made_from_sell'])}
                """,
                color = 0x2765F5
            ).set_thumbnail(url=f"https://mc-heads.net/avatar/{username}/128"),
            ephemeral=True
        )

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Stats(bot))