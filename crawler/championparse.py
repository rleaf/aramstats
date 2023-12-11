import os
import util
import validators as V
# import multiprocessing as mp
from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv

load_dotenv()

class ChampionParser():
   def __init__(self) -> None:
      db = MongoClient(os.environ['DB_CONNECTION_STRING'])['aramstats']
      collection_list = db.list_collection_names()
      patch = util.get_latest_patch()
      match_collection_name = f"{patch}_matches"
      self.champion_stats_name = "crawler"
      champion_collection = f"{patch}_championstats"
      self.items = util.get_items()
      self.runes = util.get_runes()

      if match_collection_name in collection_list:
         self.match_collection = db[match_collection_name]
      if champion_collection in collection_list:
         self.champion_stats_collection = db[champion_collection]
      else:
         self.champion_stats_collection = db.create_collection(champion_collection, validator=V.champion_schema)
      if "meta" in collection_list:
         self.meta_collection = db["meta"]
         self.meta_collection.update_one({ "_id": self.champion_stats_name }, { "$set": {"patch": patch} })
         index = self.meta_collection.find_one({ "_id": self.champion_stats_name })["champ_parse_index"]

      print("Starting champion parser")
      for match in self.match_collection.find(skip=index):
         if (index % 50 == 0):
            print(f'Updating index: {index}')
            self.meta_collection.update_one({ "_id": self.champion_stats_name }, { "$set": {"champ_parse_index": index} })

         bin = self.forward(match)
         index += 1

         if len(bin) != 0:
            try:
               self.champion_stats_collection.bulk_write(bin)
            except Exception as e:
               raise e
      print("Fin champion parser")

   def forward(self, match):
      """
      Iterate through matchdata and update champion documents for observed champions.
      """
      bin = []

      for participant in match["info"]["participants"]:
         item_timeline = list(filter(lambda x: participant["participantId"] == x["participantId"], match["timeline"][1]))
         abilities_timeline = list(filter(lambda x: participant["participantId"] == x["participantId"], match["timeline"][0]))

         # <int> Win
         win = 1 if participant["win"] else 0

         # <int> Champion ID
         id = participant["championId"]

         # <[str]> List containing string representation of final build item IDs.
         path = [participant[f"item{x}"] for x in range(6)]

         # <[str]> List containing filtered (desired) items.
         filtered_items = list(filter(lambda x: util.item_filter(x, self.items), path))
         filtered_items = list(map(util.item_evolutions, filtered_items))

         if len(filtered_items) == 0: continue # Terminate iter if champ has 0 filtered items (undesired data)

         item_order = []
         for i in item_timeline:
            if i["type"] != "ITEM_PURCHASED" or i["itemId"] not in filtered_items or i["itemId"] in item_order: continue
            item_order.append(i["itemId"])

         mythic = next(filter(lambda x: util.item_mythic(x, self.items), item_order), 0)
         
         # <str> Build path string ID used as field in database.
         build_path = '_'.join([str(x) for x in item_order])
         core_build = '_'.join([str(item_order[i]) for i in range(3) if len(item_order) > 2])

         # <str> Skill path string ID used as field in database.
         skill_path = ''.join(str(x["skillSlot"]) for x in abilities_timeline)
         if len(skill_path) == 0: continue # Terminate iter if champ has 0 skills leveled. ex: participant5 for EUN1_3504521192 (undesired data)
         basic_skills = skill_path.replace('4', '')

         # <spells> Summoner spells
         summoner_spells = [str(participant["summoner1Id"]), str(participant["summoner2Id"])]
         summoner_spells.sort()
         summoner_spells = '_'.join(summoner_spells)
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
         rune_order = [
            '8112', '8124', '8128', '9923', '8126', '8139', '8143', '8136', '8120', '8138', '8135', '8134', '8105', '8106',
            '8351', '8360', '8369', '8306', '8304', '8313', '8321', '8316', '8345', '8347', '8410', '8352',
            '8005', '8008', '8021', '8010', '9101', '9111', '8009', '9104', '9105', '9103', '8014', '8017', '8299',
            '8437', '8439', '8465', '8446', '8463', '8401', '8429', '8444', '8473', '8451', '8453', '8242',
            '8214', '8229', '8230', '8224', '8226', '8275', '8210', '8234', '8233', '8237', '8232', '8236'
         ]

         rune_tier = [
            ['8126', '8139', '8143', '8306', '8304', '8313', '9101', '9111', '8009', '8446', '8463', '8401', '8224', '8226', '8275'],
            ['8136', '8120', '8138', '8321', '8316', '8345', '9104', '9105', '9103', '8429', '8444', '8473', '8210', '8234', '8233'],
            ['8135', '8134', '8105', '8106', '8347', '8410', '8352', '8014', '8017', '8299', '8451', '8453', '8242', '8237', '8232', '8236'],
         ]

         def get_rune_tier(id):
            for i, arr in enumerate(rune_tier):
               if id in arr: return i

         for x in match["info"]["participants"]:
            if x["participantId"] == participant["participantId"]:
               primary_runes = [str(y["perk"]) for y in x["perks"]["styles"][0]["selections"]]
               primary_tree = x["perks"]["styles"][0]["style"]
               primary_runes.sort(key=lambda x: rune_order.index(x))
               primary = f'{primary_tree}|' + '_'.join(primary_runes) + '|'

               secondary_runes = [str(y["perk"]) for y in x["perks"]["styles"][1]["selections"]]
               secondary_tree = x["perks"]["styles"][1]["style"]
               secondary_runes.sort(key=lambda x: rune_order.index(x))
               secondary = f'{secondary_tree}|' + '_'.join(secondary_runes) + '|'

               tertiary_offense = x["perks"]["statPerks"]["offense"]
               tertiary_flex = x["perks"]["statPerks"]["flex"]
               tertiary_defense = x["perks"]["statPerks"]["defense"]
               tertiary = f'{tertiary_offense}_{tertiary_flex}_{tertiary_defense}'
         rune_path = primary + secondary + tertiary

         secondary_rune_one_tier = get_rune_tier(secondary_runes[0])
         secondary_rune_two_tier = get_rune_tier(secondary_runes[1])
         # <str> Starting items string ID used as field in database. 
         starting_build = []
         for x in item_timeline:
            if x["timestamp"] < 60000:
               if x["type"] == "ITEM_PURCHASED":
                  starting_build.append(x["itemId"])
               if x["type"] == "ITEM_UNDO":
                  if x["beforeId"] in starting_build: starting_build.remove(x["beforeId"])
         starting_build.sort()
         starting_build = '_'.join(str(x) for x in starting_build)
         if starting_build == '': starting_build = '0000'
         # <[str]> List containing friendly championIds in each match
         f = [str(x["championId"]) for x in match["info"]["participants"] if x["teamId"] == participant["teamId"] and x["championId"] != id]

         # <[str]> List containing enemy championIds in each match
         e = [str(x["championId"]) for x in match["info"]["participants"] if x["teamId"] != participant["teamId"]]

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
               # Builds
               f"builds.{build_path}.games": 1,
               f"builds.{build_path}.wins": win,
               # Mythics
               f"mythics.{mythic}.runes.{rune_path}.games": 1,
               f"mythics.{mythic}.runes.{rune_path}.wins": win,
               f"mythics.{mythic}.primaryRunes.{primary_tree}.games": 1,
               f"mythics.{mythic}.primaryRunes.{primary_tree}.wins": win,
               f"mythics.{mythic}.primaryRunes.{primary_tree}.row0.{primary_runes[0]}.games": 1,
               f"mythics.{mythic}.primaryRunes.{primary_tree}.row0.{primary_runes[0]}.wins": win,
               f"mythics.{mythic}.primaryRunes.{primary_tree}.row1.{primary_runes[1]}.games": 1,
               f"mythics.{mythic}.primaryRunes.{primary_tree}.row1.{primary_runes[1]}.wins": win,
               f"mythics.{mythic}.primaryRunes.{primary_tree}.row2.{primary_runes[2]}.games": 1,
               f"mythics.{mythic}.primaryRunes.{primary_tree}.row2.{primary_runes[2]}.wins": win,
               f"mythics.{mythic}.primaryRunes.{primary_tree}.row3.{primary_runes[3]}.games": 1,
               f"mythics.{mythic}.primaryRunes.{primary_tree}.row3.{primary_runes[3]}.wins": win,
               f"mythics.{mythic}.secondaryRunes.{secondary_tree}.games": 1,
               f"mythics.{mythic}.secondaryRunes.{secondary_tree}.wins": win,
               f"mythics.{mythic}.secondaryRunes.{secondary_tree}.row{secondary_rune_one_tier}.{secondary_runes[0]}.games": 1,
               f"mythics.{mythic}.secondaryRunes.{secondary_tree}.row{secondary_rune_one_tier}.{secondary_runes[0]}.wins": win,
               f"mythics.{mythic}.secondaryRunes.{secondary_tree}.row{secondary_rune_two_tier}.{secondary_runes[1]}.games": 1,
               f"mythics.{mythic}.secondaryRunes.{secondary_tree}.row{secondary_rune_two_tier}.{secondary_runes[1]}.wins": win,
               f"mythics.{mythic}.flexRunes.row0.{tertiary_offense}.games": 1,
               f"mythics.{mythic}.flexRunes.row0.{tertiary_offense}.wins": win,
               f"mythics.{mythic}.flexRunes.row1.{tertiary_flex}.games": 1,
               f"mythics.{mythic}.flexRunes.row1.{tertiary_flex}.wins": win,
               f"mythics.{mythic}.flexRunes.row2.{tertiary_defense}.games": 1,
               f"mythics.{mythic}.flexRunes.row2.{tertiary_defense}.wins": win,
               # Spells
               f"mythics.{mythic}.spells.{summoner_spells}.games": 1,
               f"mythics.{mythic}.spells.{summoner_spells}.wins": win,
               # Skill path
               f"mythics.{mythic}.skillPath.{skill_path}.games": 1,
               f"mythics.{mythic}.skillPath.{skill_path}.wins": win,
               # Level order
               f"mythics.{mythic}.levelOrder.{level_order}.games": 1,
               f"mythics.{mythic}.levelOrder.{level_order}.wins": win,
            }
         }

         if mythic == 0:
            update["$inc"][f"mythics.{mythic}.games"] = 1
            update["$inc"][f"mythics.{mythic}.wins"] = win

         if core_build:
            update["$inc"][f"mythics.{mythic}.coreBuild.{core_build}.games"] = 1
            update["$inc"][f"mythics.{mythic}.coreBuild.{core_build}.wins"] = win
            update["$inc"][f"mythics.{mythic}.startingItems.{starting_build}.games"] = 1
            update["$inc"][f"mythics.{mythic}.startingItems.{starting_build}.wins"] = win

         # Items
         for i in filtered_items:
            # Totals
            update["$inc"][f"items.{i}.games"] = 1
            update["$inc"][f"items.{i}.wins"] = win
            # Mythic related data conditioned on i
            update["$inc"][f"mythics.{mythic}.items.{item_order.index(i)}.{i}.games"] = 1
            update["$inc"][f"mythics.{mythic}.items.{item_order.index(i)}.{i}.wins"] = win
            # Position
            update["$inc"][f"items.{i}.position.{item_order.index(i)}.games"] = 1
            update["$inc"][f"items.{i}.position.{item_order.index(i)}.wins"] = win
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

         bin.append(UpdateOne({ "_id": id }, update, upsert=True))
      return bin

if __name__ == "__main__":
   champion_parse = ChampionParser()