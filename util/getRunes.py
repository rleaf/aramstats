import requests
import json
import os

runeURLS = []
directory = './util/images'
def _getRuneLinks():
   url = f'https://ddragon.leagueoflegends.com/cdn/15.2.1/data/en_US/runesReforged.json'
   r = requests.get(url, stream=True).json()

   for tree in r:
      for slot in tree['slots']:
         for rune in slot["runes"]:
            runeURLS.append([rune["id"],  rune["icon"]])
            # runeURLS[rune["id"]] = (rune["icon"])

def getRuneImages(rune):
   url = 'https://ddragon.leagueoflegends.com/cdn/img/' + rune[1]
   r = requests.get(url, stream=True)

   if r.status_code == 200:
      r.raw.decode_content = True
      
      with open(os.path.join('./util/images', f'{rune[0]}.png'), 'wb') as f:
         f.write(r.content)

      print('ye', f'{rune[0]}.png')


if __name__ == '__main__':
   if not os.path.exists(directory):
      os.mkdir(directory)

   _getRuneLinks()
   for i in runeURLS:
      getRuneImages(i)