import requests
import json
import os

""" 
Util function. Pull all champ square assets. ie: https://ddragon.leagueoflegends.com/cdn/13.4.1/img/champion/Aatrox.png

   champs: List containing all championNames
   champs_url: URL to all champion json data
   image_url: URL to champion icon
   directory: Path to store images locally
"""

champs = []
champs_url = 'http://ddragon.leagueoflegends.com/cdn/13.4.1/data/en_US/champion.json'
directory = './images'


def buildList():
   res = requests.get(champs_url)
   for i in json.loads(res.text)['data']:
      champs.append(i)


def getImages(champ):
   image_url = f'https://ddragon.leagueoflegends.com/cdn/13.4.1/img/champion/{champ}.png'
   r = requests.get(image_url, stream=True)

   if r.status_code == 200:
      r.raw.decode_content = True

      # Using lowercase cause of Fiddlesticks
      with open(os.path.join('./images', f'{champ.lower()}.png'), 'wb') as f:
         f.write(r.content)

      print('ye', f'{champ.lower()}.png')
   else:
      print('nada on', f'{champ.lower()}.png')


def main():
   buildList()

   if not os.path.exists(directory):
      os.mkdir(directory)

   for champ in champs:
      getImages(champ)


main()
