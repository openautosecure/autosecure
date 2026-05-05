from database.database import DBConnection
from cogs.buttons.getInbox import getInbox
from discord.ext import commands
import discord


class MailListView(discord.ui.View):
    size = 10

    def __init__(self, emails: list, page: int = 0):
        super().__init__(timeout=120)
        self.emails = emails
        self.page = page
        self.total_pages = max(1, (len(emails) + self.size - 1) // self.size)

        previous_button = discord.ui.Button(
            label="◀",
            style=discord.ButtonStyle.secondary,
            disabled=(page == 0),
            row=0
        )
        previous_button.callback = self.previous
        self.add_item(previous_button)

        self.add_item(discord.ui.Button(
            label=f"{page + 1} / {self.total_pages}",
            style=discord.ButtonStyle.primary,
            disabled=True,
            row=0
        ))

        next_button = discord.ui.Button(
            label="▶",
            style=discord.ButtonStyle.secondary,
            disabled=(page >= self.total_pages - 1),
            row=0
        )
        next_button.callback = self.next
        self.add_item(next_button)

    def build_embed(self) -> discord.Embed:
        start = self.page * self.size
        chunk = self.emails[start:start + self.size]
        lines = "\n".join(f"`{start + i + 1}.` {e[0]}" for i, e in enumerate(chunk))
        return discord.Embed(
            title="Security Emails",
            description=f"**{len(self.emails)}** email(s) stored:\n\n{lines}",
            color=0x678DC6
        ).set_footer(text="These emails are automatically deleted after 7 days")

    async def previous(self, interaction: discord.Interaction):
        view = MailListView(self.emails, self.page - 1)
        await interaction.response.edit_message(embed=view.build_embed(), view=view)

    async def next(self, interaction: discord.Interaction):
        view = MailListView(self.emails, self.page + 1)
        await interaction.response.edit_message(embed=view.build_embed(), view=view)


class Email(commands.Cog):
    mail = discord.SlashCommandGroup("mail", "Commands related email features")

    def __init__(self, bot):
        self.bot = bot

    @mail.command(name="inbox", description="Shows the inbox of your email")
    async def emailInbox(self, ctx: discord.ApplicationContext, email: str):
        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return

        await ctx.response.defer(ephemeral=True)
        inbox = await getInbox(email)

        if not inbox:
            await ctx.respond(
                embed=discord.Embed(description="This email has not been found", color=0xFF5C5C),
                ephemeral=True
            )
            return

        if len(inbox) == 0:
            await ctx.respond(
                embed=discord.Embed(description="No emails found in inbox.", color=0xFF5C5C),
                ephemeral=True
            )
            return

        await ctx.respond(embed=inbox["embed"], view=inbox["view"], ephemeral=True)

    @mail.command(name="list", description="Lists all security emails")
    async def listMails(self, ctx: discord.ApplicationContext):
        if ctx.author.id not in self.bot.admins:
            await ctx.respond("You do not have permission to execute this command!", ephemeral=True)
            return

        with DBConnection() as database:
            emails = list(database.getEmails())

        if not emails:
            await ctx.respond(
                embed=discord.Embed(
                    title="No Emails Found",
                    description="You don't have any emails stored",
                    color=0xFF5C5C
                ),
                ephemeral=True
            )
            return

        view = MailListView(emails)
        await ctx.respond(embed=view.build_embed(), view=view, ephemeral=True)


def setup(bot: commands.Bot) -> None:
    bot.add_cog(Email(bot))
