import os
import argparse
from pymongo import MongoClient
from dotenv import load_dotenv
from propagate import Propagate
from seed import Seed

class Crawler():
   """
   Entry point for crawler.
   """
   def __init__(self, config) -> None:
      load_dotenv()

      client = MongoClient(os.environ['DB_CONNECTION_STRING'])
      region = config.region
      db = client.aramstats
      
      if config.seed:
         Seed(db, region)
      else:
         Propagate(db, region)

      # self.test()

   def test(_):
      print(os.environ['DB_CONNECTION_STRING'])

if __name__ == '__main__':
   args = argparse.ArgumentParser()
   args.add_argument('-s', '--seed', type=int, choices=[0, 1], default=0,
                     help='Set to 1 to seed crawl. Set to propagation by default.')
   args.add_argument('region', choices=['americas', 'europe', 'asia', 'sea'],
                     help='Select region to crawl through.')
   config = args.parse_args()

   crawler = Crawler(config)