import discord
from discord import ui

class dmEmbed(ui.Modal, title="Send Message"):
    def __init__(self, user):
        super().__init__()
        self.user = user

    box_one = ui.TextInput(label="Your Message", style=discord.TextStyle.paragraph, placeholder="Custom DMS message...", required=True)

    async def on_submit(self, interaction: discord.Interaction):

        user = await interaction.client.fetch_user(self.user.id)
        await user.send(self.box_one.value)

        await interaction.response.send_message(f"Sent message to {user.mention}", ephemeral = True)