from discord.ext import commands
import discord
from cogs.buttons.getInbox import getInbox

class Email(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command(name="inbox", description="Shows the inbox of your email")
    async def emailInbox(self, ctx: discord.ApplicationContext, email: str):
        
        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return
        
        inbox = await getInbox(email)
        if not inbox:
            await ctx.respond(
                embed = discord.Embed(
                        description = "This email has not been found",
                        color = 0xFF5C5C
                    ),
                ephemeral=True
            )
            return
        
        await ctx.respond(
            embed = inbox["embed"],
            view = inbox["view"],
            ephemeral = True
        )

def setup(bot: commands.Bot) -> None:
    bot.add_cog(Email(bot))