from ui.modals.modal_one import MyModalOne
import discord

class LinkAccountButton(discord.ui.Button):
    def __init__(self, text: str = "✅ Link your account"):
        super().__init__(
            label=text,
            style=discord.ButtonStyle.green,
            custom_id="persistent:button_one"
        )

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.send_modal(MyModalOne())