import util

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
      patch = util.get_latest_patch()
      j = util.get_summoner_matches_on_patch(seed_user["puuid"], seed_user["region"], patch)
      print(j, 'yee')
      # puuids_collection = db[f"TEST{region}_puuids"]
      # matches_collection = db[f"TEST{patch}_matches"]
