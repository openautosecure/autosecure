# urlnw = f"https://soopy.dev/api/v2/player_skyblock/{uuidplayer}"
#             response = requests.get(urlnw)
#             if response.status_code == 200:
#                 skyblock_data = response.json()
#                 if skyblock_data["data"]["stats"] == {}:
#                     print(f"Found No Skyblock stats for user '{self.username.value}'")
#                 else:
#                     profile = skyblock_data["data"]
#                     cprofile = profile["stats"]["currentProfileId"]
#                     member = profile["profiles"][cprofile]["members"][uuidplayer]
#                     nw = member["skyhelperNetworth"]["total"]
#                     player_info["nw"] = int(nw)

#             # Rank && Level
#             hp_key = config["tokens"]["hypixel_key"]
#             if hp_key != "":
#                 url = f"https://api.hypixel.net/player?key={hp_key}&name={self.username.value}"
#                 data1 = requests.get(url)
#                 datajson = data1.json()
#                 if datajson['success'] != False or datajson['player'] != None:
#                     player_info["playerlvl"] = ""
#                     player_info["rank"] = "No Data Found"
#                     print(f"No Hypixel Player data found for {self.username.value}!")
#                     Flagx = True
                    
#                 else:
#                     Flagx =  False
#                     player_info["playerlvl"] = round((math.sqrt((2 * datajson['player']['networkExp']) + 30625)/ 50)- 2.5)
#                     if rank := datajson['player'].get('newPackageRank', "Non"): 
#                         skyblock_data["rank"] = rank