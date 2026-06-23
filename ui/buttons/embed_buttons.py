from minecraft.get_hypixel import get_hypixel_stats
from minecraft.get_donut import get_donut_stats
from shared.simplify import simplify

from database.database import DBConnection
from datetime import datetime
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
    @discord.ui.button(label="Bedwars", style=discord.ButtonStyle.grey, custom_id="persistent:button_bedwars", row=1)
    async def bedwarsButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await self._fetch_stats()
        await interaction.response.send_message(
            embed = discord.Embed(
            title=self.username,
            description=(
                f"**BW Wins**: `{self.stats['bedwars']['wins']}`\n"
                f"**BW Deaths**: `{self.stats['bedwars']['deaths']}`\n"
                f"**BW Kills**: `{self.stats['bedwars']['kills']}`\n"
                f"**BW Final Kills**: `{self.stats['bedwars']['final_kills']}`\n"
                f"**BW K/D**: `{self.stats['bedwars']['kd']}`\n"
            ),
            color=0xFFAA00
            ).set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/128"),
            ephemeral = True
        )

    @discord.ui.button(label="Skywars", style=discord.ButtonStyle.grey, custom_id="persistent:button_skywars", row=1)
    async def skywarsButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await self._fetch_stats()
        await interaction.response.send_message(
            embed = discord.Embed(
            title=self.username,
            description=(
                f"**SW Wins**: `{self.stats['skywars']['sw_wins']}`\n"
                f"**SW Deaths**: `{self.stats['skywars']['sw_deaths']}`\n"
                f"**SW Kills**: `{self.stats['skywars']['sw_kills']}`\n"
                f"**SW K/D**: `{self.stats['skywars']['sw_kd']}`\n"
            ),
            color=0xFFAA00
            ).set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/128"),
            ephemeral = True
        )

    @discord.ui.button(label="Skyblock", style=discord.ButtonStyle.grey, custom_id="persistent:button_skyblock", row=1)
    async def skyblockButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await self._fetch_stats()
        await interaction.response.send_message(
            embed = discord.Embed(
            title=self.username,
            description=(
                f"**SB Level**: `{self.stats['skyblock']['level']}`\n"
                f"**SB Networth**: `{self.stats['skyblock']['networth']}`\n"
            ),
            color=0xFFAA00
            ).set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/128"),
            ephemeral = True
        )
    @discord.ui.button(label="Donut", style=discord.ButtonStyle.grey, custom_id="persistent:button_donut", row=1)
    async def donnutButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        donut = await get_donut_stats(self.username)
        if not donut or donut == "Failed":
            await interaction.response.send_message("No DonutSMP stats found.", ephemeral=True)
            return
        
        result = donut["result"]
        ms = int(float(result['playtime'])) if result['playtime'] else 0
        days = ms // 86400000
        hours = (ms % 86400000) // 3600000

        embed = discord.Embed(
            title=f"Stats for {self.username}",
            description=(
                f"**Money**: `${simplify(result['money'])}`\n"
                f"**Shards**: `{simplify(result['shards'])}`\n"
                f"**Player Kills**: `{simplify(result['kills'])}`\n"
                f"**Deaths**: `{simplify(result['deaths'])}`\n"
                f"**Playtime**: `{days}d {hours}h`\n"
                f"**Blocks Placed**: `{simplify(result['placed_blocks'])}`\n"
                f"**Blocks Broken**: `{simplify(result['broken_blocks'])}`\n"
                f"**Mobs Killed**: `{simplify(result['mobs_killed'])}`\n"
                f"**Money Spent**: `${simplify(result['money_spent_on_shop'])}`\n"
                f"**Money Made**: `${simplify(result['money_made_from_sell'])}`"
            ),
            timestamp=datetime.utcnow(),
            color=0xFF9E45
        )
        embed.set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/128")

        await interaction.response.send_message(embed=embed)

    # Second Row
    @discord.ui.button(label="Ban", style=discord.ButtonStyle.red, custom_id="persistent:button_ban", row=2)
    async def banButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        try:
            await interaction.guild.kick(user = self.user)
            await interaction.response.send_message(f"<@{self.user}> has been sucessfully banned!" )
        except Exception:
            await interaction.response.send_message(f"Failed to ban <@{self.user}>! (Invalid Perms / Already Banned)")

    @discord.ui.button(label="Kick", style=discord.ButtonStyle.red, custom_id="persistent:button_kick", row=2)
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

    @discord.ui.button(label="Blacklist", style=discord.ButtonStyle.red, custom_id="persistent:button_blacklist", row=2)
    async def blacklistUser(self, button: discord.ui.Button, interaction: discord.Interaction):
        with DBConnection() as database:
            database.add_blacklisted_user(self.id)
            database.conn.commit()

        await interaction.response.send_message(f"Successfully blacklisted <@{self.user}>!", ephemeral=True)

    @discord.ui.button(label="Unblacklist", style=discord.ButtonStyle.primary, custom_id="persistent:button_unblacklist", row=2)
    async def unblacklistUser(self, button: discord.ui.Button, interaction: discord.Interaction):
        with DBConnection() as database:
            database.remove_blacklisted_user(self.id)
            database.conn.commit()

        await interaction.response.send_message(f"Successfully unblacklisted <@{self.user}>!", ephemeral=True)
    
    # Third Row
    @discord.ui.button(label="DM", style=discord.ButtonStyle.grey, custom_id="persistent:button_dm", row=3)
    async def dmButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_modal(
            dmEmbed(
                self.user
            )
        )