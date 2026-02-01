from discord import ui
import discord

class accountInfo(ui.View):
    def __init__(self, ssid: discord.Embed):
        super().__init__(timeout=None)
        self.ssid = ssid

    @discord.ui.button(label="Minecraft", style=discord.ButtonStyle.primary, custom_id="persistent:button_mc")
    async def showMinecraft(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message(
            embed = self.ssid,
            ephemeral = True
        )

    @discord.ui.button(label="SSID", style=discord.ButtonStyle.primary, custom_id="persistent:button_ssid")
    async def showSSID(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message(
            embed = self.ssid,
            ephemeral = True
        )

        