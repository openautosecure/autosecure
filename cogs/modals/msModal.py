from discord import ui
import discord

from views.utils.initialSession import getSession
from views.utils.securing.secure import secure

class msModal(ui.Modal):
    def __init__(self) -> None:
        super().__init__(title="MSAAUTH Cookie")
        self.add_item(ui.InputText(label="MSAAUTH Cookie", placeholder="Your Cookie here...", required=True))

    async def callback(self, interaction: discord.Interaction):
        
        # await interaction.response.defer()

        # session = getSession().cookies.set(
        #     name = "__Host-MSAAUTH",
        #     value = self.box_one.value,
        #     domain = "login.live.com"                
        # )

        # embeds = secure(session)

        await interaction.response.send_message("**On Development**", ephemeral = True)

    