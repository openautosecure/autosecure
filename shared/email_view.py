from shared.fetchInbox import fetchInbox
from discord import ui
import discord


class emailView(ui.View):
    def __init__(self, emails: list, identifier: str, index: int = 0):
        super().__init__(timeout=None)
        self.emails = emails
        self.identifier = identifier
        self.index = index
        self.mindex = len(emails) - 1
        self.updateButtons()

    def updateButtons(self):
        if not self.emails:
            self.children[0].disabled = True
            self.children[2].disabled = True
            return
        self.children[0].disabled = self.index == 0
        self.children[2].disabled = self.index >= self.mindex

    def getEmbed(self):
        if not self.emails:
            return discord.Embed(
                title="Email Inbox (0/0)",
                description="No emails found in inbox.",
                color=0x678DC6,
            )
        return discord.Embed(
            title=f"Email Inbox ({self.index + 1}/{len(self.emails)})",
            description=self.emails[self.index],
            color=0x678DC6,
        )

    @discord.ui.button(label="◀️ Back", style=discord.ButtonStyle.primary)
    async def back_button(self, button: discord.ui.Button, interaction: discord.Interaction):
        if self.index > 0:
            self.index -= 1
            self.updateButtons()
            await interaction.response.edit_message(embed=self.getEmbed(), view=self)

    @discord.ui.button(label="🔄 Refresh", style=discord.ButtonStyle.green)
    async def refresh_button(self, button: discord.ui.Button, interaction: discord.Interaction):
        self.emails = await fetchInbox(self.identifier)
        self.mindex = len(self.emails) - 1
        if self.index > self.mindex:
            self.index = max(0, self.mindex)
        self.updateButtons()
        await interaction.response.edit_message(embed=self.getEmbed(), view=self)

    @discord.ui.button(label="Next ▶️", style=discord.ButtonStyle.primary)
    async def next_button(self, button: discord.ui.Button, interaction: discord.Interaction):
        if self.index < self.mindex:
            self.index += 1
            self.updateButtons()
            await interaction.response.edit_message(embed=self.getEmbed(), view=self)
