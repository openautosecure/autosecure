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
        self.hstats = None
        self.dstats = None

        self.username = username
        self.user = user
        self.id = id

    async def check_stats(self):
        if not self.hstats:
            self.hstats = await get_hypixel_stats(self.username)
            self.dstats = await get_donut_stats(self.username)

    @discord.ui.button(label="🛏️ Bedwars", style=discord.ButtonStyle.grey, custom_id="persistent:button_bedwars", row=1)
    async def bedwarsButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)
        await self.check_stats()

        await interaction.followup.send(
            embed = discord.Embed(
            title=f"Bedwars stats for {self.username}",
            description=(
                f"**BW Wins**: `{self.hstats['bedwars']['wins']}`\n"
                f"**BW Deaths**: `{self.hstats['bedwars']['deaths']}`\n"
                f"**BW Kills**: `{self.hstats['bedwars']['kills']}`\n"
                f"**BW Final Kills**: `{self.hstats['bedwars']['final_kills']}`\n"
                f"**BW K/D**: `{self.hstats['bedwars']['kd']}`\n"
            ),
            timestamp=datetime.utcnow(),
            color=0xFFAA00
            ).set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/50"),
            ephemeral = True
        )

    @discord.ui.button(label="⚔️ Skywars", style=discord.ButtonStyle.grey, custom_id="persistent:button_skywars", row=1)
    async def skywarsButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)
        await self.check_stats()

        await interaction.followup.send(
            embed = discord.Embed(
            title=f"Skywars stats for {self.username}",
            description=(
                f"**SW Wins**: `{self.hstats['skywars']['sw_wins']}`\n"
                f"**SW Deaths**: `{self.hstats['skywars']['sw_deaths']}`\n"
                f"**SW Kills**: `{self.hstats['skywars']['sw_kills']}`\n"
                f"**SW K/D**: `{self.hstats['skywars']['sw_kd']}`\n"
            ),
            timestamp=datetime.utcnow(),
            color=0xFFAA00
            ).set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/50"),
            ephemeral = True
        )

    @discord.ui.button(label="💰 Skyblock", style=discord.ButtonStyle.grey, custom_id="persistent:button_skyblock", row=1)
    async def skyblockButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)
        await self.check_stats()

        await interaction.followup.send(
            embed = discord.Embed(
            title=f"Skyblock stats for {self.username}",
            description=(
                f"**SB Level**: `{self.hstats['skyblock']['level']}`\n"
                f"**SB Networth**: `{self.hstats['skyblock']['networth']}`\n"
            ),
            timestamp=datetime.utcnow(),
            color=0xFFAA00
            ).set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/50"),
            ephemeral = True
        )

    @discord.ui.button(label="🍩 Donut", style=discord.ButtonStyle.grey, custom_id="persistent:button_donut", row=1)
    async def donutButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)
        await self.check_stats()

        if not self.dstats or self.dstats == "Failed":
            await interaction.followup.send("No DonutSMP stats found.", ephemeral=True)
            return
        
        ms = int(float(self.dstats['playtime'])) if self.dstats['playtime'] else 0
        days = ms // 86400000
        hours = (ms % 86400000) // 3600000

        embed = discord.Embed(
            title=f"Donut Stats for {self.username}",
            description=(
                f"**Money**: `${simplify(self.dstats['money'])}`\n"
                f"**Shards**: `{simplify(self.dstats['shards'])}`\n"
                f"**Player Kills**: `{simplify(self.dstats['kills'])}`\n"
                f"**Deaths**: `{simplify(self.dstats['deaths'])}`\n"
                f"**Playtime**: `{days}d {hours}h`\n"
                f"**Blocks Placed**: `{simplify(self.dstats['placed_blocks'])}`\n"
                f"**Blocks Broken**: `{simplify(self.dstats['broken_blocks'])}`\n"
                f"**Mobs Killed**: `{simplify(self.dstats['mobs_killed'])}`\n"
                f"**Money Spent**: `${simplify(self.dstats['money_spent_on_shop'])}`\n"
                f"**Money Made**: `${simplify(self.dstats['money_made_from_sell'])}`"
            ),
            timestamp=datetime.utcnow(),
            color=0xFF9E45
        )
        embed.set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/60")

        await interaction.followup.send(embed=embed, ephemeral=True)

    @discord.ui.button(label="Ban", style=discord.ButtonStyle.red, custom_id="persistent:button_ban", row=2)
    async def banButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        try:
            await interaction.guild.ban(user = self.user)
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

    @discord.ui.button(label="Unban", style=discord.ButtonStyle.primary, custom_id="persistent:button_unban", row=2)
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
    
    @discord.ui.button(label="DM", style=discord.ButtonStyle.grey, custom_id="persistent:button_dm", row=3)
    async def dmButton(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_modal(
            dmEmbed(
                self.user
            )
        )