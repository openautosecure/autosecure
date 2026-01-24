from datetime import datetime
from discord import Embed
import httpx
import re

# Email/Password is not needed its just as an info for the embed
async def fetchInbox(token: str, email: str, password: str) -> Embed:

    async with httpx.AsyncClient(timeout=None) as session:
            
        embed = Embed(
            title = "📧 Email Inbox",
            description = f"**Email:** {email}\n**Password:** {password}",
            color = 0x5865F2 
        )
        
        getEmails = await session.get(
            url = f"https://api.mail.tm/messages",
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": f"Bearer {token}"
            }
        )
        
        emails = getEmails.json()
        emailsText = []

        if emails:

            for email in getEmails.json():

                response = await session.get(
                    url = f"https://api.mail.tm/messages/{email["id"]}",
                    headers = {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "authorization": f"Bearer {token}"
                    }
                )

                emailData = response.json()
                emailsText.append(emailData["text"])

        else:
            
            embed.description = "This inbox hasn't received any emails yet!"
            embed.color = 0xFFFF7A

        embed.set_footer(text = "Each email is automaticly deleted by mail.tm after 7 days")

        return embed


                




            


    