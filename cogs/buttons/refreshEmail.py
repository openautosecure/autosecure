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
    async def button_one(self, interaction: discord.Interaction, button: discord.ui.Button):

        getEmails = await fetchInbox(self.token, self.email, self.pwd)

        await self.embed.edit_original_response(embed = getEmails)
        await interaction.response.defer()