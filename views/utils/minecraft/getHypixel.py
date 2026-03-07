import httpx
import json

config = json.load(open("config.json", "r+"))
hypixel_key = config["tokens"]["hypixel_key"]

async def getHypixelStats(username: str) -> dict:
    if not hypixel_key:
        return None

    async with httpx.AsyncClient(timeout=None) as session:
        mojang = await session.get(f"https://api.mojang.com/users/profiles/minecraft/{username}")
        if mojang.status_code != 200:
            return "Failed"
        uuid = mojang.json()["id"]

        resp = await session.get(
            f"https://api.hypixel.net/player?uuid={uuid}",
            headers={"API-Key": hypixel_key}
        )
        if resp.status_code != 200:
            return "Failed"

        data = resp.json()
        if not data.get("success") or not data.get("player"):
            return "Failed"

        player = data["player"]
        stats = player.get("stats", {})
        bedwars = stats.get("Bedwars", {})
        skywars = stats.get("SkyWars", {})

        return {
            "result": {
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
            }
        }
