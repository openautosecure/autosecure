from discord import app_commands
from discord.ext import commands
import discord

class Admin(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="reload")
    async def reload(self, interaction: discord.Interaction, cog: str):
        if interaction.user.id not in self.bot.admins:
            return
        await self.bot.reload_extension(cog)
        return await interaction.response.send_message(
            embed=discord.Embed(
                title="Reloaded Cogs",
                description=cog,
            )
        )

    @reload.autocomplete(name="cog")
    async def autocomplete_callback(
        self, interaction: discord.Interaction, current: str
    ):
        options = [cog for cog in self.bot.extensions.keys()]
        return [
            app_commands.Choice(name=option, value=option)
            for option in options
            if current.lower() in option.lower()
        ]

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Admin(bot))
