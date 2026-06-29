from ui.modals.embeds import embeds
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
    embed.set_footer(text="Click save to apply toggles · Use edit buttons to customize messages")
    return embed


class MessagesEmbedModal(discord.ui.Modal):
    def __init__(self, msgs):
        super().__init__(title="Edit Verify Embed")
        self.add_item(discord.ui.InputText(
            label="Embed Title",
            value=msgs["verify_embed_title"] or embeds["default_embed"][0],
            required=True
        ))
        self.add_item(discord.ui.InputText(
            label="Embed Description",
            style=discord.InputTextStyle.paragraph,
            value=msgs["verify_embed_description"] or embeds["default_embed"][1],
            required=True
        ))

    async def callback(self, interaction: discord.Interaction):
        config = get_config()
        config["messages"]["verify_embed_title"] = self.children[0].value
        config["messages"]["verify_embed_description"] = self.children[1].value
        save_config(config)
        await interaction.response.send_message("Verify embed updated!", ephemeral=True, delete_after=3)


class MessagesResponsesModal(discord.ui.Modal):
    def __init__(self, msgs):
        super().__init__(title="Edit Response Messages")
        self.add_item(discord.ui.InputText(
            label="Processing Title",
            value=msgs["processing_title"],
            required=True
        ))
        self.add_item(discord.ui.InputText(
            label="Processing Description",
            style=discord.InputTextStyle.paragraph,
            value=msgs["processing_description"],
            required=True
        ))

    async def callback(self, interaction: discord.Interaction):
        config = get_config()
        config["messages"]["processing_title"] = self.children[0].value
        config["messages"]["processing_description"] = self.children[1].value
        save_config(config)
        await interaction.response.send_message("Response messages updated!", ephemeral=True, delete_after=3)


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

    @discord.ui.button(label="Edit Verify Embed", style=discord.ButtonStyle.secondary, row=1)
    async def edit_embed(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_modal(MessagesEmbedModal(get_config()["messages"]))

    @discord.ui.button(label="Edit Response Messages", style=discord.ButtonStyle.secondary, row=2)
    async def edit_responses(self, button: discord.ui.Button, interaction: discord.Interaction):
        await interaction.response.send_modal(MessagesResponsesModal(get_config()["messages"]))

    @discord.ui.button(label="Save", style=discord.ButtonStyle.green, row=3)
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
