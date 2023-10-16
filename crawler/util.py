import os
from riotwatcher import LolWatcher, ApiError
from dotenv import load_dotenv
import requests

load_dotenv()
lol_watcher = LolWatcher(os.environ['DEV_RIOT_API_KEY'])

def get_latest_patch() -> str:
   # print(lol_watcher.data_dragon.versions_for_region(region)['v'].split('.')[0:2])
   url = 'https://ddragon.leagueoflegends.com/api/versions.json'
   res = requests.get(url).json()[0].split('.')[0:2]
   return '.'.join(res)

def get_match_patch(match: object) -> str:
   return '.'.join(match['info']['gameVersion'].split('.')[0:2])

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
      except ApiError as e:
         print(e, '@@@')

      if current_patch != trailing_patch: return bin

def get_matchlist(puuid: str, region: str, start: int, count: int) -> list[str]:
   try:
      res = lol_watcher.match.matchlist_by_puuid(puuid=puuid, region=region, start=start, count=count)
   except ApiError as e:
      if e.response.status_code == 429:
         print('We should retry in {} seconds.'.format(e.response.headers['Retry-After']))
      else:
         res = e.response.status_code

   return res

def get_match(match_id, region):
   try:
      return lol_watcher.match.by_id(match_id=match_id, region=region)
   except ApiError as e:
      # print(e.response.text)
      print(e)
      if e.response.status_code == 429:
         print('We should retry in {} seconds.'.format(e.response.headers['Retry-After']))
      else:
         raise
         res = e.response.status_code


def get_match_timeline(match_id, region):
   try:
      return lol_watcher.match.timeline_by_match(match_id=match_id, region=region)
   except ApiError as e:
      # print(e.response.text)
      print(e)
      if e.response.status_code == 429:
         print('We should retry in {} seconds.'.format(e.response.headers['Retry-After']))
      else:
         raise
         res = e.response.status_code

def fun(x):
   return [x["championName"], ]

def champion_parse(participants, timeline):
   champion_bin = []
   champion = {}

   # Same as comprehension below
   # for match_participant in participants:
   #    for timeline_participant in timeline["info"]["participants"]:
   #       if match_participant["puuid"] == timeline_participant["puuid"]:
   #          table.append({match_participant["championName"]: timeline_participant["participantId"]})

   # Associate participantID with championName
   table = {x["participantId"]: y["championName"] for x in timeline["info"]["participants"] for y in participants if x["puuid"] == y["puuid"]}
   skill_level = []
   items = []

   for frame in timeline["info"]["frames"]:
      for event in frame["events"]:
         # Capture Level
         if event["type"] == "ITEM_PURCHASED": items.append(event)
         # Capture Build
         if event["type"] == "SKILL_LEVEL_UP": skill_level.append(event)

   

   print(items)
   # for i in range(1, 11):
   #    print(i)

   print(toad)
   return champion_bin