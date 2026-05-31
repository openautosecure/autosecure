from discord.ext import commands
import discord
import json

def config():
    with open("config.json", "r") as f:
        return json.load(f)

def save_config(config):
    with open("config.json", "w") as f:
        json.dump(config, f, indent=4)


def embed(enable_2fa: bool, replace_alias: bool, mail_provider: str) -> discord.Embed:
    embed = discord.Embed(title="Bot Configuration", color=0x678DC6)
    embed.add_field(
        name="2FA",
        value="Enabled" if enable_2fa else "Disabled",
        inline=True
    )
    embed.add_field(
        name="Replace Primary Alias",
        value="Enabled" if replace_alias else "Disabled",
        inline=True
    )
    embed.add_field(
        name="Mail Provider",
        value="Mail.tm" if mail_provider == "mailtm" else "Custom Domain",
        inline=True
    )
    embed.set_footer(text="Click save to apply")
    return embed


class MailSelect(discord.ui.Select):
    def __init__(self, view: "ConfigView"):
        self._config_view = view
        options = [
            discord.SelectOption(
                label="Mail.tm",
                value="mailtm",
                description="Use Mail.tm security emails (temporary)",
                default=view.mail_provider == "mailtm"
            ),
            discord.SelectOption(
                label="Custom Domain",
                value="domain",
                description="Use your own domain (set in config)",
                default=view.mail_provider == "domain"
            ),
        ]
        super().__init__(
            placeholder="Mail provider...",
            options=options,
            row=1
        )

    async def callback(self, interaction: discord.Interaction):
        self._config_view.mail_provider = self.values[0]
        self.options = [
            discord.SelectOption(
                label="Mail.tm",
                value="mailtm",
                description="Use Mail.tm security emails (temporary)",
                default=self.values[0] == "mailtm"
            ),
            discord.SelectOption(
                label="Custom Domain",
                value="domain",
                description="Use your own domain (set in config)",
                default=self.values[0] == "domain"
            ),
        ]
        await interaction.response.edit_message(
            embed=embed(
                self._config_view.enable_2fa,
                self._config_view.replace_alias,
                self._config_view.mail_provider
            ),
            view=self._config_view
        )


class ConfigView(discord.ui.View):
    def __init__(self, enable_2fa: bool, replace_alias: bool, mail_provider: str):
        super().__init__(timeout=180)
        self.enable_2fa = enable_2fa
        self.replace_alias = replace_alias
        self.mail_provider = mail_provider
        self.add_item(MailSelect(self))

    @discord.ui.button(label="Toggle 2FA", style=discord.ButtonStyle.primary, row=0)
    async def toggle_2fa(self, button: discord.ui.Button, interaction: discord.Interaction):
        self.enable_2fa = not self.enable_2fa
        await interaction.response.edit_message(
            embed=embed(self.enable_2fa, self.replace_alias, self.mail_provider),
            view=self
        )

    @discord.ui.button(label="Toggle Primary Alias", style=discord.ButtonStyle.primary, row=0)
    async def toggle_alias(self, button: discord.ui.Button, interaction: discord.Interaction):
        self.replace_alias = not self.replace_alias
        await interaction.response.edit_message(
            embed=embed(self.enable_2fa, self.replace_alias, self.mail_provider),
            view=self
        )

    @discord.ui.button(label="Save & Restart", style=discord.ButtonStyle.green, row=2)
    async def save_restart(self, button: discord.ui.Button, interaction: discord.Interaction):
        config = config()
        config["autosecure"]["enable_2fa"] = self.enable_2fa
        config["autosecure"]["replace_main_alias"] = self.replace_alias
        config["mail_provider"] = self.mail_provider
        save_config(config)

        await interaction.response.edit_message(
            embed=discord.Embed(
                title="Configuration Saved",
                description="Restart the bot to apply these changes",
                color=0x57F287
            ),
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

        config = config()
        enable_2fa = config["autosecure"]["enable_2fa"]
        replace_alias = config["autosecure"]["replace_main_alias"]
        mail_provider = config["mail_provider"]["mailtm"]

        view = ConfigView(enable_2fa, replace_alias, mail_provider)
        embed = embed(enable_2fa, replace_alias, mail_provider)

        await ctx.respond(embed=embed, view=view, ephemeral=True)


def setup(bot: commands.Bot) -> None:
    bot.add_cog(Config(bot))
