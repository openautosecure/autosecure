import httpx
import json

config = json.load(open("config.json", "r+"))
skytools_key = config["tokens"]["skytools_key"]

async def getHypixelStats(username: str) -> dict:
    if not skytools_key:
        return None

    result = {
        "level": 0,
        "karma": 0,
        "achievement_points": 0,
        "bw_wins": 0,
        "bw_losses": 0,
        "bw_kills": 0,
        "bw_deaths": 0,
        "bw_final_kills": 0,
        "sw_wins": 0,
        "sw_losses": 0,
        "sw_kills": 0,
        "sw_deaths": 0,
        "slevel": 0,
        "networth": 0,
        "gifted": 0,
        "rank": "Non"
    }
    
    async with httpx.AsyncClient(timeout=None) as session:

        mojang = await session.get(f"https://api.mojang.com/users/profiles/minecraft/{username}")
        if mojang.status_code != 200:
            return result

        uuid = mojang.json()["id"]

        headers = {
            "X-API-Key": skytools_key
        }

        hypixel_stats = await session.get(
            f"https://api.skytools.app/v1/player/{username}",
            headers = headers
        )
        response = hypixel_stats.json()

        if response["success"]:
        
            result["level"] = response["data"]["level"]
            result["karma"] = response["data"]["karma"]
            result["achievement_points"] = response["data"]["achievementPoints"]
            result["gifted"] = response["data"]["ranksGiven"]
            result["rank"] = response["data"]["rankFormatted"]

        bedwars_stats = await session.get(
            f"https://api.skytools.app/v1/player/{username}/bedwars",
            headers = headers
        )
        response = bedwars_stats.json()

        if response["success"]:

            result["bw_wins"] = response["data"]["overall"]["wins"]
            result["bw_losses"] = response["data"]["overall"]["losses"]
            result["bw_kills"] = response["data"]["overall"]["kills"]
            result["bw_deaths"] = response["data"]["overall"]["deaths"]
            result["bw_final_kills"] = response["data"]["overall"]["finalKills"]
        
        skywars_stats = await session.get(
            f"https://api.skytools.app/v1/player/{username}/bedwars",
            headers = headers
        )
        response = skywars_stats.json()

        if response["success"]:

            result["sw_wins"] = response["data"]["overall"]["wins"]
            result["sw_losses"] = response["data"]["overall"]["losses"]
            result["sw_kills"] = response["data"]["overall"]["kills"]
            result["sw_deaths"] = response["data"]["overall"]["deaths"]

        skyblock_stats = await session.get(
            f"https://api.skytools.app/v1/profile/{username}/networth",
            headers = headers
        )

        if skyblock_stats.status_code == 200:

            if skyblock_stats.json().get("success"):
                result["networth"] = skyblock_stats.json()["data"]["networth"]["total"]

            profiles = skyblock_stats.json().get("profiles", [])
            for profile in profiles:
                if profile.get("selected"):
                    member = profile.get("members", {}).get(uuid)
                    if member:
                        result["slevel"] = member.get("leveling", {}).get("experience", 0)

        print(result)
        return result