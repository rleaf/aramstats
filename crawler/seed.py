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
   def __init__(self, patch: str, items: dict, region: str, puuid_collection, match_collection, champion_collection) -> None:
      seed_user = {
         # Night Owl on DEV_KEY
         "puuid": "KGN0ZR8dNoUTFk57zZEsnmevV5mBiVc0Kpzn5IbMbiCM3BvrqWAXcrEj73tHS71YYSOmVz7SH75aDg",
         "region": "na1"
      }
      # fake_patch = '13.17'
      self.puuid_collection = puuid_collection
      self.match_collection = match_collection
      self.champion_collection = champion_collection
      matchlist = util.get_summoner_matches_on_patch(seed_user["puuid"], seed_user["region"], patch)
      puuid_bin = []
      match_bin = []

      print(f"Seeding {seed_user['region']}.")
      
      for match_id in matchlist:
         match = util.get_match(match_id, seed_user["region"])
         game_patch = '.'.join(match['info']['gameVersion'].split('.')[0:2])

         if patch != game_patch: break

         match_timeline = util.get_match_timeline(match_id, seed_user["region"])
         table = {y["championName"]:x["participantId"] for x in match_timeline["info"]["participants"] \
            for y in match["info"]["participants"] if x["puuid"] == y["puuid"]}

         champions_data = [[x["championName"], x["win"], x["teamId"], [str(x[f"item{y}"]) for y in range(6)]] for x in match["info"]["participants"]]

         for champion_data in champions_data:
            """
            name <str>: champion name
            won <int>: boolean indicating win/lose
            friendly_team <list>: summed multi-hot vector of friendly encounters
            enemy_team <list>: summed multi-hot vector of enemy encounters
            path <str>: build path in dot notation
            level_path <dict>: datum to be inserted in .levelPath that stores level path info
            starting_build <tuple>: [0] houses starting build path, similar to path. [1] houses datum to be inserted.
            """
            # Timeline-res level data
            level_path, starting_build = util.get_champion_upsert_data(table[champion_data[0]], match_timeline, items["data"], champion_data[1])

            # Match-res level data
            filtered_items = list(filter(lambda x: util.item_filter(x, items["data"]), champion_data[3]))
            path = 'builds.' + '.'.join([str(x) for x in filtered_items]) + '.meta'
            name = champion_data[0] # champion name 
            won = 1 if champion_data[1] else 0 # if champion won the game, either (0 or 1)

            if len(filtered_items) > 0:
               try:
                  self.champion_collection.update_one(
                     {
                        "name": name,
                     },
                     {
                        "$inc": {
                           "games": 1,
                           "wins": won,
                           f'{path}.games': 1,
                           f'{path}.wins': won,
                           f"{path}.{level_path}": 1,
                           f"{path}.{starting_build}.games": 1,
                           f"{path}.{starting_build}.wins": won,
                        },
                     },
                     upsert = True
                  )
               except Exception as e:
                  print(e, 'pancakes')

         [puuid_bin.append({ 'puuid': puuid, 'region': seed_user['region']}) for puuid in match['metadata']['participants']]
         match_bin.append({ 'metadata': match['metadata'], 'info': match['info']})

      try:
         self.puuid_collection.insert_many(puuid_bin, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0:
            raise Exception(f'Non-11000 errors in insertmany operation for TEST{region}_puuids')
         else:
            pass

      try:
         self.match_collection.insert_many(match_bin, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0:
            raise Exception(f'Non-11000 errors in insertmany operation for TEST{patch}_matches')
         else:
            pass
      
      print(f"Fin seeding {seed_user['region']}.")
