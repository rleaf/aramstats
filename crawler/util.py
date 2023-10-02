import os
from riotwatcher import LolWatcher, ApiError
from dotenv import load_dotenv
import requests

load_dotenv()
lol_watcher = LolWatcher(os.environ['RIOT_API_KEY'])

def get_latest_patch() -> str:
   # print(lol_watcher.data_dragon.versions_for_region(region)['v'].split('.')[0:2])
   url = 'https://ddragon.leagueoflegends.com/api/versions.json'
   res = requests.get(url).json()[0].split('.')[0:2]
   return '.'.join(res)  

def get_summoner_matches_on_patch(puuid: str, region: str, current_patch: str) -> str:
   bin = []

   for x in range(0, 20, 10):
      try:
         matchlist = lol_watcher.match.matchlist_by_puuid(puuid=puuid, region=region, start=x ,count=10, queue=450)
      except ApiError as err:
         print(err, '@@@@error')

      [bin.append(x) for x in matchlist]

      try:
         last_match = lol_watcher.match.by_id(match_id=matchlist[-1], region=region)
         trailing_patch = '.'.join(last_match['info']['gameVersion'].split('.')[0:2])
      except ApiError as err:
         print(err, '@@@err')

      if current_patch != trailing_patch: return bin

def get_match(match_id, region):
   return lol_watcher.match.by_id(match_id=match_id, region=region)
 
