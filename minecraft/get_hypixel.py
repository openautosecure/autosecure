import httpx
import json

config = json.load(open("config.json", "r+"))
skytools_key = config["tokens"]["skytools_key"]

async def get_hypixel_stats(username: str) -> dict:

    result = {
        "exists": bool(skytools_key),
        "hypixel": {
            "rank": "Non",
            "level": 0,
            "karma": 0,
            "points": 0,
            "gifted": 0
        },
        "bedwars": {
            "wins": 0,
            "losses": 0,
            "kills": 0,
            "deaths": 0,
            "final_kills": 0,
            "kd": 0,
        },
        "skywars": {
            "sw_wins": 0,
            "sw_losses": 0,
            "sw_kills": 0,
            "sw_deaths": 0,
            "sw_kd": 0,
        },
        "skyblock": {
            "level": 0,
            "networth": 0
        }
    }

    if skytools_key:
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
            
                result["hypixel"]["level"] = response["data"]["level"]
                result["hypixel"]["karma"] = response["data"]["karma"]
                result["hypixel"]["gifted"] = response["data"]["ranksGiven"]
                result["hypixel"]["rank"] = response["data"]["rankFormatted"]
                result["hypixel"]["points"] = response["data"]["achievementPoints"]

            bedwars_stats = await session.get(
                f"https://api.skytools.app/v1/player/{username}/bedwars",
                headers = headers
            )
            response = bedwars_stats.json()

            if response["success"]:

                result["bedwars"]["wins"] = response["data"]["overall"]["wins"]
                result["bedwars"]["losses"] = response["data"]["overall"]["losses"]
                result["bedwars"]["kills"] = response["data"]["overall"]["kills"]
                result["bedwars"]["deaths"] = response["data"]["overall"]["deaths"]
                result["bedwars"]["final_kills"] = response["data"]["overall"]["finalKills"]

            skywars_stats = await session.get(
                f"https://api.skytools.app/v1/player/{username}/skywars",
                headers = headers
            )
            response = skywars_stats.json()

            if response["success"]:

                result["skywars"]["sw_wins"] = response["data"]["overall"]["wins"]
                result["skywars"]["sw_losses"] = response["data"]["overall"]["losses"]
                result["skywars"]["sw_kills"] = response["data"]["overall"]["kills"]
                result["skywars"]["sw_deaths"] = response["data"]["overall"]["deaths"]

            skyblock_stats = await session.get(
                f"https://api.skytools.app/v1/profile/{username}/networth",
                headers = headers
            )

            if skyblock_stats.status_code == 200:

                if skyblock_stats.json()["success"]:
                    result["skyblock"]["networth"] = skyblock_stats.json()["data"]["networth"]["total"]
                
                if "profiles" in skyblock_stats.json():
                    profiles = skyblock_stats.json()["profiles"]

                    for profile in profiles:
                        if "selected" in profile:
                            member = profile["members"][uuid]
                            if member:
                                if "experience" in member["leveling"]:
                                    result["skyblock"]["level"] = member["leveling"]["experience"]
                                else:
                                    result["skyblock"]["level"] = 0

            try:
                result["bedwars"]["kd"] = round(result['bedwars']['kills'] / result['bedwars']['deaths'], 2) if result['bedwars']['deaths'] > 0 else result['bedwars']['kills']
                result["skywars"]["sw_kd"] = round(result['skywars']['sw_kills'] / result['skywars']['sw_deaths'], 2) if result['skywars']['sw_deaths'] > 0 else result['skywars']['sw_kills']
            except Exception:
                pass

    return result