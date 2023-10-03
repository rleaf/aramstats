from riotwatcher import LolWatcher, ApiError

lolwatcher = LolWatcher('RGAPI-90555835-888c-480a-a050-26995f427a4a')

def get_match(matchId):
   try:
      res = lolwatcher.match.by_id('na1', matchId)
      print('tomato')
   except ApiError as e:
      print(e, '@@@@@')
      if e.response.status_code == 429:
         print('RLE')

   return res

def main():
   puuid = 'KGN0ZR8dNoUTFk57zZEsnmevV5mBiVc0Kpzn5IbMbiCM3BvrqWAXcrEj73tHS71YYSOmVz7SH75aDg'
   matchlist = []
   for i in range(0, 101, 100):
      print(i)
      batch = lolwatcher.match.matchlist_by_puuid('na1', puuid, i, 100, 450)
      [matchlist.append(match) for match in batch]

   for i in range(5000):
      match = get_match(matchlist[i % len(matchlist)])
      print(match['metadata']['matchId'], i)

if __name__ == '__main__':
   print('weee')
   main()


