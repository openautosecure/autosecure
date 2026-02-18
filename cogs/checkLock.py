from discord.ext import commands
import discord
import json

from views.utils.checkLocked import checkLocked

class checkLock(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command(name="check_locked", description="Checks if an account is locked")
    async def checkLock(self, ctx: discord.ApplicationContext, email: str):

        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return

        await ctx.defer()

        lockedInfo = await checkLocked(email)
        
        # Not Found
        if lockedInfo:
            # Not Found
            if lockedInfo["StatusCode"] != 500:
                # Suspended
                if "Value" not in lockedInfo or json.loads(lockedInfo["Value"])["status"]["isAccountSuspended"]:
                    await ctx.followup.send(f"This email is **locked**", ephemeral=True)
                    return
                else:
                    await ctx.followup.send(f"This email is **not** locked", ephemeral=True)
                    return

        await ctx.followup.send(f"Failed to check if this email is locked", ephemeral=True)

def setup(bot: commands.Bot) -> None:
    bot.add_cog(checkLock(bot))