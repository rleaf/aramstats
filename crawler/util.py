import requests
import json

def get_latest_patch() -> str:
   url = 'https://ddragon.leagueoflegends.com/api/versions.json'
   res = requests.get(url).json()[0].split('.')[0:2]
   return '.'.join(res)
