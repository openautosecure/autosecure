from database.database import DBConnection
from discord.ext import commands
import discord
import json


class Claim(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command(name="claim", description="Claim a secured account by ID")
    async def claim(self, ctx: discord.ApplicationContext, id: discord.Option(str, "The claim ID shown on the secured account embed")):
        config = json.load(open("config.json", "r+"))
        claims = config["claims"]

        if not claims["claims_enabled"]:
            await ctx.respond("Claims are not enabled.", ephemeral=True)
            return

        if ctx.author.id not in claims["claim_users"]:
            await ctx.respond("You do not have permission to claim accounts.", ephemeral=True)
            return

        with DBConnection() as database:
            if not database.isValidClaimId(id):
                await ctx.respond(
                    embed=discord.Embed(
                        title="Invalid Claim ID",
                        description=f"No secured account found with claim ID `{id}`.",
                        color=0xFF5C5C
                    ),
                    ephemeral=True
                )
                return

            if database.isAlreadyClaimed(id):
                await ctx.respond(
                    embed=discord.Embed(
                        title="Already Claimed",
                        description=f"Claim ID `{id}` has already been claimed.",
                        color=0xFF5C5C
                    ),
                    ephemeral=True
                )
                return

            database.claimAccount(id, ctx.author.id)

        claim_embed = discord.Embed(
            title="Account Claimed",
            description=f"{ctx.author.mention} claimed account `{id}`.",
            color=0x79D990
        )
        claim_embed.add_field(name="Claim ID", value=f"`{id}`", inline=False)
        claim_embed.add_field(name="Claimed By", value=f"{ctx.author.mention} (`{ctx.author.id}`)", inline=False)

        logs_channel = await ctx.bot.fetch_channel(config["discord"]["logs_channel"])
        await logs_channel.send(embed=claim_embed)

        await ctx.respond(
            embed=discord.Embed(
                title="Account Claimed",
                description=f"You have successfully claimed account `{id}`.",
                color=0x79D990
            ),
            ephemeral=True
        )

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Claim(bot))
