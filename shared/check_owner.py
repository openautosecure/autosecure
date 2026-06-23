import json

owners = json.loads(open("config/config.json", "r"))["owners"]

def is_owner(id: int) -> bool:
    return id in owners