import os
import util
import time
import validators as V
from itertools import repeat
from multiprocessing import Pool
from pymongo import MongoClient, UpdateOne
from bson.objectid import ObjectId
from bson.int64 import Int64
from dotenv import load_dotenv

import pprint
pp = pprint.PrettyPrinter()
load_dotenv()

class ChampionParser():
   def __init__(self) -> None:
      db = MongoClient(os.environ['DB_CONNECTION_STRING'])['aramstats']
      patch = util.get_latest_patch(two=True)
      collection_list = db.list_collection_names()
      match_collection_name = f"{patch[0]}_matches"
      champion_collection = f"{patch[0]}_championstats"
      self.items = util.get_items()
      self.champions = util.get_champions()
      self.batch_size = 10 # Number of match documents in a batch. Care bear: 1 match = 10 champions, so bulk_writing to 100 champion documents for a 10 batch size

      if match_collection_name in collection_list:
         self.match_collection = db[match_collection_name]
      if champion_collection in collection_list:
         self.champion_stats_collection = db[champion_collection]
      else:
         self.champion_stats_collection = db.create_collection(champion_collection, validator=V.champion_schema)
      if "meta" in collection_list:
         meta_collection = db["meta"]
         if meta_collection.find_one({ "_id": "crawler" })["patch"] != patch:
            meta_collection.update_one({ "_id": "crawler" }, { "$set": {"patch": patch} })
            self.trail = None
         else:
            self.trail = meta_collection.find_one({ "_id": "crawler" })["trail"]
      # self.query = self.trail if self.trail == {} else { '_id': { "$gt": self.trail } }
      self.query = { '_id': { "$gt": self.trail } } if self.trail else {}
      # { "_id": self.query }
      # print("Starting champion parser")
      trail_id = None
      for i, batch in enumerate(self.get_batches()):
         trail_id = batch[-1]['_id']
         if (i % 5 == 0 and i > 0): # Update every 50 matches
            meta_collection.update_one({ "_id": "crawler" }, { "$set": {"trail": ObjectId(trail_id)} })

         # start = time.perf_counter()
         print(f"On batch {i}")
         with Pool() as p:
            bin = p.starmap(forward, zip(batch, repeat(self.items)))
            flat = [x for xs in bin for x in xs] 
            self.champion_stats_collection.bulk_write(flat)
            time.sleep(0.2)
            
         # finish = time.perf_counter()   
         # print(f"Finished batch {i} in {round(finish-start, 2)} second(s)")

      if trail_id is not None: meta_collection.update_one({ "_id": "crawler" }, { "$set": {"trail": ObjectId(trail_id)} })
      self.preprocess()

   def preprocess(self):
      """ 
      Preprocess data that can significantly detriment user experience on frontend.
      Data to be preprocessed will be in raw field.

      Care bear on runtime for this & monitor runtime to ensure doesn't overlap cronjobs.
      """
      champion_winrate_pickrate = []
      total = 0
      time_bin = []
      for doc in self.champion_stats_collection.find():
         start = time.perf_counter()
         champion_winrate_pickrate.append({ "_id": doc["_id"], "games": doc["games"], "wins": doc["wins"]})
         total += doc["games"]

         data = ([core, list(doc["raw"]["core"][core]["levels"].items())] for core in doc["raw"]["core"] if doc["core"])

         with Pool() as p:
            cleaned_levels = p.map(levels, data)

         bin = [UpdateOne({"_id": doc["_id"]}, {"$set": {f"core.{o[0]}.levels": o[1]}}, upsert=True) for o in cleaned_levels]
         self.champion_stats_collection.bulk_write(bin)
         finish = time.perf_counter()
         time_bin.append(finish-start)

      for champion in champion_winrate_pickrate:
         champion["pickRate"] = round((champion["games"] / total) * 100, 2)
         champion["winRate"] = round((champion["wins"] / champion["games"]) * 100, 2)

      champion_winrate_pickrate = sorted(champion_winrate_pickrate, key=lambda x: x["winRate"], reverse=True)

      for i, doc in enumerate(champion_winrate_pickrate):
         update = {
            "$set": {
               "rank": i+1,
               "pickRate": doc["pickRate"],
            }
         }

         self.champion_stats_collection.update_one({ "_id": doc["_id"] }, update, upsert=True)
      print("Fin rank/pickrate")
      print("Average time per champion:", round(sum(time_bin) / len(time_bin), 2))
   
   def get_batches(self):
      """ 
      Batch match documents from collection
      """
      batch = []
      i = 0
      if self.query == {}:
         print('Starting from the beginning')
      else:
         print(f"Starting from {self.query}")
      for i, doc in enumerate(self.match_collection.find(self.query).sort("_id", 1)):
      # for i, doc in enumerate(self.match_collection.find({ "_id": { "$gt": ObjectId(self.query) } }).sort("_id", 1)):
         
         if i % self.batch_size == 0 and i > 0:
            yield batch
            del batch[:]
         i += 1
         batch.append(doc)
      yield batch

def forward(match, items):
   """
   Iterate through matchdata and update champion documents for observed champions.
   """
   bin = []
   game_duration_min = match['info']['gameDuration'] / 60

   for participant in match["info"]["participants"]:

      update = {
         "$inc": {},
         "$set": {}
      }

      # <int> Win
      win = 1 if participant["win"] else 0

      # <int> Champion ID
      id = participant["championId"]

      # <[str]> List containing string representation of final build item IDs.
      path = [participant[f"item{x}"] for x in range(6)]

      # <[str]> List containing filtered (desired) items.
      filtered_items = list(filter(lambda x: util.item_filter(x, items), path))
      filtered_items = list(map(util.item_evolutions, filtered_items))

      if len(filtered_items) == 0: continue # Terminate iter if champ has 0 filtered items (undesired data)

      # <spells> Summoner spells
      summoner_spells = [str(participant["summoner1Id"]), str(participant["summoner2Id"])]
      summoner_spells.sort()
      summoner_spells = '_'.join(summoner_spells)

      primary_runes = [str(y["perk"]) for y in participant["perks"]["styles"][0]["selections"]]
      primary_tree = participant["perks"]["styles"][0]["style"]

      secondary_runes = [str(y["perk"]) for y in participant["perks"]["styles"][1]["selections"]]
      secondary_tree = participant["perks"]["styles"][1]["style"]
      tertiary_offense = participant["perks"]["statPerks"]["offense"]
      tertiary_flex = participant["perks"]["statPerks"]["flex"]
      tertiary_defense = participant["perks"]["statPerks"]["defense"]

      if match["timeline"]: 
         item_timeline = list(filter(lambda x: participant["participantId"] == x["participantId"], match["timeline"][1]))
         abilities_timeline = list(filter(lambda x: participant["participantId"] == x["participantId"], match["timeline"][0]))

         item_order = []
         for i in item_timeline:
            if i["type"] != "ITEM_PURCHASED" or i["itemId"] not in filtered_items or i["itemId"] in item_order: continue
            item_order.append(i["itemId"])

         # Core item **combination**. Sorted to consolidate permutations. 
         boots = ["1001", "3005", "3047", "3117", "3006", "3009", "3020", "3111", "3158", "2422"]
         core = [str(item_order[i]) for i in range(3) if len(item_order) > 2]
         core = list(map(lambda x: "10010" if x in boots else x, core))
         core = '_'.join(sorted(core))

         # Starting Build
         starting_build = []
         for x in item_timeline:
            if x["timestamp"] < 60000:
               if x["type"] == "ITEM_PURCHASED":
                  starting_build.append(x["itemId"])
               if x["type"] == "ITEM_UNDO":
                  if x["beforeId"] in starting_build: starting_build.remove(x["beforeId"])
            else:
               break

         starting_build.sort()
         starting_build = '_'.join(str(x) for x in starting_build)
         if starting_build == '': starting_build = '0000'


         # <str> Skill path string ID used as field in database.
         skill_path = ''.join(str(x["skillSlot"]) for x in abilities_timeline)
         if len(skill_path) == 0: continue # Terminate iter if champ has 0 skills leveled. ex: participant5 for EUN1_3504521192 (undesired data)
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

         # Compute metrics (DPM, DTPM, DMPM, GPM)
         metrics = {
            'dpm': int(participant['totalDamageDealtToChampions'] / game_duration_min),
            'dtpm': int(participant['totalDamageTaken'] / game_duration_min),
            'dmpm': int(participant['damageSelfMitigated'] / game_duration_min),
            'gpm': int(participant['goldEarned'] / game_duration_min),
         }
         
         update["$inc"][f"skills.{level_order}.games"] = 1
         update["$inc"][f"skills.{level_order}.wins"] = win
         update["$inc"][f"starting.{starting_build}.games"] = 1
         update["$inc"][f"starting.{starting_build}.wins"] = win
         update["$inc"]["metrics.dpm.x"] = Int64(metrics["dpm"])
         update["$inc"]["metrics.dpm.xx"] = Int64(metrics["dpm"] ** 2)
         update["$inc"]["metrics.dtpm.x"] = Int64(metrics["dtpm"])
         update["$inc"]["metrics.dtpm.xx"] = Int64(metrics["dtpm"] ** 2)
         update["$inc"]["metrics.dmpm.x"] = Int64(metrics["dmpm"])
         update["$inc"]["metrics.dmpm.xx"] = Int64(metrics["dmpm"] ** 2)
         update["$inc"]["metrics.gpm.x"] = Int64(metrics["gpm"])
         update["$inc"]["metrics.gpm.xx"] = Int64(metrics["gpm"] ** 2)

         if core:
            update["$inc"][f"core.{core}.games"] = 1
            update["$inc"][f"core.{core}.wins"] = win
            update["$inc"][f"core.{core}.starting.{starting_build}.games"] = 1
            update["$inc"][f"core.{core}.starting.{starting_build}.wins"] = win
            update["$inc"][f"core.{core}.spells.{summoner_spells}.games"] = 1
            update["$inc"][f"core.{core}.spells.{summoner_spells}.wins"] = win
            # Raw data
            update["$inc"][f"raw.core.{core}.levels.{skill_path}.games"] = 1
            update["$inc"][f"raw.core.{core}.levels.{skill_path}.wins"] = win
            # Rune tree
            update["$inc"][f"core.{core}.runes.tree.primary.{primary_tree}.games"] = 1
            update["$inc"][f"core.{core}.runes.tree.primary.{primary_tree}.wins"] = win
            update["$inc"][f"core.{core}.runes.tree.secondary.{secondary_tree}.games"] = 1
            update["$inc"][f"core.{core}.runes.tree.secondary.{secondary_tree}.wins"] = win
            # Runes
            update["$inc"][f"core.{core}.runes.primary.{primary_runes[0]}.games"] = 1
            update["$inc"][f"core.{core}.runes.primary.{primary_runes[0]}.wins"] = win
            update["$inc"][f"core.{core}.runes.primary.{primary_runes[1]}.games"] = 1
            update["$inc"][f"core.{core}.runes.primary.{primary_runes[1]}.wins"] = win
            update["$inc"][f"core.{core}.runes.primary.{primary_runes[2]}.games"] = 1
            update["$inc"][f"core.{core}.runes.primary.{primary_runes[2]}.wins"] = win
            update["$inc"][f"core.{core}.runes.primary.{primary_runes[3]}.games"] = 1
            update["$inc"][f"core.{core}.runes.primary.{primary_runes[3]}.wins"] = win
            update["$inc"][f"core.{core}.runes.secondary.{secondary_runes[0]}.games"] = 1
            update["$inc"][f"core.{core}.runes.secondary.{secondary_runes[0]}.wins"] = win
            update["$inc"][f"core.{core}.runes.secondary.{secondary_runes[1]}.games"] = 1
            update["$inc"][f"core.{core}.runes.secondary.{secondary_runes[1]}.wins"] = win
            update["$inc"][f"core.{core}.runes.tertiary.offense.{tertiary_offense}.games"] = 1
            update["$inc"][f"core.{core}.runes.tertiary.offense.{tertiary_offense}.wins"] = win
            update["$inc"][f"core.{core}.runes.tertiary.defense.{tertiary_defense}.games"] = 1
            update["$inc"][f"core.{core}.runes.tertiary.defense.{tertiary_defense}.wins"] = win
            update["$inc"][f"core.{core}.runes.tertiary.flex.{tertiary_flex}.games"] = 1
            update["$inc"][f"core.{core}.runes.tertiary.flex.{tertiary_flex}.wins"] = win

            for i, item in enumerate(item_order):
               update["$inc"][f"core.{core}.items.{i+1}.{item}.games"] = 1
               update["$inc"][f"core.{core}.items.{i+1}.{item}.wins"] = win

      # General
      update["$inc"][f"games"] = 1
      update["$inc"][f"wins"] = win
      update["$inc"][f"rank"] = 0
      update["$inc"][f"pickRate"] = 0.0
      # Runes
      update["$inc"][f"runes.primary.{primary_runes[0]}.games"] = 1
      update["$inc"][f"runes.primary.{primary_runes[0]}.wins"] = win
      update["$inc"][f"runes.primary.{primary_runes[1]}.games"] = 1
      update["$inc"][f"runes.primary.{primary_runes[1]}.wins"] = win
      update["$inc"][f"runes.primary.{primary_runes[2]}.games"] = 1
      update["$inc"][f"runes.primary.{primary_runes[2]}.wins"] = win
      update["$inc"][f"runes.primary.{primary_runes[3]}.games"] = 1
      update["$inc"][f"runes.primary.{primary_runes[3]}.wins"] = win
      update["$inc"][f"runes.secondary.{secondary_runes[0]}.games"] = 1
      update["$inc"][f"runes.secondary.{secondary_runes[0]}.wins"] = win
      update["$inc"][f"runes.secondary.{secondary_runes[1]}.games"] = 1
      update["$inc"][f"runes.secondary.{secondary_runes[1]}.wins"] = win
      update["$inc"][f"runes.tertiary.offense.{tertiary_offense}.games"] = 1
      update["$inc"][f"runes.tertiary.offense.{tertiary_offense}.wins"] = win
      update["$inc"][f"runes.tertiary.defense.{tertiary_defense}.games"] = 1
      update["$inc"][f"runes.tertiary.defense.{tertiary_defense}.wins"] = win
      update["$inc"][f"runes.tertiary.flex.{tertiary_flex}.games"] = 1
      update["$inc"][f"runes.tertiary.flex.{tertiary_flex}.wins"] = win
      # Summoner Spells
      update["$inc"][f"spells.{summoner_spells}.games"] = 1
      update["$inc"][f"spells.{summoner_spells}.wins"] = win

      # Items
      for i, item in enumerate(item_order):
         update["$inc"][f"items.{i+1}.{item}.games"] = 1
         update["$inc"][f"items.{i+1}.{item}.wins"] = win

      bin.append(UpdateOne({ "_id": id }, update, upsert=True))
   
   return bin

def levels(i):
   """ 
   Reduce redundant levels. Sort input in descending and combine the wins & games of lower leveled skillpaths.

   Q: Do I have to manually watch for champs that auto point into an ability such as Azir and Zeri? 
   A: Yes, their auto skilled ability is not recorded in timeline.
   """
   raw = sorted(i[1], key=lambda x: len(x[0]), reverse=True)
   cleaned = [[raw[0][0], raw[0][1]["games"], raw[0][1]["wins"]]]
   for o in raw[1:]: #  ('123114222211334334', {'games': 1, 'wins': 0})
      cleaned_levels = ''.join(sorted(o[0][:3])) + o[0][3:] # Use combinations > permutations for levels 1-3. (112 == 121)
      push = True

      for x in cleaned:
         if o[0] in x[0]:
            x[1] += o[1]["games"]
            x[2] += o[1]["wins"]
            push = False
            break

      if push:
         cleaned.append([cleaned_levels, o[1]["games"], o[1]["wins"]])

   cleaned.sort(key=lambda x: x[2], reverse=True)
   return [i[0], cleaned]

def welford_mean(x, k, m_old):
   return int(m_old + ((x - m_old) / k))

def welford_variance(x, m, m_old, v_old):
   return int(v_old + (x - m_old) * (x - m))

def init_pool_process(o, d):
   global GAMES_ARRAY
   global TEST_DICT
   GAMES_ARRAY = o
   TEST_DICT = d

if __name__ == "__main__":
   ChampionParser()