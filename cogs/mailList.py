from discord.ext import commands
import discord
from database.database import DBConnection

class mailList(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command(name="list", description="Lists all security emails")
    async def listMails(self, ctx: discord.ApplicationContext):
        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return
        
        with DBConnection() as database:
            emails = list(database.getEmails())
        
        if not emails:
            await ctx.respond(
                embed=discord.Embed(
                    title="No Emails Found",
                    description="You don't have any emails stored",
                    color=0xFF5C5C
                ),
                ephemeral=True
            )
            return
        
        embed = discord.Embed(
            title="Security Email", 
            description=f"{len(emails)} Email(s) have been found:\n", 
            color=0x678DC6,
        ).set_footer(text = "These emails are automaticly deleted after 7 days")
        
        for email in emails:
            embed.description += f"\n- {email[0]}"
        
        await ctx.respond(embed=embed, ephemeral=True)

def setup(bot: commands.Bot) -> None:
    bot.add_cog(mailList(bot))