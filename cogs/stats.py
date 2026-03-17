from views.utils.minecraft.simplify import simplify
from discord.ext import commands
from datetime import timedelta
import discord

from views.utils.minecraft.getDonut import getDonutStats
from views.utils.minecraft.getHypixel import getHypixelStats

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

        donut_stats = await getDonutStats(username)
        if not donut_stats:
            await ctx.followup.send("Set up your donut API key first!", ephemeral=True)
            return
        elif donut_stats == "Failed":
            await ctx.followup.send("That player doesn't have stats!", ephemeral=True)
            return

        result = donut_stats["result"]

        try:
            kd = round(result['kills'] / result['deaths'], 2) if result['deaths'] > 0 else result['kills']
        except Exception:
            kd = "N/A"

        embed = discord.Embed(
            title=f"🍩 DonutSMP — {username.capitalize()}",
            description=(
                f"💰 **Balance** • `${simplify(result['money'])}`\n"
                f"💎 **Shards** • `{simplify(result['shards'])}`\n"
                f"⏱️ **Playtime** • `{timedelta(milliseconds=int(float(result['playtime']))).days} days`\n"
                f"\n"
                f"⚔️ **Kills** • `{simplify(result['kills'])}`\n"
                f"💀 **Deaths** • `{simplify(result['deaths'])}`\n"
                f"📊 **K/D Ratio** • `{kd}`\n"
                f"🐾 **Mobs Killed** • `{simplify(result['mobs_killed'])}`\n"
                f"\n"
                f"🧱 **Blocks Placed** • `{simplify(result['placed_blocks'])}`\n"
                f"⛏️ **Blocks Broken** • `{simplify(result['broken_blocks'])}`\n"
                f"\n"
                f"🏪 **Spent on Shop** • `${simplify(result['money_spent_on_shop'])}`\n"
                f"💵 **Made from Sells** • `${simplify(result['money_made_from_sell'])}`"
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

        hypixel_stats = await getHypixelStats(username)
        if not hypixel_stats:
            await ctx.followup.send("Make sure you setup your Hypixel and Skytools key first!", ephemeral=True)
            return
        
        elif hypixel_stats == "Failed":
            await ctx.followup.send("That player doesn't exist!", ephemeral=True)
            return

        try:
            bw_kd = round(hypixel_stats['bw_kills'] / hypixel_stats['bw_deaths'], 2) if hypixel_stats['bw_deaths'] > 0 else hypixel_stats['bw_kills']
            sw_kd = round(hypixel_stats['sw_kills'] / hypixel_stats['sw_deaths'], 2) if hypixel_stats['sw_deaths'] > 0 else hypixel_stats['sw_kills']
        except Exception:
            bw_kd = sw_kd = "N/A"

        embed = discord.Embed(
            title=f"{hypixel_stats['rank']} Rank — {username.capitalize()}",
            description=(
                f"⭐ **Hypixel Level** • `{hypixel_stats['hlevel']}`\n"
                f"🎁 **Gifted Ranks** • `{hypixel_stats['gifted']}`\n"
                f"🌌 **SkyBlock Level** • `{hypixel_stats['slevel']}`\n"
                f"💰 **Networth** • `${simplify(hypixel_stats['networth'])}`\n"
                f"\n"
                f"✨ **Karma** • `{simplify(hypixel_stats['karma'])}`\n"
                f"🏆 **Achievement Points** • `{simplify(hypixel_stats['achievement_points'])}`\n"
                f"\n"
                f"🛏️ **BW Wins** • `{simplify(hypixel_stats['bw_wins'])}`\n"
                f"💀 **BW Deaths** • `{simplify(hypixel_stats['bw_deaths'])}`\n"
                f"⚔️ **BW Kills** • `{simplify(hypixel_stats['bw_kills'])}`\n"
                f"🎯 **BW Final Kills** • `{simplify(hypixel_stats['bw_final_kills'])}`\n"
                f"📊 **BW K/D** • `{bw_kd}`\n"
                f"\n"
                f"🌀 **SW Wins** • `{simplify(hypixel_stats['sw_wins'])}`\n"
                f"💀 **SW Deaths** • `{simplify(hypixel_stats['sw_deaths'])}`\n"
                f"⚔️ **SW Kills** • `{simplify(hypixel_stats['sw_kills'])}`\n"
                f"📊 **SW K/D** • `{sw_kd}`\n"
            ),
            color=0xFFAA00
        )
        embed.set_thumbnail(url=f"https://mc-heads.net/avatar/{username}/128")

        await ctx.followup.send(embed=embed, ephemeral=True)

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Stats(bot))
