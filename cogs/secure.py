from discord import app_commands
from discord.ext import commands
import discord
from cogs.modals.msModal import msModal

class Dropdown(discord.ui.Select):
    def __init__(self):
        options = [
            discord.SelectOption(
                label="MSAAUTH Token",
                description="Uses your MSAAUTH token to secure",
                value="msaauth"
            ),
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
            case "msaauth":
                modal = msModal()
                await interaction.response.send_modal(modal)
            # case "rcvcode":   # ← add later if needed


class secure(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="secure", description="Automaticly secures your account")
    async def secure(self, interaction: discord.Interaction):
        if interaction.user.id not in self.bot.admins:
            await interaction.response.send_message("You do not have permission to execute this command!", ephemeral=True)
            return
       
        embed = discord.Embed(
            title = "Select Securing Method",
            description = """
            Choose how you want to authenticate:
           
            **MSAAUTH Token**
            Use your a microsoft account session cookie
            """
        )

        view = discord.ui.View()
        view.add_item(Dropdown())

        await interaction.response.send_message(
            embed = embed,
            view = view,
            ephemeral = True
        )

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(secure(bot))