from discord import ui
import discord
from ui.buttons.extra_info import ExtraInfoButtons

class accountInfo(ui.View):
    def __init__(self, embeds: dict):
        super().__init__(timeout=None)
        self.ssid = embeds["ssid_embed"]
        self.dob = embeds["info_embed"]
        self.details = embeds["account_details"]
        self.stats = embeds["stats_embed"]
        self.xbox = embeds["xbox_embed"]
        self.family = embeds["family_embed"]
        self.devices = embeds["devices_embed"]
        self.cards = embeds["cards_embed"]
        self.subs = embeds["subs_embed"]
        self.phones = embeds["phones_embed"]


    @discord.ui.button(label="Minecraft", style=discord.ButtonStyle.green, custom_id="persistent:button_mc", row=1)
    async def showMinecraft(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_message(
            embeds=[self.xbox, self.stats],
            ephemeral=True
        )

    @discord.ui.button(label="SSID", style=discord.ButtonStyle.green, custom_id="persistent:button_ssid", row=1)
    async def showSSID(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_message(
            embed = self.ssid,
            ephemeral = True
        )

    @discord.ui.button(label="Extra Info", style=discord.ButtonStyle.grey, custom_id="persistent:button_info", row=2)
    async def extraInfo(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_message(
            embed=self.dob,
            view=ExtraInfoButtons(self.family, self.devices, self.cards, self.subs, self.phones),
            ephemeral=True
        )

    @discord.ui.button(label="Copy Details", style=discord.ButtonStyle.grey, custom_id="persistent:button_details", row=2)
    async def showInfo(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_message(
            self.details,
            ephemeral=True
        )


