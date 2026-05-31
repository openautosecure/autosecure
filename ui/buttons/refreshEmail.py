from discord import ui
import discord

from shared.fetchInbox import fetchInbox
from shared.emailView import emailView

class ButtonRefresh(ui.View):
    def __init__(self, identifier: str, email: str, password: str, embed: discord.Embed):
        super().__init__(timeout=None)
        self.identifier = identifier
        self.email = email
        self.pwd = password
        self.embed = embed

    @discord.ui.button(label="🔄 Refresh", style=discord.ButtonStyle.green, custom_id="persistent:button_refresh")
    async def button_one(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.defer()

        emails = await fetchInbox(self.identifier)
        view = emailView(emails, self.identifier)

        await interaction.message.edit(embed=view.getEmbed(), view=view)