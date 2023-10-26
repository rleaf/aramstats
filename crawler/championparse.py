import os
import util
import validators as V
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

class ChampionParser():
   def __init__(self) -> None:
      db = MongoClient(os.environ['DB_CONNECTION_STRING'])['aramstats']
      collection_list = db.list_collection_names()
      patch = util.get_latest_patch()
      # match_collection_name = f"{patch}_matches"
      match_collection_name = f"13.20_matches"
      self.champion_stats_name = "championstats"
      self.items = util.get_items()["data"]
      self.runes = util.get_runes()

      if match_collection_name in collection_list:
         self.match_collection = db[match_collection_name]
      if self.champion_stats_name in collection_list:
         self.champion_stats_collection = db[self.champion_stats_name]
      else:
         self.champion_stats_collection = db.create_collection(self.champion_stats_name, validator=V.champion_schema)
      if "meta" in collection_list:
         self.meta_document = db["meta"]
         self.index = self.meta_document.find_one({ "name": self.champion_stats_name })["index"]
      print("Starting champion parser")
      self.forward()
      self.meta_document.update_one({ "name": self.champion_stats_name}, { "$set": {"index": self.index} })
      print("Fin champion parser")

   def forward(self):
      """
      Iterate through matchdata and update champion documents for observed champions.
      """
      for match in self.match_collection.find(skip=self.index):
         print(match["metadata"]["matchId"], self.index)
         if self.index % 20 == 0 and self.index != 0:
            print('updating index')
            self.meta_document.update_one({ "name": self.champion_stats_name}, { "$set": {"index": self.index} })
               
         for participant in match["info"]["participants"]:
            # <int> Win
            win = 1 if participant["win"] else 0

            # <str> Champion name. Doing the wukong thing for url convenience on front-back end comms
            name_table = {
               "MonkeyKing": "Wukong",
               "FiddleSticks": "Fiddlesticks"
            }
            
            if participant["championName"] in name_table:
               lower_name = name_table[participant["championName"]].lower()
               name = name_table[participant["championName"]]
            else:
               lower_name = participant["championName"].lower()
               name = participant["championName"]

            # <int> Champion ID
            id = participant["championId"]

            # <[str]> List containing string representation of final build item IDs.
            path = [str(participant[f"item{x}"]) for x in range(6)]

            # <[str]> List containing filtered (desired) items.
            filtered_items = list(filter(lambda x: util.item_filter(x, self.items), path))

            # <str> Build path string ID used as field in database.
            build_path = '_'.join([str(x) for x in filtered_items])

            # <str> Skill path string ID used as field in database.
            skill_path = ''.join(str(x["skillSlot"]) for x in match["timeline"][0] if x["participantId"] == participant["participantId"] and x["levelUpType"] == "NORMAL")
            basic_skills = skill_path.replace('4', '')

            # <str> Level order of spells.
            level_order = ''
            
            ql, wl, el = 0, 0, 0
            for v in basic_skills:
               if v == '1': ql +=1
               if v == '2': wl +=1
               if v == '3': el +=1

            skills = {
               '1': ql,
               '2': wl,
               '3': el
            }

            table = {
               '1': 'q',
               '2': 'w',
               '3': 'e'
            }

            count = [ [] for _ in range(max(ql, wl, el) + 1) ]
            for s in skills: count[-skills[s]-1].append(s)

            """ 
            Cause I'm gonna forget in 5 minutes.
            1. iterate through count list which stores values by frequency in spell string where most occuring (5 levels) is the leading list and the least occuring (0 levels) is the trailing list.
            2.0 If multiple spells detected in trailing list, where multiple spells are not leveled at all, then add to level_order string arbitrarily & CONTINUE.
            2.1 If there are multiple spells with same frequency (level 18 champ has all 3 spells leveled 5 times), then iter through that and find the spell that has the earliest last occurence and append, by earliest last occurence first, to the level_order string.
            3. If there is only one spell in a count sub-list, add to string. 
            """
            for i, arr in enumerate(count):
               if len(arr) > 1:
                  if i == max(ql, wl, el):
                     for v in arr: level_order += table[v]
                     continue
                  o = {v: len(basic_skills) - 1 - basic_skills[::-1].index(v) for v in arr}
                  s = sorted(o, key=lambda x: o[x])
                  for u in s: level_order += table[u]
               elif len(arr) == 1:
                  level_order += table[arr[0]]

            # <str> Rune path string ID used as field in database.
            for x in match["info"]["participants"]:
               if x["participantId"] == participant["participantId"]:
                  primary_runes = [str(y["perk"]) for y in x["perks"]["styles"][0]["selections"]]
                  key_stone = primary_runes[0]
                  primary = f'{x["perks"]["styles"][0]["style"]}|' + '_'.join(primary_runes) + '|'

                  secondary_runes = [str(y["perk"]) for y in x["perks"]["styles"][1]["selections"]]
                  secondary = f'{x["perks"]["styles"][1]["style"]}|' + '_'.join(secondary_runes) + '|'

                  tertiary = f'{x["perks"]["statPerks"]["defense"]}_{x["perks"]["statPerks"]["flex"]}_{x["perks"]["statPerks"]["offense"]}'
            rune_path = primary + secondary + tertiary


            # <str> Starting items string ID used as field in database. 
            starting_build = []
            for x in match["timeline"][1]:
               if x["timestamp"] < 60000 and x["participantId"] == participant["participantId"]:
                  if x["type"] == "ITEM_PURCHASED":
                     starting_build.append(x["itemId"])
                  if x["type"] == "ITEM_UNDO":
                     if x["beforeId"] in starting_build: starting_build.remove(x["beforeId"])
            starting_build = '_'.join(str(x) for x in starting_build)
            if starting_build == '': starting_build = '0000'

            # <[str]> List containing friendly championIds in each match
            f = [str(x["championId"]) for x in match["info"]["participants"] if x["teamId"] == participant["teamId"] and x["championId"] != id]

            # <[str]> List containing enemy championIds in each match
            e = [str(x["championId"]) for x in match["info"]["participants"] if x["teamId"] != participant["teamId"]]

            if len(filtered_items) > 0:

               query = {
                  "lowerName": lower_name,
                  "name": name,
                  "id": id
               }

               update = {
                  "$inc": {
                     "games": 1,
                     "wins": win,
                     # Skills
                     f"skills.levelOrder.{level_order}.games": 1,
                     f"skills.levelOrder.{level_order}.wins": win,
                     f"skills.levelOrder.{level_order}.friends.{f[0]}": 1,
                     f"skills.levelOrder.{level_order}.friends.{f[1]}": 1,
                     f"skills.levelOrder.{level_order}.friends.{f[2]}": 1,
                     f"skills.levelOrder.{level_order}.friends.{f[3]}": 1,
                     f"skills.levelOrder.{level_order}.enemies.{e[0]}": 1,
                     f"skills.levelOrder.{level_order}.enemies.{e[1]}": 1,
                     f"skills.levelOrder.{level_order}.enemies.{e[2]}": 1,
                     f"skills.levelOrder.{level_order}.enemies.{e[3]}": 1,
                     f"skills.levelOrder.{level_order}.enemies.{e[4]}": 1,

                     f"skills.{skill_path}.games": 1,
                     f"skills.{skill_path}.wins": win,
                     # Runes
                     f"runes.{rune_path}.games": 1,
                     f"runes.{rune_path}.wins": win,
                     f"runes.totals.keystone.{primary_runes[0]}.games": 1,
                     f"runes.totals.keystone.{primary_runes[0]}.wins": win,
                     f"runes.totals.primary.{primary_runes[1]}.games": 1,
                     f"runes.totals.primary.{primary_runes[1]}.wins": win,
                     f"runes.totals.primary.{primary_runes[2]}.games": 1,
                     f"runes.totals.primary.{primary_runes[2]}.wins": win,
                     f"runes.totals.primary.{primary_runes[3]}.games": 1,
                     f"runes.totals.primary.{primary_runes[3]}.wins": win,
                     f"runes.totals.secondary.{secondary_runes[0]}.games": 1,
                     f"runes.totals.secondary.{secondary_runes[0]}.wins": win,
                     f"runes.totals.secondary.{secondary_runes[1]}.games": 1,
                     f"runes.totals.secondary.{secondary_runes[1]}.wins": win,
                     # Builds
                     f"builds.{build_path}.games": 1,
                     f"builds.{build_path}.wins": win,
                     f"builds.{build_path}.startingItems.{starting_build}.games": 1,
                     f"builds.{build_path}.startingItems.{starting_build}.wins": win,
                  }
               }

               # Items
               for i in filtered_items:
                  # Totals
                  update["$inc"][f"items.{i}.games"] = 1
                  update["$inc"][f"items.{i}.wins"] = win
                  # Keystone
                  update["$inc"][f"items.{i}.keystone.{key_stone}.games"] = 1
                  update["$inc"][f"items.{i}.keystone.{key_stone}.wins"] = win
                  # Skillpath
                  update["$inc"][f"items.{i}.skillPath.{skill_path}.games"] = 1
                  update["$inc"][f"items.{i}.skillPath.{skill_path}.wins"] = win
                  # Friendlies
                  update["$inc"][f"items.{i}.friends.{f[0]}"] = 1
                  update["$inc"][f"items.{i}.friends.{f[1]}"] = 1
                  update["$inc"][f"items.{i}.friends.{f[2]}"] = 1
                  update["$inc"][f"items.{i}.friends.{f[3]}"] = 1
                  # Enemies
                  update["$inc"][f"items.{i}.enemies.{e[0]}"] = 1
                  update["$inc"][f"items.{i}.enemies.{e[1]}"] = 1
                  update["$inc"][f"items.{i}.enemies.{e[2]}"] = 1
                  update["$inc"][f"items.{i}.enemies.{e[3]}"] = 1
                  update["$inc"][f"items.{i}.enemies.{e[4]}"] = 1

               try:
                  self.champion_stats_collection.update_one(query, update, upsert = True)
               except Exception as e:
                  print(e, 'pancakes')

         self.index+= 1

if __name__ == "__main__":
   champion_parse = ChampionParser()