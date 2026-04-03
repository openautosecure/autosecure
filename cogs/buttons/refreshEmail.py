import discord
from discord import ui

from cogs.utils.fetchInbox import fetchInbox

class ButtonRefresh(ui.View):
    def __init__(self, token: str, email: str, password: str, embed: discord.Interaction):
        super().__init__(timeout=None)
        self.token = token
        self.email = email
        self.pwd = password
        self.embed = embed

    @discord.ui.button(label="🔄 Refresh", style=discord.ButtonStyle.green, custom_id="persistent:button_refresh")
    async def button_one(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.defer()

        getEmails = await fetchInbox(self.token, self.email, self.pwd)

        await interaction.message.edit(embed=getEmails['embed'], view=getEmails['view'])