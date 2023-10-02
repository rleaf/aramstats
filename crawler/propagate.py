import util
import pymongo

class Propagate():
   def __init__(self, patch: str, region: str, puuid_collection, match_collection) -> None:
      index = 0
      start = 280
      batch_size = 50
      self.patch = patch
      self.region = region
      self.puuid_collection = puuid_collection
      self.match_collection = match_collection

      for doc in self.puuid_collection.find(skip=start):
         if index % 20 == 0: print(f"{'@' * 5} INDEX: {index + start} {'@' * 5}")
         print(f"on puuid: {doc['puuid']}")
         self.propagate(doc, 0, batch_size)
         index += 1
      print('fin')

   def propagate(self, doc: object, start: int, batch_size: int) -> None:
      matchlist = util.get_matchlist(doc['puuid'], doc['region'], start, batch_size)
      if len(matchlist) == 0: return

      match_batch = []
      puuid_batch = []
      persist = False

      for matchId in matchlist:
         match = util.get_match(matchId, doc['region'])

         # Continue/Break on...
         # ...404 match
         if 'status_code' in match and match['status_code'] == 404: continue
         # ...dead match
         if match['info']['gameDuration'] == 0: continue
         # ...old patch
         if self.patch != util.get_match_patch(match): break
         
         match_batch.append(match)
         [puuid_batch.append({ 'puuid': participant, 'region': doc['region']}) \
            for participant in match['metadata']['participants']]

         if (matchId == matchlist[-1]): persist = True

      if (len(match_batch) == 0): return

      try:
         self.match_collection.insert_many(match_batch, ordered=False)
      except pymongo.errors.BulkWriteError as e:
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
         self.propagate(doc, start + batch_size, batch_size)


      