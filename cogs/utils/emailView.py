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
        if not self.emails:
            self.children[0].disabled = True
            self.children[1].disabled = True
            self.children[2].disabled = True
            return
        
        self.children[0].disabled = self.index == 0  
        self.children[1].disabled = self.index >= self.mindex
    
    def getEmbed(self):
        if not self.emails:
            embed = discord.Embed(
                title="Email Inbox (0/0)",
                description="No emails found in inbox.",
                color=0x678DC6,
            )
            return embed
        
        embed = discord.Embed(
            title=f"Email Inbox ({self.index + 1}/{len(self.emails)})",
            description=self.emails[self.index],
            color=0x678DC6,
        )
        return embed
    
    @discord.ui.button(label="◀️ Back", style=discord.ButtonStyle.primary)
    async def back_button(self, button: discord.ui.Button, interaction: discord.Interaction):
        if self.index > 0:
            self.index -= 1
            self.updateButtons()
            await interaction.response.edit_message(embed=self.getEmbed(), view=self)
    
    @discord.ui.button(label="🔄 Refresh", style=discord.ButtonStyle.green)
    async def refresh_button(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.edit_message(embed=self.getEmbed(), view=self)

    @discord.ui.button(label="Next ▶️", style=discord.ButtonStyle.primary)
    async def next_button(self, button: discord.ui.Button, interaction: discord.Interaction):
        if self.index < self.mindex:
            self.index += 1
            self.updateButtons()
            await interaction.response.edit_message(embed=self.getEmbed(), view=self)