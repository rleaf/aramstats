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
         match_data = util.get_match(match_id, seed_user["region"])
         game_patch = '.'.join(match_data['info']['gameVersion'].split('.')[0:2])

         if patch != game_patch: break

         ###############
         print(match_id, "*************************")
         # team_100 = [x["championName"] for x in match_data["info"]["participants"] if x["teamId"] == 100]
         # team_200 = [x["championName"] for x in match_data["info"]["participants"] if x["teamId"] == 200]
      
         # match_timeline = util.get_match_timeline(match_id, seed_user["region"])
         # champion_bin = util.champion_parse(match_data["info"]["participants"], match_timeline, items["data"])
         # self.champion_collection.insert_many(champion_bin)
         build_games = ['builds.3066.meta.games', 1]
         build_wins = ['builds.3066.meta.wins', 0]
         try:
            self.champion_collection.update_one(
               {
                  "name": "Jinx",
               },
               {
                  "$inc": {
                     "games": 314,
                     "wins": 217,
                     build_games[0]: build_games[1],
                     build_wins[0]: build_wins[1]
                  },
                  # "$set": {
                  #    "builds": {
                  #       "3066": {
                  #          "meta": {
                  #             "games": 1,
                  #             "wins": 1
                  #          }
                  #       }
                  #    }
                  # }
               },
               upsert=True
            )
         except Exception as e:
            print(e, 'toad')
         ###############

         [puuid_bin.append({ 'puuid': puuid, 'region': seed_user['region']}) for puuid in match_data['metadata']['participants']]
         match_bin.append({ 'metadata': match_data['metadata'], 'info': match_data['info']})

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
