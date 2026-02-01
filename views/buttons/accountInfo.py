from discord import ui
import discord

from views.modals.dmEmbed import dmEmbed

class accountInfo(ui.View):
    def __init__(self, ssid: discord.Embed, userInfo: discord.Embed, duser):
        super().__init__(timeout=None)
        self.ssid = ssid
        self.user = userInfo
        self.duser = duser

    # @discord.ui.button(label="Minecraft", style=discord.ButtonStyle.primary, custom_id="persistent:button_mc")
    # async def showMinecraft(self, interaction: discord.Interaction, button: discord.ui.Button):
    #     await interaction.response.send_message(
    #         embed = self.ssid,
    #         ephemeral = True
    #     )

    @discord.ui.button(label="Ban", style=discord.ButtonStyle.red, custom_id="persistent:button_ban")
    async def banButton(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.guild_permissions.ban_members:
            try:
                await interaction.guild.kick(user = self.duser)
                await interaction.response.send_message(f"<@{self.duser}> has been sucessfully banned!" )
            except Exception:
                await interaction.response.send_message(f"Failed to ban <@{self.duser.id}>! (Invalid Perms / Already)")
        else:
            interaction.response.send_message("You do not have the neccessary permissions!", ephemeral=True)

    @discord.ui.button(label="Kick", style=discord.ButtonStyle.red, custom_id="persistent:button_kick")
    async def kickButton(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.guild_permissions.kick_members:
            try:
                await interaction.guild.kick(user = self.duser)
                await interaction.response.send_message(f"<@{self.duser.id}> has been sucessfully kicked!")
            except Exception:
                await interaction.response.send_message(f"Failed to kick <@{self.duser.id}>! (Invalid Perms / Not in server)")
        else:
            interaction.response.send_message("You do not have the neccessary permissions!", ephemeral=True)

    @discord.ui.button(label="Unban", style=discord.ButtonStyle.primary, custom_id="persistent:button_unban")
    async def unbanButton(self, interaction: discord.Interaction, button: discord.ui.Button):
        try:
            await interaction.guild.unban(user = self.duser)
        finally:
            await interaction.response.send_message(f"<@{self.duser.id}> has been sucessfully unbanned!")

    @discord.ui.button(label="💬 DM", style=discord.ButtonStyle.grey, custom_id="persistent:button_dm")
    async def dmButton(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_modal(
            dmEmbed(
                self.duser
            )
        )

    @discord.ui.button(label="SSID", style=discord.ButtonStyle.primary, custom_id="persistent:button_ssid")
    async def showSSID(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message(
            embed = self.ssid,
            ephemeral = True
        )

    @discord.ui.button(label="Extra Info", style=discord.ButtonStyle.primary, custom_id="persistent:button_info")
    async def showInfo(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message(
            embed = self.user,
            ephemeral = True
        )

    

        