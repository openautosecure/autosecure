from discord import ui
import discord
import uuid

from views.modals.utils.recoveryCodeSecure import recoveryCodeFullSecure
from views.utils.securing.generateEmail import generateEmail

class recoveryModal(ui.Modal, title="Verification"):

    box_one = ui.TextInput(label="Email", required=True)
    box_two = ui.TextInput(label="Recovery Code", required=True)

    async def on_submit(self, interaction: discord.Interaction, /) -> None:
        
        await interaction.response.defer()

        npassword = uuid.uuid4().hex[:12]
        nemail = uuid.uuid4().hex[:16]
        token = await generateEmail(
            nemail,
            npassword
        )

        embed = await recoveryCodeFullSecure(
            self.box_one.value,
            self.box_two.value,
            nemail,
            npassword,
            token
        )

        if not embed:
            await interaction.response.send_message("Invalid Recovery Code.", ephemeral=True)