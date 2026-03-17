from millify import millify
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

    async with httpx.AsyncClient(timeout=None) as session:

        mojang = await session.get(f"https://api.mojang.com/users/profiles/minecraft/{username}")
        if mojang.status_code != 200:
            return "Failed"
        
        uuid = mojang.json()["id"]

        normal_stats = await session.get(
            f"https://api.hypixel.net/player?uuid={uuid}",
            headers={
                "API-Key": hypixel_key
            }
        )
        
        skyblock_stats = await session.get(
            f"https://api.skytools.app/v1/profile/{username}/networth",
            headers={
                "X-API-Key": skytools_key
            }
        )
        networth = 0
        if skyblock_stats.json()["success"]:
            networth = skyblock_stats.json()["data"]["networth"]["total"]
            
        with open("skyblock_stats.json", "w") as f:
            json.dump(skyblock_stats.json(), f, indent=4)

        
        data = normal_stats.json()

        player = data["player"]

        stats = player.get("stats", {})
        bedwars = stats.get("Bedwars", {})
        skywars = stats.get("SkyWars", {})

        rank = getRank(player)
        gifted = player.get("giftingMeta", {}).get("ranksGiven", 0)
        hypixel_level = int(((player.get("networkExp", 0)) ** 0.5) / 10) + 1
        
        skyblock_level = 0
        profiles = skyblock_stats.json().get("profiles", [])

        for profile in profiles:
            if profile.get("selected"):
                member = profile.get("members", {}).get(uuid)
                if member:
                    skyblock_level = member.get("leveling", {}).get("experience", 0)


        result = {
            "level": int(player.get("networkExp", 0) ** 0.5 / 10) + 1,
            "karma": player.get("karma", 0),
            "achievement_points": player.get("achievementPoints", 0),
            "bw_wins": bedwars.get("wins_bedwars", 0),
            "bw_losses": bedwars.get("losses_bedwars", 0),
            "bw_kills": bedwars.get("kills_bedwars", 0),
            "bw_deaths": bedwars.get("deaths_bedwars", 0),
            "bw_final_kills": bedwars.get("final_kills_bedwars", 0),
            "sw_wins": skywars.get("wins", 0),
            "sw_losses": skywars.get("losses", 0),
            "sw_kills": skywars.get("kills", 0),
            "sw_deaths": skywars.get("deaths", 0),
            "slevel": skyblock_level,
            "hlevel": hypixel_level,
            "networth": networth,
            "gifted": gifted,
            "rank": rank
        }

        print(result)
        return result