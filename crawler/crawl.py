import os
import argparse
import util
import validators as V
from pymongo import MongoClient
from dotenv import load_dotenv
from propagate import Propagate
from seed import Seed

route_map = {
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

class Crawler():
   """
   Entry point for crawler.
   """
   def __init__(self, config: object) -> None:
      load_dotenv()

      db = MongoClient(os.environ['DB_CONNECTION_STRING'])['aramstats']
      collection_list = db.list_collection_names()
      region = config.region
      patch = util.get_latest_patch(two=True)
      puuid_collection_name = f"{region.upper()}_puuids"
      match_collection_name = f"{patch[0]}_matches"
      

      # Check if existing collection of puuids for REGION
      if puuid_collection_name in collection_list:
         self.puuid_collection = db[puuid_collection_name]
      else:
         self.puuid_collection = db.create_collection(puuid_collection_name, validator=V.puuid_schema)
         # self.puuid_collection.create_index('puuid', unique=True)

      # Check if existing collection of matches on PATCH
      if match_collection_name in collection_list:
         self.match_collection = db[match_collection_name]
      else:
         self.match_collection = db.create_collection(match_collection_name, validator=V.match_schema)
         self.match_collection.create_index('matchId', unique=True)

      if config.seed:
         Seed(patch[0], region, self.puuid_collection, self.match_collection)
      else:
         if "meta" in collection_list:
            meta_collection = db["meta"]
            if meta_collection.find_one({"_id": "crawler"})["patch"] != patch:
               pass
               meta_collection.update_one({ "_id": "crawler" }, { "$set": {f"{config.region}.index": 0} })
         else:
            body = {i: {"index": 0} for i in route_map.keys()}
            body["_id"] = "crawler"
            body["champ_parse_index"] = 0
            meta_collection = db.create_collection("meta", validator=V.meta_schema)
            meta_collection.insert_one(body)
         Propagate(patch[0], region, self.puuid_collection, self.match_collection, meta_collection)

if __name__ == '__main__':
   args = argparse.ArgumentParser()
   args.add_argument('-s', '--seed', type=int, choices=[0, 1], default=0,
                     help='Set to 1 to seed crawl. Set to propagation by default.')
   args.add_argument('region', choices=['br1', 'la1', 'la2', 'na1', 'oc1', 'ph2', 'sg2', 'th2', 'tw2', 'vn2', 'eun1', 'euw1', 'ru', 'tr1', 'jp1', 'kr'],
                     help='Select region to crawl through.')
   config = args.parse_args()

   crawler = Crawler(config)