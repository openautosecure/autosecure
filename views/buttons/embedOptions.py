from database.database import DBConnection
from discord import ui
import discord

from views.modals.dmEmbed import dmEmbed

class ButtonOptions(ui.View):
    def __init__(self, user: int):
        super().__init__(timeout=None)
        self.user = user
        self.id = self.user.id

    @discord.ui.button(label="Ban", style=discord.ButtonStyle.red, custom_id="persistent:button_ban")
    async def banButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        if interaction.user.guild_permissions.ban_members:
            try:
                await interaction.guild.kick(user = self.user)
                await interaction.response.send_message(f"<@{self.user}> has been sucessfully banned!" )
            except Exception:
                await interaction.response.send_message(f"Failed to ban <@{self.user}>! (Invalid Perms / Already)")
        else:
            await interaction.response.send_message("You do not have the neccessary permissions!", ephemeral=True)

    @discord.ui.button(label="Kick", style=discord.ButtonStyle.red, custom_id="persistent:button_kick")
    async def kickButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        if interaction.user.guild_permissions.kick_members:
            try:
                await interaction.guild.kick(user = self.user)
                await interaction.response.send_message(f"<@{self.user}> has been sucessfully kicked!")
            except Exception:
                await interaction.response.send_message(f"Failed to kick <@{self.user}>! (Invalid Perms / Not in server)")
        else:
            await interaction.response.send_message("You do not have the neccessary permissions!", ephemeral=True)

    @discord.ui.button(label="Unban", style=discord.ButtonStyle.primary, custom_id="persistent:button_unban")
    async def unbanButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        try:
            await interaction.guild.unban(user = self.user)
        finally:
            await interaction.response.send_message(f"<@{self.user}> has been sucessfully unbanned!")

    @discord.ui.button(label="Blacklist", style=discord.ButtonStyle.red, custom_id="persistent:button_blacklist")
    async def blacklistUser(self, button: discord.ui.Button, interaction: discord.Interaction):
        with DBConnection() as database:
            database.addBlacklistedUser(self.id)
            database.conn.commit()

        await interaction.response.send_message(f"Successfully blacklisted <@{self.user}>!", ephemeral=True)

    @discord.ui.button(label="Unblacklist", style=discord.ButtonStyle.primary, custom_id="persistent:button_unblacklist")
    async def unblacklistUser(self, button: discord.ui.Button, interaction: discord.Interaction):
        with DBConnection() as database:
            database.removeBlacklistedUser(self.id)
            database.conn.commit()

        await interaction.response.send_message(f"Successfully unblacklisted <@{self.user}>!", ephemeral=True)

    @discord.ui.button(label="💬 DM", style=discord.ButtonStyle.grey, custom_id="persistent:button_dm")
    async def dmButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_modal(
            dmEmbed(
                self.user
            )
        )