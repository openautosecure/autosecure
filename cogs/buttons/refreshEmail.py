from discord import ui
import discord

from cogs.utils.fetchInbox import fetchInbox
from cogs.utils.emailView import emailView

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

        emails = await fetchInbox(self.token)
        view = emailView(emails)

        await interaction.message.edit(embed=view.getEmbed(), view=view)