from discord.ext import commands
import discord
import json

def get_config():
    with open("config/config.json", "r") as f:
        return json.load(f)

def save_config(config):
    with open("config/config.json", "w+") as f:
        json.dump(config, f, indent=4)

def config_embed(enable_2fa: bool, replace_alias: bool) -> discord.Embed:
    embed = discord.Embed(title="Bot Configuration", color=0x3B89FF)
    embed.add_field(name="Replace Primary Alias", value="Enabled" if replace_alias else "Disabled", inline=True)
    embed.add_field(name="2FA", value="Enabled" if enable_2fa else "Disabled", inline=True)
    embed.set_footer(text="Click save to apply toggles")
    return embed


class ConfigView(discord.ui.View):
    def __init__(self, enable_2fa: bool, replace_alias: bool):
        super().__init__(timeout=180)
        self.replace_alias = replace_alias
        self.enable_2fa = enable_2fa

    @discord.ui.button(label="Toggle Primary Alias", style=discord.ButtonStyle.primary, row=0)
    async def toggle_alias(self, button: discord.ui.Button, interaction: discord.Interaction):
        self.replace_alias = not self.replace_alias
        await interaction.response.edit_message(embed=config_embed(self.enable_2fa, self.replace_alias), view=self)

    @discord.ui.button(label="Toggle 2FA", style=discord.ButtonStyle.primary, row=0)
    async def toggle_2fa(self, button: discord.ui.Button, interaction: discord.Interaction):
        self.enable_2fa = not self.enable_2fa
        await interaction.response.edit_message(embed=config_embed(self.enable_2fa, self.replace_alias), view=self)

    @discord.ui.button(label="Save", style=discord.ButtonStyle.green, row=1)
    async def save_config_btn(self, button: discord.ui.Button, interaction: discord.Interaction):
        config = get_config()
        config["autosecure"]["enable_2fa"] = self.enable_2fa
        config["autosecure"]["replace_main_alias"] = self.replace_alias
        save_config(config)
        await interaction.response.edit_message(
            embed=discord.Embed(title="Configuration Saved", color=0x57F287),
            view=None
        )


class Config(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command(name="config", description="View and edit the bot config")
    async def config_command(self, ctx: discord.ApplicationContext):
        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return

        config = get_config()
        view = ConfigView(config["autosecure"]["enable_2fa"], config["autosecure"]["replace_main_alias"])
        await ctx.respond(embed=config_embed(config["autosecure"]["enable_2fa"], config["autosecure"]["replace_main_alias"]), view=view, ephemeral=True)
        view.original_interaction = ctx.interaction


def setup(bot: commands.Bot) -> None:
    bot.add_cog(Config(bot))
