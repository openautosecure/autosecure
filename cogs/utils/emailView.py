import discord
from discord import ui

class emailView(ui.View):
    def __init__(self, emails: list, index: int = 0):
        super().__init__(timeout=None)
        self.emails = emails
        self.index = index
        self.mindex = len(emails) - 1
        self.updateButtons()
    
    def updateButtons(self):
        self.children[0].disabled = self.index == 0  
        self.children[1].disabled = self.index >= self.mindex
    
    def getEmbed(self):
        embed = discord.Embed(
            title=f"Email Inbox ({self.index + 1}/{len(self.emails)})",
            description=self.emails[self.index],
            color=0x678DC6,
        )
        return embed
    
    @discord.ui.button(label="◀️ Back", style=discord.ButtonStyle.primary)
    async def back_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        if self.index > 0:
            self.index -= 1
            self.updateButtons()
            await interaction.response.edit_message(embed=self.get_embed(), view=self)
    
    @discord.ui.button(label="🔄 Refresh", style=discord.ButtonStyle.green)
    async def refresh_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.edit_message(embed=self.get_embed(), view=self)

    @discord.ui.button(label="Next ▶️", style=discord.ButtonStyle.primary)
    async def next_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        if self.index < self.mindex:
            self.index += 1
            self.updateButtons()
            await interaction.response.edit_message(embed=self.get_embed(), view=self)