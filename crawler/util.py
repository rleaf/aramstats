import os
from riotwatcher import LolWatcher, ApiError
from dotenv import load_dotenv
import requests
import time

load_dotenv()
lol_watcher = LolWatcher(os.environ['CRAWLER_RIOT_API_KEY'])

class Timer():
   def __init__(self, name) -> None:
      self.start_time = None
      self.name = name

   def start(self):
      if self.start_time is not None:
         raise Exception('timer exists')
      
      self.start_time = time.perf_counter()
   
   def stop(self):
      if self.start_time is None:
         raise Exception('timer DNE')

      delta = time.perf_counter() - self.start_time
      print(f"*****{self.name}***** :{delta:0.4f} seconds.")

def get_latest_patch(discrete=False, two=False) -> str:
   # print(lol_watcher.data_dragon.versions_for_region(region)['v'].split('.')[0:2])
   url = 'https://ddragon.leagueoflegends.com/api/versions.json'
   if two:
      res = ['.'.join(p.split('.')[0:2]) for p in requests.get(url).json()[:2]]
      return res
   if discrete:
      res = requests.get(url).json()[0].split('.')[0:3]
   else:
      res = requests.get(url).json()[0].split('.')[0:2]
   return '.'.join(res)

def get_match_patch(match: object) -> str:
   return '.'.join(match['info']['gameVersion'].split('.')[0:2])

def get_summoner_matches_on_patch(puuid: str, region: str, current_patch: str) -> str:
   bin = []

   for x in range(0, 20, 10):
      try:
         matchlist = lol_watcher.match.matchlist_by_puuid(puuid=puuid, region=region, start=x ,count=10, queue=450)
      except ApiError as e:
         raise e
      
      [bin.append(x) for x in matchlist]

      try:
         last_match = lol_watcher.match.by_id(match_id=matchlist[-1], region=region)
         trailing_patch = '.'.join(last_match['info']['gameVersion'].split('.')[0:2])
      except ApiError as e:
         raise e

      if current_patch != trailing_patch: return bin
      
   return bin

def get_matchlist(puuid: str, region: str, start: int, count: int) -> list[str]:
   try:
      return lol_watcher.match.matchlist_by_puuid(puuid=puuid, region=region, start=start, count=count, queue=450)
   except ApiError as e:
      if e.response.status_code == 429:
         print('We should retry in {} seconds.'.format(e.response.headers['Retry-After']))
      else:
         raise e

def get_match(match_id, region, attempts=0):
   if attempts > 1: return 404 # Try one more time before declaring 404
   try:
      return lol_watcher.match.by_id(match_id=match_id, region=region)
   except ApiError as e:
      print('got some funk @ get_match_timeline', match_id, f'e: {e}', f'e.res.status_code: {e.response.status_code}')
      if e.response.status_code == 429:
         print('We should retry in {} seconds.'.format(e.response.headers['Retry-After']))
      if e.response.status_code == 500:
         print('refiring @ get_match')
         # Riot seems to hand out 500s occasionally on valid requests.
         return get_match(match_id, region, attempts + 1)
      else:
         return e.response.status_code




def get_match_timeline(match_id, region, attempts=0):
   if attempts > 1: return 404 # Try one more time before declaring 404
   try:
      return lol_watcher.match.timeline_by_match(match_id=match_id, region=region)
   except ApiError as e:
      print('got some funk @ get_match_timeline', match_id, f'e: {e}', f'e.res.status_code: {e.response.status_code}')
      if e.response.status_code == 429:
         print('We should retry in {} seconds.'.format(e.response.headers['Retry-After']))
      if e.response.status_code == 500:
         # Riot seems to hand out 500s occasionally on valid requests.
         return get_match(match_id, region, attempts + 1)
      else:
         return e.response.status_code

def get_items():
   patch = get_latest_patch(True)
   url = f'https://ddragon.leagueoflegends.com/cdn/{patch}/data/en_US/item.json'
   # url = 'https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/items.json'
   res = requests.get(url).json()
   return res['data']

def get_runes():
   # patch = get_latest_patch(True)
   # url = f'https://ddragon.leagueoflegends.com/cdn/{patch}/data/en_US/runesReforged.json'
   url = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json'
   res = requests.get(url).json()
   return res

def get_champion_upsert_data(participant_id, timeline):
   leveling_path = ''
   starting_build_path = []

   for i, frame in enumerate(timeline["info"]["frames"]):
      for event in frame["events"]:
         if "participantId" in event and event["participantId"] == participant_id:

            if event["type"] == "SKILL_LEVEL_UP":
               leveling_path += str(event["skillSlot"])

            if event["type"] == "ITEM_PURCHASED":
               # item = items[str(event["itemId"])]

               # Snapshot starting items
               if i < 2: starting_build_path.append(str(event["itemId"]))

               # # Health potions. A little naive.
               # if event["itemId"] in blacklist: continue

               # # IF "into" DNE in item || IF item builds into masterwork (ornn) item. Assumes the 'requiredAlly' key is unique to Ornn.
               # if "into" not in item or 'requiredAlly' in items[str(item["into"][0])]:
               #    path.append(str(event["itemId"]))

   # path = 'builds.' + '.'.join(path) + '.meta'
   if len(starting_build_path) == 0:
      db_starting_path = 'startingBuild.0000.meta'
   else:
      db_starting_path = 'startingBuild.' + '.'.join(starting_build_path) + '.meta'

   return leveling_path, db_starting_path

def item_filter(i, items):
   blacklist = [
      0,    # No item
      2003, # Healing potion
      2031, # Refillable potion
      2140, # Elixer of wrath
      2138, # Elixer of iron
      2139, # Elixir of sorcery
      2150, # Elixir of Skill (Triple Tonic)
      2151, # Elixir of Avarice (Triple Tonic)
      2152, # Elixir of Force (Triple Tonic)
      3177, # Guardian's Blade
      3184, # Guardian's Hammer
      3112, # Guardian's Orb
      2051, # Guardian's Horn
      2010, # Total Biscuit of Everlasting Will (Klepto biscuit)
      2403, # Minion dematerializer (Klepto)
      3400, # Your Cut (Pyke)
      2424, # Broken Stopwatch
      3599, # Kalista's Black Spear
      3600, # Kalista's Black Spear
      2421, # Shattered Armguard
      2420, # Seeker's Armguard
      7050, # Gangplank placeholder (?)
   ]

   if i in blacklist: return False
   item = items[str(i)]
   """
   Moving back to ddragon for patch 14.1
   Meraki considerations:
      IE: Stores as rank 2, when should be 3
      keys are in both snake_case & camelCase
      MYTHIC & LEGENDARY are tier 3
      Masterworks are tier 4 but are still ranked as MYTHIC
      Tear evolutions are t4 too
      Some masterwork items (inf convergence, equinox, prim dawn) have empty "requiredAlly" field.
   """
   # if i > 7000 and item["tier"] == 4: return False # masterwork filter
   # if "required_ally" in item:
   #    if item["required_ally"] == "Ornn": return False
   # if "requiredAlly" in item:
   #    if item["requiredAlly"] == "Ornn": return False

   # return True if "LEGENDARY" in item["rank"] or ("MYTHIC" in item["rank"] or item["tier"] >= 3) or ('BOOTS' in item["rank"] and item["tier"] == 2) else False   

   # Assuming all builder items build into multiple epic/legendaries. Also accounts for Ornn masterworks.
   return True if "into" not in item or len(item["into"]) < 2 else False
   
def item_mythic(i, items):
   item = items[str(i)]
   return True if "MYTHIC" in item["rank"] else False

   # if "into" in item and 'requiredAlly' in items[str(item["into"][0])]:
   #    return True
   # else:
   #    return False
   
def item_evolutions(i):
   evolutions = {
      # Masterworks
      7000: 6693,
      7001: 6692,
      7002: 6691,
      7003: 3089,
      7004: 3118,
      7005: 6662,
      7006: 6671,
      7007: 6699,
      7008: 6697,
      7009: 4633,
      7010: 4636,
      7011: 3152,
      7012: 6653,
      7013: 6655,
      7014: 6656,
      7015: 6630,
      7016: 6631,
      7017: 6632,
      7018: 3078,
      7019: 3190,
      7020: 2065,
      7021: 6617,
      7022: 6701,
      7023: 3001,
      7024: 4644,
      7025: 3084,
      7026: 6665,
      7027: 6667,
      7028: 6657,
      7029: 3142,
      7030: 3124,
      7031: 3031,
      7032: 6675,
      7033: 6620,
      7034: 2502,
      7035: 6621,
      7036: 3073,
      7037: 3071,
      7038: 3161,
      7039: 6610,
      7040: 3095,
      7041: 6672,
      7042: 3115,

      # Tear evolutions
      3040: 3003, # Seraphs: Archangel's 
      3042: 3004, # Muramana: Manamune
      3121: 3119, # Fimbulwinter: Winter's Approach
   }

   if i in evolutions:
      return evolutions[i]
   else:
      return i

def champion_parse(participants, timeline, _items):
   """ 
   Return a list of champion documents to be inserted into DB for a given game
   1. Create a champion bin to return (to be insertedmany())
   2. Push champion names to list elements. Need to do this first because all of the timeline references only by the
      participantId index and I want them translated to champs.
   3. Loop through frames in match timeline for relevant data.
      -- ITEMS --
      3.1 If item is not legendary, continue (does not build into anything excluding masterworks) 
      3.2 If item exists on item step, continue
      3.3 Push to builds
      -- SKILL LEVELS --
      potatoes
      -- META --
      potatoes
   """
   champion_bin = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

   # 1 and 2 are the "same"
   # 1
   # for match_participant in participants:
   #    for timeline_participant in timeline["info"]["participants"]:
   #       if match_participant["puuid"] == timeline_participant["puuid"]:
   #          table.append({match_participant["championName"]: timeline_participant["participantId"]})
   # 2
   # table = {x["participantId"]: y["championName"] for x in timeline["info"]["participants"] for y in participants if x["puuid"] == y["puuid"]}

   # Push to champion_bin in same loops
   [champion_bin[x["participantId"]-1].update({"name": y["championName"]}) for x in timeline["info"]["participants"] for y in participants if x["puuid"] == y["puuid"]]
   _starting_items = [ [] for _ in range(10) ]
   _build = [ [] for _ in range(10) ]
   _skill_level = [ [] for _ in range(10) ]

   # for i, champ in enumerate(champion_bin):
   #    for j, frame in enumerate(timeline["info"]["frames"]):
   #       for event in frame["events"]:
   #          if i+1 != event["participantId"]: continue
   #          # Capture Level
   #          if event["type"] == "SKILL_LEVEL_UP":
   #             pass

   #          # Capture Build
   #          if event["type"] == "ITEM_PURCHASED":
   #             item_id = str(event["itemId"])

   #             # IF "into" DNE in item || IF item builds into masterwork (ornn) item. This assumes the 'requiredAlly' key is unique to Ornn.
   #             if "into" not in items[item_id] or 'requiredAlly' in items[str(items[item_id]["into"][0])]:

   #                # Starting items
   #                if j == 1:
   #                   pass
   #                print(items[item_id]["name"])


   for i, frame in enumerate(timeline["info"]["frames"]):
      for event in frame["events"]:
         # Capture Level
         if event["type"] == "SKILL_LEVEL_UP":
            _skill_level[event["participantId"] - 1].append(event["skillSlot"])

         # Capture Build
         if event["type"] == "ITEM_PURCHASED":
            event_item = str(event["itemId"])
            items = _items[event_item]

            # IF "into" DNE in item || IF item builds into masterwork (ornn) item. Assumes the 'requiredAlly' key is unique to Ornn.
            if "into" not in items or 'requiredAlly' in _items[str(items["into"][0])]:

               """ 
               Snapshotting starting items:
                  1. Look at items purchased only in the first time step, aka second frame.
                     - Summoners may be afk/dc past the first time step. Therefore snapshot won't have captured their start
                  2. Classify all purchases until >1300g as starting items.
                     - Too meticulous. Also some people may omit buying till 1300g cap to spike earlier (ie: they don't buy pots)
                  3. Say first 2 purchased items are starting items.
                     - This is so dumb I feel bad writing this. Some start noonquiver, noon + 2 pots, quad daggers, boots + blade/horn + pot, etc... all neq 2
               """
               # Starting items. Going w/ 1 for now.
               if i < 2:
                  _starting_items[event["participantId"] - 1].append(event_item)
               else: 
                  _build[event["participantId"] - 1].append(event_item)
                  
                  """ 
                  starting
                  {
                     3177: {
                        3070: {...}
                        meta: {...}
                     }
                  } 
                    
                  """
   print(_starting_items, 'starting')
   print(_build, 'build')
   print(_skill_level, 'skill')

   return

def starter_turtles(list, win):
   x = []
   if win:
      y = {"meta": {"wins": 1, "games": 1}}
   else:
      y = {"meta": {"wins": 0, "games": 1}}

   for v, j in enumerate(reversed(list)):
         y = {j: y}

   x.append(y)

   return x[0]