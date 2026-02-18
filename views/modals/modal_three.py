import discord
import json
from discord import ui
from views.buttons.linkAccount import ButtonViewOne

class MyModalThree(ui.Modal):
    def __init__(self, user):
        super().__init__(title="Verification")
        self.add_item(ui.InputText(label="Title", placeholder="Your Custom Title", required=True))
        self.add_item(ui.InputText(label="Verify Message", style=discord.InputTextStyle.paragraph, placeholder="Your Custom Message", required=True))

    async def callback(self, interaction: discord.Interaction):
        title = self.children[0].value 
        description = self.children[1].value

        config = json.load(open("config.json", "r+"))
        if config["discord"]["logs_channel"] == "" or config["discord"]["accounts_channel"] == "":
            interaction.response.send_message("You must set the Log and Accounts Channel first throught /set_channel", ephemeral=True)
            return

        embed = discord.Embed(
            title = title,
            description = description,
            colour = 0x678DC6
        )

        await interaction.channel.send(embed=embed, view=ButtonViewOne())
        await interaction.followup.send("Sent!", ephemeral=True)