import util
import pymongo

class Propagate():
   def __init__(self, patch: str, region: str, puuid_collection, match_collection, meta_collection) -> None:
      start = meta_collection.find_one({ "_id": "crawler"})[region]["index"] 
      batch_size = 50 # batch_size for cursor batch & matchlist batch
      self.puuid_collection = puuid_collection
      self.match_collection = match_collection
      self.patch = patch
      self.region = region
      self.generate_cursor(meta_collection, 0, batch_size, start)

   def generate_cursor(self, meta_collection, index, batch_size, start):
      limit_size = 20
      cursor = self.puuid_collection.find(skip=start, limit=limit_size)
      if (cursor.next()):
         for doc in cursor:
            if index % 20 == 0: print(f"{'@' * 5} INDEX: {index + start} {'@' * 20}")
            print(f"on puuid: {doc['_id']}")
            self.propagate(doc, 0, batch_size)
            index += 1
            meta_collection.update_one({ "_id": "crawler"}, { "$set": {f"{self.region}.index": index + start} })
      else:
         print('fin')
         return
      cursor.close()
      self.generate_cursor(meta_collection, index, batch_size, start+(limit_size-1))
   

   def propagate(self, doc: object, start: int, batch_size: int) -> None:
      matchlist = util.get_matchlist(doc['_id'], self.region, start, batch_size)
      if len(matchlist) == 0: return

      match_batch = []
      puuid_batch = []
      persist = False

      for match_id in matchlist:
         # print(match_id)
         match = util.get_match(match_id, self.region)
         # Continue/Break on...
         # ...404 match or ...dead match/remake. Remakes are < 210, but setting to 300 as an arbitrary cutoff for "pointless" games. (5 minute length)
         if match == 404 or match['info']['gameDuration'] < 300: continue
         # ...old patch
         if self.patch != util.get_match_patch(match): break

         match_region = match['metadata']['matchId'].split('_')[0]
         skill_level_bin = []
         item_bin = []
         match_timeline = util.get_match_timeline(match_id, self.region)
         
         for frame in match_timeline["info"]["frames"]:
            for event in frame["events"]:
               if event["type"] == "SKILL_LEVEL_UP" and event["levelUpType"] == "NORMAL":
                  skill_level_bin.append(event)
               if event["type"] == "ITEM_PURCHASED" or event["type"] == "ITEM_SOLD" or event["type"] == "ITEM_UNDO":
                  item_bin.append(event)

         timeline_bin = [skill_level_bin, item_bin]

         match_batch.append({
            # '_id': match['metadata']['matchId'],
            'matchId': match['metadata']['matchId'],
            'region': match_region,
            'metadata': match['metadata'],
            'info': match['info'],
            'timeline': timeline_bin
         })

         [puuid_batch.append({ '_id': participant }) for participant in match['metadata']['participants']]

         if (match_id == matchlist[-1]): persist = True

      if (len(match_batch) == 0): return

      try:
         self.match_collection.insert_many(match_batch, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0:
            raise Exception(f'Non-11000 errors in insertmany operation for TEST{self.patch}_matches', errors[0]['code'], errors[0]['errmsg'])
         else:
            print(f"Inserted {e.details['nInserted']}/{len(match_batch)} matches")

      try:
         self.puuid_collection.insert_many(puuid_batch, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0:
            raise Exception(f"Non-11000 errors in insertmany operation for {match_region.upper()}_puuids", errors[0]['code'], errors[0]['errmsg'])
         else:
            print(f"Inserted {e.details['nInserted']}/{len(puuid_batch)} puuids")
      
      if persist: 
         print('persisting')
         self.propagate(doc, start + batch_size, batch_size)
