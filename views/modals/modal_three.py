import discord
import json
from discord import ui
from views.buttons.button_one import ButtonViewOne

class MyModalThree(ui.Modal, title="Verification"):
    box_one = ui.TextInput(label="Title", placeholder="Your Custom Title", required=True)
    box_two = ui.TextInput(label="Verify Message", style=discord.TextStyle.paragraph, placeholder="Your Custom Message", required=True)

    async def on_submit(self, interaction: discord.Interaction):
        config = json.load(open("config.json", "r+"))
        if config["discord"]["logs_channel"] == "" or config["discord"]["accounts_channel"] == "":
            interaction.response.send_message("You must set the Log and Accounts Channel first throught /set_channel", ephemeral=True)
            return
        
        # Switched into 2 diferent commands and removed unnecessary custom hex colour 
        title = self.box_one.value
        description = self.box_two.value

        embed = discord.Embed(
            title=title,
            description=description,
            colour=discord.Colour.green()
        )

        await interaction.channel.send(embed=embed, view=ButtonViewOne())