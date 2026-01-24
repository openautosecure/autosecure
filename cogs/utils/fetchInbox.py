from datetime import datetime
from discord import Embed
import httpx
import re

async def fetchInbox(token: str) -> list | None:

    async with httpx.AsyncClient(timeout=None) as session:
            
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
        
            return emailsText
    
        return None


                




            


    