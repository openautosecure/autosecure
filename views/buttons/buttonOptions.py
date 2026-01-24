from discord import ui
import discord

from views.modals.dmEmbed import dmEmbed

class ButtonOptions(ui.View):
    def __init__(self, user: int):
        super().__init__(timeout=None)
        self.user = user

    @discord.ui.button(label="Ban", style=discord.ButtonStyle.red, custom_id="persistent:button_ban")
    async def banButton(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.guild_permissions.ban_members:
            try:
                await interaction.guild.kick(user = self.user)
                await interaction.response.send_message(f"<@{self.user}> has been sucessfully banned!" )
            except Exception:
                await interaction.response.send_message(f"Failed to ban <@{self.user.id}>! (Invalid Perms / Already)")
        else:
            interaction.response.send_message("You do not have the neccessary permissions!", ephemeral=True)

    @discord.ui.button(label="Kick", style=discord.ButtonStyle.red, custom_id="persistent:button_kick")
    async def kickButton(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.guild_permissions.kick_members:
            try:
                await interaction.guild.kick(user = self.user)
                await interaction.response.send_message(f"<@{self.user.id}> has been sucessfully kicked!")
            except Exception:
                await interaction.response.send_message(f"Failed to kick <@{self.user.id}>! (Invalid Perms / Not in server)")
        else:
            interaction.response.send_message("You do not have the neccessary permissions!", ephemeral=True)

    @discord.ui.button(label="Unban", style=discord.ButtonStyle.primary, custom_id="persistent:button_unban")
    async def unbanButton(self, interaction: discord.Interaction, button: discord.ui.Button):
        try:
            await interaction.guild.unban(user = self.user)
        finally:
            await interaction.response.send_message(f"<@{self.user.id}> has been sucessfully unbanned!")

    @discord.ui.button(label="💬 DM", style=discord.ButtonStyle.grey, custom_id="persistent:button_dm")
    async def dmButton(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_modal(
            dmEmbed(
                self.user
            )
        )
