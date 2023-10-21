import requests
import json
import os

champIds = {}
patch = '13.20.1'
champs_url = f'http://ddragon.leagueoflegends.com/cdn/{patch}/data/en_US/champion.json'
jsonobj = './data.json'

def build():
   res = requests.get(champs_url).json()
   for k, v in res['data'].items():
      # champIds[v['key']] = k
      l = v['id'].lower()
      champIds[l] = int(v['key'])
      # print(v['id'].lower())
      # v['id'].lower() = int(v['key'])
      # champIds.append([v['key'], v['id'], v['name']])
   
   with open(jsonobj, 'w') as f:
      json.dump(champIds, f)

if __name__ == '__main__':
   build()

   