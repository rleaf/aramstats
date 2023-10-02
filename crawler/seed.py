import util
import pymongo
from schemas.puuid_schema import puuid_schema
from schemas.match_schema import match_schema

class Seed():
   """
   Seed database on a region to eventually propagate through.
   Only needs to be fired once.
   """
   def __init__(self, db, region) -> None:
      seed_user = {
         "puuid": "-GFwYATK9tnAurTAzLbXvuerLZFem1z0Ux6aRbAmQZG9COHQjeNwPzyHfqfjYMuElQLnf8MPfJ7paQ",
         "region": "na1"
      }
      # patch = util.get_latest_patch()
      patch = '13.17'
      matchlist = util.get_summoner_matches_on_patch(seed_user["puuid"], seed_user["region"], patch)
      puuid_bin = []
      match_bin = []
      for match_id in matchlist:
         match_data = util.get_match(match_id, seed_user["region"])
         game_patch = '.'.join(match_data['info']['gameVersion'].split('.')[0:2])

         if patch != game_patch: break

         [puuid_bin.append({ 'puuid': puuid}) for puuid in match_data['metadata']['participants']]
         match_bin.append({ 'metadata': match_data['metadata'], 'info': match_data['info']})

      collection_list = db.list_collection_names()
      puuids_collection = None
      matches_collection = None


      if f"TEST{region}_puuids" in collection_list:
         puuids_collection = db[f"TEST{region}_puuids"]
      else:
         puuids_collection = db.create_collection(f"TEST{region}_puuids", validator=puuid_schema)
         puuids_collection.create_index('puuid', unique=True)

      try:
         puuids_collection.insert_many(puuid_bin, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0:
            print('uh oh')
         else:
            pass


      if f"TEST{patch}_matches" in collection_list:
         matches_collection = db[f"TEST{patch}_matches"]
      else:
         matches_collection = db.create_collection(f"TEST{patch}_matches", validator=match_schema)
         matches_collection.create_index('metadata.matchId', unique=True)

      try:
         matches_collection.insert_many(match_bin, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0:
            print('uh oh')
         else:
            pass

