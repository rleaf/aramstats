import os
import util
import validators as V
from pymongo import MongoClient
from dotenv import load_dotenv
import pprint
pp = pprint.PrettyPrinter()

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
            name = 'wukong' if participant["championName"] == 'MonkeyKing' else participant["championName"].lower()

            # <int> Champion ID
            id = participant["championId"]

            # <[str]> List containing string representation of final build item IDs.
            path = [str(participant[f"item{x}"]) for x in range(6)]

            # <[str]> List containing filtered (desired) items.
            filtered_items = list(filter(lambda x: util.item_filter(x, self.items), path))

            # <str> Build path string ID used as field in database.
            build_path = '_'.join([str(x) for x in filtered_items])

            # <str> Skill path string ID used as field in database. A little naive as snapshots most frequently leveled skill on slice.
            skill_path = ''.join(str(x["skillSlot"]) for x in match["timeline"][0] if x["participantId"] == participant["participantId"])
            basic_skills = skill_path.replace('4', '')[3:]
            level_order = ''

            skills = {
               '1': basic_skills.count('1'),
               '2': basic_skills.count('2'),
               '3': basic_skills.count('3')
            }

            table = {
               '1': 'q',
               '2': 'w',
               '3': 'e'
            }

            _singles = [x for x in skills if skills[x] == 1]
            _zeros = [table[x] for x in skills if skills[x] == 0]

            qwe = [0, 0, 0]
            singles = ''
            zeros = ''.join(_zeros)

            for i in basic_skills:
               qwe[int(i) - 1] += 1
               if i in _singles:
                  singles += table[i]
                  continue
               
               if qwe[int(i) - 1] == skills[i] and table[i] not in level_order: level_order += table[i]
            level_order += singles + zeros

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

               # pp.pprint(update)
               # print(filtered_items)
               # print(toad)
               try:
                  self.champion_stats_collection.update_one(query, update, upsert = True)
               except Exception as e:
                  print(e, 'pancakes')

         self.index+= 1

if __name__ == "__main__":
   champion_parse = ChampionParser()