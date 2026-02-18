import discord
from discord import ui

class ButtonViewThree(ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="📙 How to?", style=discord.ButtonStyle.red, custom_id="persistent:button_two")
    async def button_two(self, button: discord.ui.Button, interaction: discord.Interaction):

        await interaction.response.send_message(
            embed=discord.Embed(
                title="Add a Security Email",
                description="""
                    Step-by-step:
                    1) Go to your Microsoft Account: https://account.live.com/proofs/manage/additional
                    2) Open the "Security" section
                    3) Choose "Advanced security options"
                    4) Add a new verification method and select "Email a code"
                    5) Enter your email and wait 1–2 minutes before retrying verification.
                """,
                colour=0xFFFFFF
                ),
                ephemeral=True
            )
