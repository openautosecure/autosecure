from shared.simplify import simplify
from discord.ext import commands
from datetime import timedelta
import discord

from minecraft.get_donut import get_donut_stats
from minecraft.get_hypixel import get_hypixel_stats

class Stats(commands.Cog):
    stats = discord.SlashCommandGroup("stats")

    def __init__(self, bot):
        self.bot = bot

    @stats.command(name="donut", description="Checks your donut stats")
    async def donut(self, ctx: discord.ApplicationContext, username: str):
        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return

        await ctx.defer(ephemeral=True)

        donut_stats = await get_donut_stats(username)
        if not donut_stats:
            await ctx.followup.send("Set up your donut API key first!", ephemeral=True)
            return
        
        elif donut_stats == "Failed":
            await ctx.followup.send("That player doesn't have stats!", ephemeral=True)
            return

        result = donut_stats["result"]
        embed = discord.Embed(
            title=f"DonutSMP | {username.capitalize()}",
            description=(
                f"**Balance** • `${simplify(result['money'])}`\n"
                f"**Shards** • `{simplify(result['shards'])}`\n"
                f"**Playtime** • `{timedelta(milliseconds=int(float(result['playtime']))).days if result['playtime'] else '0'} days`\n"
                "\n"
                f"**Kills** • `{simplify(result['kills'])}`\n"
                f"**Deaths** • `{simplify(result['deaths'])}`\n"
                f"**K/D Ratio** • `{result["kd"]}`\n"
                f"**Mobs Killed** • `{simplify(result['mobs_killed'])}`\n"
                "\n"
                f"**Blocks Placed** • `{simplify(result['placed_blocks'])}`\n"
                f"**Blocks Broken** • `{simplify(result['broken_blocks'])}`\n"
                "\n"
                f"**Spent on Shop** • `${simplify(result['money_spent_on_shop'])}`\n"
                f"**Made from Sells** • `${simplify(result['money_made_from_sell'])}`"
            ),
            color=0xF4A460
        )
        embed.set_thumbnail(url=f"https://mc-heads.net/avatar/{username}/128")
        embed.set_footer(text="DonutSMP Stats")

        await ctx.followup.send(embed=embed, ephemeral=True)

    @stats.command(name="hypixel", description="Checks your Hypixel stats")
    async def hypixel(self, ctx: discord.ApplicationContext, username: str):
        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return

        await ctx.defer(ephemeral=True)

        hypixel_stats = await get_hypixel_stats(username)
        if not hypixel_stats["exists"]:
            await ctx.followup.send("Make sure you setup your Skytools key first!", ephemeral=True)
            return

        embed = discord.Embed(
            title=f"{hypixel_stats['hypixel']['rank']} Rank - {username.capitalize()}",
            description=(
                f"**Hypixel Level** • `{hypixel_stats['hypixel']['level']}`\n"
                f"**Gifted Ranks** • `{hypixel_stats['hypixel']['gifted']}`\n"
                f"**Karma** • `{simplify(hypixel_stats['hypixel']['karma'])}`\n"
                "\n"
                f"**SkyBlock Level** • `{hypixel_stats['skyblock']["level"]}`\n"
                f"**Networth** • `{simplify(hypixel_stats['skyblock']['networth'])} Coins`\n"
                "\n"
                f"**BW Wins** • `{hypixel_stats['bedwars']['wins']}`\n"
                f"**BW Deaths** • `{hypixel_stats['bedwars']['deaths']}`\n"
                f"**BW Kills** • `{hypixel_stats['bedwars']['kills']}`\n"
                f"**BW Final Kills** • `{hypixel_stats['bedwars']['final_kills']}`\n"
                f"**BW K/D** • `{hypixel_stats['bedwars']['kd']}`\n"
                "\n"
                f"**SW Wins** • `{hypixel_stats['skywars']['sw_wins']}`\n"
                f"**SW Deaths** • `{hypixel_stats['skywars']['sw_deaths']}`\n"
                f"**SW Kills** • `{hypixel_stats['skywars']['sw_kills']}`\n"
                f"**SW K/D** • `{hypixel_stats['skywars']['sw_kd']}`\n"
            ),
            color=0xFFAA00
        ).set_thumbnail(url=f"https://mc-heads.net/avatar/{username}/128")

        await ctx.followup.send(embed=embed, ephemeral=True)

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Stats(bot))
