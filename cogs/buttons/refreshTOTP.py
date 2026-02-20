import discord
from discord import ui

from cogs.utils.genTOTP import totp

class ButtonTOTP(ui.View):
    def __init__(self, secret: str, interaction: discord.Interaction):
        super().__init__(timeout=None)
        self.secret = secret
        self.interaction = interaction

    @discord.ui.button(label="🔄 Refresh Code", style=discord.ButtonStyle.green, custom_id="persistent:button_refresh")
    async def button_one(self, button: discord.ui.Button, interaction: discord.Interaction):

        getTOTP = await totp(self.secret)

        await self.interaction.edit_original_response(
            embed = discord.Embed(
                title = "Authenticator Code",
                description = f"```{getTOTP}```"
            )
        )

        await interaction.response.defer(ephemeral=True)
