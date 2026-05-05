from database.database import DBConnection
from discord.ext import commands
import discord
import json


class Claim(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command(name="claim", description="Claim a Minecraft account")
    async def claim(self, ctx: discord.ApplicationContext, username: str):
        config = json.load(open("config.json", "r+"))
        claims_config = config.get("claims", {})

        if not claims_config["claims_enabled"]:
            await ctx.respond("Claims are not enabled.", ephemeral=True)
            return

        if ctx.author.id not in claims_config["claim_users"]:
            await ctx.respond("You do not have permission to claim accounts.", ephemeral=True)
            return

        with DBConnection() as database:
            if database.isAccountClaimed(username):
                await ctx.respond(
                    embed=discord.Embed(
                        title="Already Claimed",
                        description=f"**{username}** has already been claimed.",
                        color=0xFF5C5C
                    ),
                    ephemeral=True
                )
                return

            database.claimAccount(username, ctx.author.id)

        claim_embed = discord.Embed(
            title="Account Claimed",
            description=f"{ctx.author.mention} has claimed **{username}**!",
            color=0x79D990
        )
        claim_embed.set_thumbnail(url=f"https://mc-heads.net/avatar/{username}/128")

        logs_channel = await ctx.bot.fetch_channel(config["discord"]["logs_channel"])
        await logs_channel.send(embed=claim_embed)

        await ctx.respond(
            embed=discord.Embed(
                description=f"You have claimed **{username}**.",
                color=0x79D990
            ),
            ephemeral=True
        )

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Claim(bot))
