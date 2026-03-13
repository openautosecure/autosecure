from discord.ext import commands
import discord
import json

from views.utils.checkLocked import checkLocked

class checkLock(commands.Cog):
    check = discord.SlashCommandGroup("check")

    def __init__(self, bot):
        self.bot = bot

    @check.command(name="locked", description="Checks if an account is locked")
    async def checkLock(self, ctx: discord.ApplicationContext, email: str):

        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return

        await ctx.defer(ephemeral=True)

        lockedInfo = await checkLocked(email)
        
        if lockedInfo:
            # API returns statusCode (camelCase) - handle both casings defensively
            status_code = lockedInfo.get("StatusCode") or lockedInfo.get("statusCode")

            if status_code is not None and status_code != 500:
                # Parse the Value payload if present
                value_raw = lockedInfo.get("Value") or lockedInfo.get("value")
                if value_raw:
                    try:
                        value_data = json.loads(value_raw)
                        status = value_data.get("status", {})
                        is_suspended = status.get("isAccountSuspended", False)
                        is_phone_locked = status.get("isPhoneLocked", False) or status.get("phoneNumberLocked", False)

                        if is_suspended:
                            await ctx.followup.send(f"This email is **suspended/locked**", ephemeral=True)
                        elif is_phone_locked:
                            await ctx.followup.send(f"This email is **phone locked** (requires phone verification to unlock)", ephemeral=True)
                        else:
                            await ctx.followup.send(f"This email is **not** locked", ephemeral=True)
                        return
                    except (json.JSONDecodeError, KeyError):
                        pass

                # Value absent or unparseable — treat as locked
                await ctx.followup.send(f"This email is **locked**", ephemeral=True)
                return

        await ctx.followup.send(f"Failed to check if this email is locked", ephemeral=True)

def setup(bot: commands.Bot) -> None:
    bot.add_cog(checkLock(bot))
