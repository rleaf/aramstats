import util
import pymongo

class Propagate():
   def __init__(self, patch: str, region: str, puuid_collection, match_collection) -> None:
      index = 0
      start = 20
      batch_size = 50
      self.puuid_collection = puuid_collection
      self.match_collection = match_collection
      # self.champion_collection = champion_collection
      self.patch = patch
      self.region = region
      # self.match_data_cache = []
      for doc in self.puuid_collection.find(skip=start):
         if index % 20 == 0: print(f"{'@' * 5} INDEX: {index + start} {'@' * 5}")
         print(f"on puuid: {doc['puuid']}")
         self.propagate(doc, 0, batch_size)
         # self.champion_parse(doc)
         index += 1
      print('fin')

   def propagate(self, doc: object, start: int, batch_size: int) -> None:
      matchlist = util.get_matchlist(doc['puuid'], doc['region'], start, batch_size)
      if len(matchlist) == 0: return

      match_batch = []
      puuid_batch = []
      persist = False

      for match_id in matchlist:
         print(match_id)
         match = util.get_match(match_id, doc['region'])
         # Continue/Break on...
         # ...404 match or ...dead match/remake
         if match == 404 or match['info']['gameDuration'] < 210: continue
         # ...old patch
         if self.patch != util.get_match_patch(match): break

         skill_level_bin = []
         item_bin = []
         match_timeline = util.get_match_timeline(match_id, doc["region"])
         
         for frame in match_timeline["info"]["frames"]:
            for event in frame["events"]:
               if event["type"] == "SKILL_LEVEL_UP":
                  skill_level_bin.append(event)
               if event["type"] == "ITEM_PURCHASED" or event["type"] == "ITEM_SOLD" or event["type"] == "ITEM_UNDO":
                  item_bin.append(event)

         timeline_bin = [skill_level_bin, item_bin]

         # champions_data =  [[p["participantId"], p["championName"], p["win"], p["teamId"], p["championId"], [str(p[f"item{y}"]) for y in range(6)] ] for p in match["info"]["participants"]]
         # self.match_data_cache.append([match_id, champions_data])

         # match_batch.append(match)
         match_batch.append({ 'metadata': match['metadata'], 'info': match['info'], 'timeline': timeline_bin})
         [puuid_batch.append({ 'puuid': participant, 'region': doc['region']}) \
            for participant in match['metadata']['participants']]

         if (match_id == matchlist[-1]): persist = True

      if (len(match_batch) == 0): return

      try:
         self.match_collection.insert_many(match_batch, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         # dup_matches = [x["keyValue"]["metadata.matchId"] for x in e.details["writeErrors"]]
         # self.match_data_cache = list(filter(lambda x: x[0] not in dup_matches, self.match_data_cache))

         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0:
            raise Exception(f'Non-11000 errors in insertmany operation for TEST{self.patch}_matches')
         else:
            print(f"Inserted {e.details['nInserted']}/{len(match_batch)} matches")
            pass

      try:
         self.puuid_collection.insert_many(puuid_batch, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0:
            raise Exception(f"Non-11000 errors in insertmany operation for TEST{self.region}_puuids")
         else:
            print(f"Inserted {e.details['nInserted']}/{len(puuid_batch)} puuids")
            pass
      
      if persist: 
         print('persisting')
         # self.champion_parse(doc)
         self.propagate(doc, start + batch_size, batch_size)

   def champion_parse(self, doc: object):
      for match_data in self.match_data_cache:
         match_timeline = util.get_match_timeline(match_data[0], doc["region"])

         for champion_data in match_data[1]:
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
            level_path, starting_build = util.get_champion_upsert_data(champion_data[0], match_timeline)

            # Match-res level data
            filtered_items = list(filter(lambda x: util.item_filter(x, self.items), champion_data[5]))
            path = 'builds.' + '.'.join([str(x) for x in filtered_items]) + '.meta'
            friends = [x[4] for x in match_data[1] if x[3] == champion_data[3]]
            enemies = [x[4] for x in match_data[1] if x[3] != champion_data[3]]
            name = champion_data[1] # champion name 
            won = 1 if champion_data[2] else 0 # if champion won the game, either (0 or 1)

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
                           # Friendlies
                           f"{path}.friendlyEncounters.{friends[0]}": 1,
                           f"{path}.friendlyEncounters.{friends[1]}": 1,
                           f"{path}.friendlyEncounters.{friends[2]}": 1,
                           f"{path}.friendlyEncounters.{friends[3]}": 1,
                           # Enemies
                           f"{path}.enemyEncounters.{enemies[0]}": 1,
                           f"{path}.enemyEncounters.{enemies[1]}": 1,
                           f"{path}.enemyEncounters.{enemies[2]}": 1,
                           f"{path}.enemyEncounters.{enemies[3]}": 1,
                        },
                     },
                     upsert = True
                  )
               except Exception as e:
                  print(e, 'pancakes')