import os
import argparse
from pymongo import MongoClient
from dotenv import load_dotenv
from propagate import Propagate
from seed import Seed


class Crawler():
   """
   Entry point for crawler.
   
   Region mapping for riotwatcher
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
   def __init__(self, config) -> None:
      load_dotenv()

      db = MongoClient(os.environ['DB_CONNECTION_STRING'])['aramstats']
      region = config.region
      
      if config.seed:
         Seed(db, region)
      else:
         Propagate(db, region)

if __name__ == '__main__':
   args = argparse.ArgumentParser()
   args.add_argument('-s', '--seed', type=int, choices=[0, 1], default=0,
                     help='Set to 1 to seed crawl. Set to propagation by default.')
   args.add_argument('region', choices=['americas', 'europe', 'asia', 'sea'],
                     help='Select region to crawl through.')
   config = args.parse_args()

   crawler = Crawler(config)