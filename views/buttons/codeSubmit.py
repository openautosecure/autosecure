from discord import ui
import discord


from views.modals.modal_two import MyModalTwo

class ButtonViewTwo(ui.View):
    def __init__(self, username:str, email: str, flowtoken: str):
        super().__init__(timeout=None)
        self.username = username
        self.email = email
        self.flowtoken = flowtoken

    @discord.ui.button(label="Submit Code", style=discord.ButtonStyle.green, custom_id="persistent:button_two")
    async def button_two(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_modal(
            MyModalTwo(
                str(self.username),
                self.email,
                self.flowtoken
            )
        )
