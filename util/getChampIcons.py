import requests
import json
import os

""" 
Util function. Pull all champs icons from `champs_url`

   champs: List containing all championNames
   champs_url: URL to all champion json data
   image_url: URL to champion icon
   directory: Path to store images locally
"""

champs = []
champs_url = 'http://ddragon.leagueoflegends.com/cdn/13.4.1/data/en_US/champion.json'
directory = './images'


def _buildList():
   res = requests.get(champs_url)
   for i in json.loads(res.text)['data']:
      champs.append(i)


def _getImages(champ):
   # image_url = f'https://ddragon.leagueoflegends.com/cdn/13.4.1/img/champion/{champ}.png'
   image_url = f'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{champ}_0.jpg'
   r = requests.get(image_url, stream=True)

   if r.status_code == 200:
      r.raw.decode_content = True

      # Using lowercase cause of Fiddlesticks
      with open(os.path.join('./images', f'{champ.lower()}.png'), 'wb') as f:
         f.write(r.content)

      print('ye', f'{champ.lower()}.png')
   else:
      print('nada on', f'{champ.lower()}.png')


def _getChallengeIcons(id, tier):
   image_url = f'https://ddragon.leagueoflegends.com/cdn/img/challenges-images/{id}-{tier}.png'
   r = requests.get(image_url, stream=True)

   if r.status_code == 200:
      r.raw.decode_content = True

      with open(os.path.join('./images', f'{id}-{tier}.png'), 'wb') as f:
         f.write(r.content)

      print('ye', f'{id}.png')
   else:
      print('nada on', f'{id}.png')

# Wrapper functions


def getChampionAssets():
   _buildList()
   for champ in champs:
      _getImages(champ)


def getChallengeIcons():
   IDs = [101105, 101000, 101100, 101200, 101300, 101103, 101106,
          101301, 101305, 101302, 101303, 101101, 101304, 101108, 101307, 101202]
   tiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM',
            'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER']

   for id in IDs:
      for tier in tiers:
         _getChallengeIcons(id, tier)


def main():
   if not os.path.exists(directory):
      os.mkdir(directory)

   getChampionAssets()
   # getChallengeIcons()


main()
