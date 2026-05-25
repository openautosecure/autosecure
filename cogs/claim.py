from database.database import DBConnection
from discord.ext import commands
import discord
import json
import uuid


class Claim(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command(name="claim", description="Generate a new claim ID")
    async def claim(self, ctx: discord.ApplicationContext):
        config = json.load(open("config.json", "r+"))
        claims = config["claims"]

        if not claims["claims_enabled"]:
            await ctx.respond("Claims are not enabled.", ephemeral=True)
            return

        if ctx.author.id not in claims["claim_users"]:
            await ctx.respond("You do not have permission to claim accounts.", ephemeral=True)
            return

        claim_id = uuid.uuid4().hex[:8]

        with DBConnection() as database:
            if database.isClaimIdUsed(claim_id):
                await ctx.respond(
                    embed=discord.Embed(
                        title="Collision",
                        description=f"Claim ID `{claim_id}` already exists. Please try again.",
                        color=0xFF5C5C
                    ),
                    ephemeral=True
                )
                return

            database.claimAccount(claim_id, ctx.author.id)

        claim_embed = discord.Embed(
            title="Account Claimed",
            description=f"{ctx.author.mention} generated claim ID `{claim_id}`.",
            color=0x79D990
        )
        claim_embed.add_field(name="Claim ID", value=f"`{claim_id}`", inline=False)
        claim_embed.add_field(name="Claimed By", value=f"{ctx.author.mention} (`{ctx.author.id}`)", inline=False)

        logs_channel = await ctx.bot.fetch_channel(config["discord"]["logs_channel"])
        await logs_channel.send(embed=claim_embed)

        await ctx.respond(
            embed=discord.Embed(
                title="Claim ID Generated",
                description=f"Your claim ID is:\n# `{claim_id}`",
                color=0x79D990
            ),
            ephemeral=True
        )

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Claim(bot))
