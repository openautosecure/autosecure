import httpx
import json

config = json.load(open("config.json", "r+"))
hypixel_key = config["tokens"]["hypixel_key"]
skytools_key = config["tokens"]["skytools_key"]

def getRank(player):
    if player.get("rank") and player["rank"] != "NORMAL":
        return player["rank"]
    if player.get("monthlyPackageRank") == "SUPERSTAR":
        return "MVP++"
    if player.get("newPackageRank") and player["newPackageRank"] != "NONE":
        return player["newPackageRank"].replace("_PLUS", "+")
    if player.get("packageRank") and player["packageRank"] != "NONE":
        return player["packageRank"].replace("_PLUS", "+")
    return "Non"

async def getHypixelStats(username: str) -> dict:
    if not (hypixel_key or skytools_key):
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

        normal_stats = await session.get(
            f"https://api.hypixel.net/player?uuid={uuid}",
            headers={"API-Key": hypixel_key}
        )

        with open("normal_stats.json", "w") as f:
            json.dump(normal_stats.json(), f, indent=4)

        data = normal_stats.json()
        player = data["player"]
        stats = player.get("stats", {})
        bedwars = stats.get("Bedwars", {})
        skywars = stats.get("SkyWars", {})

        result["level"] = int(player.get("networkExp", 0) ** 0.5 / 10) + 1
        result["karma"] = player.get("karma", 0)
        result["achievement_points"] = player.get("achievementPoints", 0)
        result["gifted"] = player.get("giftingMeta", {}).get("ranksGiven", 0)
        result["rank"] = getRank(player)
        result["bw_wins"] = bedwars.get("wins_bedwars", 0)
        result["bw_losses"] = bedwars.get("losses_bedwars", 0)
        result["bw_kills"] = bedwars.get("kills_bedwars", 0)
        result["bw_deaths"] = bedwars.get("deaths_bedwars", 0)
        result["bw_final_kills"] = bedwars.get("final_kills_bedwars", 0)
        result["sw_wins"] = skywars.get("wins", 0)
        result["sw_losses"] = skywars.get("losses", 0)
        result["sw_kills"] = skywars.get("kills", 0)
        result["sw_deaths"] = skywars.get("deaths", 0)

        skyblock_stats = await session.get(
            f"https://api.skytools.app/v1/profile/{username}/networth",
            headers={"X-API-Key": skytools_key}
        )

        with open("skyblock_stats.json", "w") as f:
                json.dump(skyblock_stats.json(), f, indent=4)

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