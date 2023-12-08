from tracemalloc import start
import pymongo
import util
import validators as V

class Seed():
   """
   Seed database on a region to eventually propagate through.
   Only needs to be fired once.

   Region mapping for riotwatcher for reference
   remap = {
      "br1": "americas",
      "la1": "americas",
      "la2": "americas",
      "na1": "americas",
      "oc1": "sea",
      "ph2": "sea",
      "sg2": "sea",
      "th2": "sea",
      "tw2": "sea",
      "vn2": "sea",
      "eun1": "europe",
      "euw1": "europe",
      "ru": "europe",
      "tr1": "europe",
      "jp1": "asia",
      "kr": "asia",
   }
   """
   def __init__(self, patch: str, region: str, puuid_collection, match_collection) -> None:
      
      # Puuids on CRAWLER_KEY
      self.seed_user = {
         "br1": None,
         "la1": None,
         "la2": None,
         "na1": "B844TbCd9LJScvYhWf3Tpbl9xVrNO6cfPJRrXX0GDPPHO2cjKH9GuQ_3B_pocz6iWGIzcHw7XFiRAQ", # Night Owl#NA1 (NA)
         "oc1": None,
         "ph2": None,
         "sg2": None,
         "th2": None,
         "tw2": None,
         "vn2": None,
         "eun1": None,
         "euw1": "5XdlztAGE_0HmlS_If7IG9t7oADIxAFbYdUmAiZEk-XhTAmhpwyUvQEtcFgHG2ZqRSivdhKxil9J0g", # ackrite#playa (EUW)
         "ru": None,
         "tr1": None,
         "jp1": None,
         "kr": None,
      }

      self.puuid_collection = puuid_collection
      self.match_collection = match_collection
      
      self.seed(region, patch)
      print(f"Fin seeding {self.seed_user[region]}.")
      
   def seed(self, region, patch):
      puuid_bin = []
      match_bin = []
      matchlist = util.get_summoner_matches_on_patch(self.seed_user[region], region, patch)

      print(f"Seeding {self.seed_user[region]}.")
      for match_id in matchlist:
         match = util.get_match(match_id, region)
         game_patch = '.'.join(match['info']['gameVersion'].split('.')[0:2])

         # ...404 match or dead match/remake
         if match == 404 or  match['info']['gameDuration'] < 210: continue

         # ...old patch
         if patch != game_patch: break

         match_region = match['metadata']['matchId'].split('_')[0]
         skill_level_bin = []
         item_bin = []
         match_timeline = util.get_match_timeline(match_id, region)
         
         for frame in match_timeline["info"]["frames"]:
            for event in frame["events"]:
               if event["type"] == "SKILL_LEVEL_UP" and event["levelUpType"] == "NORMAL":
                  skill_level_bin.append(event)
               if event["type"] == "ITEM_PURCHASED" or event["type"] == "ITEM_SOLD" or event["type"] == "ITEM_UNDO":
                  item_bin.append(event)

         timeline_bin = [skill_level_bin, item_bin]

         [puuid_bin.append({ '_id': puuid }) for puuid in match['metadata']['participants']]

         match_bin.append({
            '_id': match['metadata']['matchId'],
            'region': match_region,
            'metadata': match['metadata'],
            'info': match['info'],
            'timeline': timeline_bin
         })

      try:
         self.puuid_collection.insert_many(puuid_bin, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0: raise Exception(f'Non-11000 errors in insertmany operation for TEST{region}_puuids:', e.details['writeErrors'][0]['errmsg'])

      try:
         self.match_collection.insert_many(match_bin, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0: raise Exception(f'Non-11000 errors in insertmany operation for TEST{patch}_matches')