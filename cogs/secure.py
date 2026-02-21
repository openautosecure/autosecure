from cogs.modals.rcvModal import recoveryModal
from cogs.modals.msModal import msModal

from discord.ext import commands
import discord

class Dropdown(discord.ui.Select):
    def __init__(self):
        options = [
            discord.SelectOption(
                label="Recovery Code",
                description="Uses email + recovery code",
                value="rcvcode"
            )
        ]
        super().__init__(
            placeholder="Select Securing Method",
            min_values=1,
            max_values=1,
            options=options,
            row=0
        )

    async def callback(self, interaction: discord.Interaction):
        selected = self.values[0]
        match selected:
            case "rcvcode":
                modal = recoveryModal()
            
        await interaction.response.send_modal(modal)


class secure(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command(name="secure", description="Automaticly secures your account")
    async def secure(self, ctx: discord.ApplicationContext):
        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return
       
        embed = discord.Embed(
            title = "Select Securing Method",
            description = """
            Choose how you want to authenticate:
           
            **Recovery Code**
            Use your email and recovery code
            """
        )

        view = discord.ui.View()
        view.add_item(Dropdown())

        await ctx.respond(
            embed = embed,
            view = view,
            ephemeral = True
        )

def setup(bot: commands.Bot) -> None:
    bot.add_cog(secure(bot))