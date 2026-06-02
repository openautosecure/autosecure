from ui.buttons.link_account import LinkAccountView
from discord import ui
import discord
import json

class MyModalThree(ui.Modal):
    def __init__(self):
        super().__init__(title="Verification")
        self.add_item(ui.InputText(label="Title", placeholder="Your Custom Title", required=True))
        self.add_item(ui.InputText(label="Description", style=discord.InputTextStyle.paragraph, placeholder="Your Custom Message", required=True))
        self.add_item(ui.InputText(label="Embed Colour", placeholder="678DC6", required=True))
        self.add_item(ui.InputText(label="Link Button Text", placeholder="Your Custom Message", required=False))

    async def callback(self, interaction: discord.Interaction):
        title = self.children[0].value
        description = self.children[1].value
        colour = self.children[2].value
        link_text = self.children[3].value


        config = json.load(open("config.json", "r+"))
        if config["discord"]["logs_channel"] == "" or config["discord"]["accounts_channel"] == "":
            interaction.response.send_message("You must set the Log and Accounts Channel first throught /set_channel", ephemeral=True)
            return

        embed = discord.Embed(
            title = title,
            description = description,
            colour = int(f"0x{colour}")
        )

        await interaction.channel.send(embed=embed, view=LinkAccountView(link_text))
        await interaction.followup.send("Sent!", ephemeral=True)