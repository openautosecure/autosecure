import discord
from discord import ui

class dmEmbed(ui.Modal):
    def __init__(self, user):
        super().__init__(title="Send Message")
        self.user = user
    
    box_one = ui.InputText(
        label = "Your Message",
        style = discord.InputTextStyle.paragraph,
        placeholder = "Custom DMS message...",
        required = True
    )
    
    async def callback(self, interaction: discord.Interaction):
        user = await interaction.client.fetch_user(self.user.id)
        await user.send(self.box_one.value)
        await interaction.response.send_message(f"Sent message to {user.mention}", ephemeral=True)