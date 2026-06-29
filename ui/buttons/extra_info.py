from discord import ui
import discord

class ExtraInfoButtons(ui.View):
    def __init__(self, family, devices, cards, subs, phones):
        super().__init__(timeout=None)
        self.family = family
        self.devices = devices
        self.cards = cards
        self.subs = subs
        self.phones = phones

    @discord.ui.button(label="Family", style=discord.ButtonStyle.grey, custom_id="extrainfo:button_family", row=1)
    async def showFamily(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_message(embed=self.family, ephemeral=True)

    @discord.ui.button(label="Devices", style=discord.ButtonStyle.grey, custom_id="extrainfo:button_devices", row=1)
    async def showDevices(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_message(embed=self.devices, ephemeral=True)

    @discord.ui.button(label="Cards", style=discord.ButtonStyle.grey, custom_id="extrainfo:button_cards", row=1)
    async def showCards(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_message(embed=self.cards, ephemeral=True)

    @discord.ui.button(label="Subscriptions", style=discord.ButtonStyle.grey, custom_id="extrainfo:button_subs", row=2)
    async def showSubs(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_message(embed=self.subs, ephemeral=True)

    @discord.ui.button(label="Phones", style=discord.ButtonStyle.grey, custom_id="extrainfo:button_phones", row=2)
    async def showPhones(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_message(embed=self.phones, ephemeral=True)
