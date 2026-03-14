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
        
        response_data = getEmails.json()
        emailsText = []

        # Handle paginated response structure
        emails_list = response_data.get("hydra:member", response_data) if isinstance(response_data, dict) else response_data
        
        if emails_list and len(emails_list) > 0:

            for email in emails_list:

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


                




            


    