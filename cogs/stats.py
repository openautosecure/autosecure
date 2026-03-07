from discord.ext import commands
from datetime import timedelta
from millify import millify
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
                f"💰 **Balance** • `${millify(result['money'])}`\n"
                f"💎 **Shards** • `{millify(result['shards'])}`\n"
                f"⏱️ **Playtime** • `{timedelta(milliseconds=int(float(result['playtime']))).days} days`\n"
                f"\n"
                f"⚔️ **Kills** • `{millify(result['kills'])}`\n"
                f"💀 **Deaths** • `{millify(result['deaths'])}`\n"
                f"📊 **K/D Ratio** • `{kd}`\n"
                f"🐾 **Mobs Killed** • `{millify(result['mobs_killed'])}`\n"
                f"\n"
                f"🧱 **Blocks Placed** • `{millify(result['placed_blocks'])}`\n"
                f"⛏️ **Blocks Broken** • `{millify(result['broken_blocks'])}`\n"
                f"\n"
                f"🏪 **Spent on Shop** • `${millify(result['money_spent_on_shop'])}`\n"
                f"💵 **Made from Sells** • `${millify(result['money_made_from_sell'])}`"
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
            await ctx.followup.send("Set up your Hypixel API key first!", ephemeral=True)
            return
        elif hypixel_stats == "Failed":
            await ctx.followup.send("That player doesn't have stats!", ephemeral=True)
            return

        result = hypixel_stats["result"]

        try:
            bw_kd = round(result['bw_kills'] / result['bw_deaths'], 2) if result['bw_deaths'] > 0 else result['bw_kills']
            sw_kd = round(result['sw_kills'] / result['sw_deaths'], 2) if result['sw_deaths'] > 0 else result['sw_kills']
        except Exception:
            bw_kd = sw_kd = "N/A"

        embed = discord.Embed(
            title=f"🟡 Hypixel — {username.capitalize()}",
            description=(
                f"⭐ **Level** • `{result['level']}`\n"
                f"✨ **Karma** • `{millify(result['karma'])}`\n"
                f"🏆 **Achievement Points** • `{millify(result['achievement_points'])}`\n"
                f"\n"
                f"🛏️ **BW Wins** • `{millify(result['bw_wins'])}`\n"
                f"💀 **BW Deaths** • `{millify(result['bw_deaths'])}`\n"
                f"⚔️ **BW Kills** • `{millify(result['bw_kills'])}`\n"
                f"🎯 **BW Final Kills** • `{millify(result['bw_final_kills'])}`\n"
                f"📊 **BW K/D** • `{bw_kd}`\n"
                f"\n"
                f"🌀 **SW Wins** • `{millify(result['sw_wins'])}`\n"
                f"💀 **SW Deaths** • `{millify(result['sw_deaths'])}`\n"
                f"⚔️ **SW Kills** • `{millify(result['sw_kills'])}`\n"
                f"📊 **SW K/D** • `{sw_kd}`\n"
            ),
            color=0xFFAA00
        )
        embed.set_thumbnail(url=f"https://mc-heads.net/avatar/{username}/128")
        embed.set_footer(text="Hypixel Stats")

        await ctx.followup.send(embed=embed, ephemeral=True)

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Stats(bot))
