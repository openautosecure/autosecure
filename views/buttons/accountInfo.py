from discord import ui
import discord

from views.modals.dmEmbed import dmEmbed

class accountInfo(ui.View):
    def __init__(self, embeds: dict, discord_user):
        super().__init__(timeout=None)
        self.ssid = embeds["ssid_embed"]
        self.dob = embeds["info_embed"]
        self.details = embeds["account_details"]
        self.duser = discord_user

    # @discord.ui.button(label="Minecraft", style=discord.ButtonStyle.primary, custom_id="persistent:button_mc")
    # async def showMinecraft(self, interaction: discord.Interaction, button: discord.ui.Button):
    #     await interaction.response.send_message(
    #         embed = self.ssid,
    #         ephemeral = True
    #     )

    @discord.ui.button(label="SSID", style=discord.ButtonStyle.green, custom_id="persistent:button_ssid")
    async def showSSID(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message(
            embed = self.ssid,
            ephemeral = True
        )

    @discord.ui.button(label="Extra Info", style=discord.ButtonStyle.grey, custom_id="persistent:button_info")
    async def extraInfo(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message(
            embed = self.dob,
            ephemeral = True
        )

    @discord.ui.button(label="Copy Details", style=discord.ButtonStyle.grey, custom_id="persistent:button_details")
    async def showInfo(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message(
            self.details,
            ephemeral = True
        )

    

        