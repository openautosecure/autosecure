from discord import ui
import discord

from shared.genTOTP import totp

class ButtonTOTP(ui.View):
    def __init__(self, secret: str):
        super().__init__(timeout=None)
        self.secret = secret

    @discord.ui.button(label="🔄 Refresh Code", style=discord.ButtonStyle.green, custom_id="persistent:button_refresh")
    async def button_one(self, button: discord.ui.Button, interaction: discord.Interaction):
        getTOTP = await totp(self.secret)
        await interaction.response.edit_message(
            embed=discord.Embed(
                title="Authenticator Code",
                description=f"```{getTOTP}```"
            )
        )
