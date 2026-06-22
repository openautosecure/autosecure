from minecraft.get_hypixel import get_hypixel_stats
from database.database import DBConnection
from discord import ui
import discord

from ui.modals.dm import dmEmbed

class ButtonOptions(ui.View):
    def __init__(self, user, id: int, username: str):
        super().__init__(timeout=None)
        self.username = username
        self.stats = None
        self.user = user
        self.id = id

    async def _fetch_stats(self):
        if self.stats is None:
            self.stats = await get_hypixel_stats(self.username)

    # First row
    @discord.ui.button(label="Bedwars", style=discord.ButtonStyle.red, custom_id="persistent:button_bedwars")
    async def bedwarsButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await self._fetch_stats()
        await interaction.response.send_message(
            embed = discord.Embed(
            title=self.username,
            description=(
                f"**BW Wins** • `{self.stats['bedwars']['wins']}`\n"
                f"**BW Deaths** • `{self.stats['bedwars']['deaths']}`\n"
                f"**BW Kills** • `{self.stats['bedwars']['kills']}`\n"
                f"**BW Final Kills** • `{self.stats['bedwars']['final_kills']}`\n"
                f"**BW K/D** • `{self.stats['bedwars']['kd']}`\n"
            ),
            color=0xFFAA00
            ).set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/128"),
            ephemeral = True
        )

    @discord.ui.button(label="Skywars", style=discord.ButtonStyle.red, custom_id="persistent:button_skywars")
    async def skywarsButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await self._fetch_stats()
        await interaction.response.send_message(
            embed = discord.Embed(
            title=self.username,
            description=(
                f"**SW Wins** • `{self.stats['skywars']['sw_wins']}`\n"
                f"**SW Deaths** • `{self.stats['skywars']['sw_deaths']}`\n"
                f"**SW Kills** • `{self.stats['skywars']['sw_kills']}`\n"
                f"**SW K/D** • `{self.stats['skywars']['sw_kd']}`\n"
            ),
            color=0xFFAA00
            ).set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/128"),
            ephemeral = True
        )

    @discord.ui.button(label="Skyblock", style=discord.ButtonStyle.red, custom_id="persistent:button_skyblock")
    async def skyblockButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await self._fetch_stats()
        await interaction.response.send_message(
            embed = discord.Embed(
            title=self.username,
            description=(
                f"**SB Level** • `{self.stats['skyblock']['slevel']}`\n"
                f"**SB Networth** • `{self.stats['skyblock']['networth']}`\n"
            ),
            color=0xFFAA00
            ).set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/128"),
            ephemeral = True
        )
    @discord.ui.button(label="Donnut", style=discord.ButtonStyle.red, custom_id="persistent:button_donut")
    async def donnutButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await self._fetch_stats()
        await interaction.response.send_message(
            embed = discord.Embed(
            title=self.username,
            description=(
                f"**SW Wins** • `{self.stats['skywars']['sw_wins']}`\n"
                f"**SW Deaths** • `{self.stats['skywars']['sw_deaths']}`\n"
                f"**SW Kills** • `{self.stats['skywars']['sw_kills']}`\n"
                f"**SW K/D** • `{self.stats['skywars']['sw_kd']}`\n"
            ),
            color=0xFFAA00
            ).set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/128"),
            ephemeral = True
        )

    # Second Row
    @discord.ui.button(label="Ban", style=discord.ButtonStyle.red, custom_id="persistent:button_ban")
    async def banButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        try:
            await interaction.guild.kick(user = self.user)
            await interaction.response.send_message(f"<@{self.user}> has been sucessfully banned!" )
        except Exception:
            await interaction.response.send_message(f"Failed to ban <@{self.user}>! (Invalid Perms / Already Banned)")

    @discord.ui.button(label="Kick", style=discord.ButtonStyle.red, custom_id="persistent:button_kick")
    async def kickButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        try:
            await interaction.guild.kick(user = self.user)
            await interaction.response.send_message(f"<@{self.user}> has been sucessfully kicked!")
        except Exception:
            await interaction.response.send_message(f"Failed to kick <@{self.user}>! (Invalid Perms / Not in server)")

    @discord.ui.button(label="Unban", style=discord.ButtonStyle.primary, custom_id="persistent:button_unban")
    async def unbanButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        try:
            await interaction.guild.unban(user = self.user)
        finally:
            await interaction.response.send_message(f"<@{self.user}> has been sucessfully unbanned!")

    @discord.ui.button(label="Blacklist", style=discord.ButtonStyle.red, custom_id="persistent:button_blacklist")
    async def blacklistUser(self, button: discord.ui.Button, interaction: discord.Interaction):
        with DBConnection() as database:
            database.add_blacklisted_user(self.id)
            database.conn.commit()

        await interaction.response.send_message(f"Successfully blacklisted <@{self.user}>!", ephemeral=True)

    @discord.ui.button(label="Unblacklist", style=discord.ButtonStyle.primary, custom_id="persistent:button_unblacklist")
    async def unblacklistUser(self, button: discord.ui.Button, interaction: discord.Interaction):
        with DBConnection() as database:
            database.remove_blacklisted_user(self.id)
            database.conn.commit()

        await interaction.response.send_message(f"Successfully unblacklisted <@{self.user}>!", ephemeral=True)
    
    # Third Row
    @discord.ui.button(label="DM", style=discord.ButtonStyle.grey, custom_id="persistent:button_dm")
    async def dmButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_modal(
            dmEmbed(
                self.user
            )
        )