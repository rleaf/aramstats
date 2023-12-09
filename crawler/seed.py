from tracemalloc import start
import pymongo
import util
import validators as V

class Seed():
   """
   Seed database on a region to eventually propagate through.
   Only needs to be fired once.

   Region mapping for riotwatcher for reference
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
   def __init__(self, patch: str, region: str, puuid_collection, match_collection) -> None:
      
      # Puuids on CRAWLER_KEY
      self.seed_user = {
         "br1": "23nZx-YHQWIhlAWoD77gzxFtj8VyTC6nD0RApddzRwsITH6VYPCDKj4XOoYHyqdnDmy4jxJaVsd1eA", # Milio Ackerman#4120 (BR)
         "la1": "7Wsbi1zgw2FHEkZ8Cg46vxRBhOZA8lurKw4t0LqspUPyuR1wgKw115jnfCbO10RCFq5S2ckmulKO8A", # Alexzz#LAN (LAN)
         "la2": "zcK8bKE6DE8Bnz4XKS-fEChIfFECjVVutxKHWYdZQpqceUNxGNBSiiVH8M8jpllnE98RN4_EwbZxFA", # Impostore1#ARAM (LAS)
         "na1": "B844TbCd9LJScvYhWf3Tpbl9xVrNO6cfPJRrXX0GDPPHO2cjKH9GuQ_3B_pocz6iWGIzcHw7XFiRAQ", # Night Owl#NA1 (NA)
         "oc1": "n-wSgryK-87m6aWjNepdDExoulJreLehrmV3qk0fnGjOv6vwMjBFr2D9_t0waa_jfJMd2edDBYbKTA", # Lenka#9909 (OCE)
         "ph2": "Zj1MWGDfnkMpGG1HhaRHks15g7CbBrR3E3eJyAKkM-UD8-zwvQZXj3MfTmxnZ6VGMqYa1LOiNAlBAw", # lazada VibeTech#PH2 (PH)
         "sg2": "IccW8NOkMEI5Qy48LI9P1M4KVI-A9SnlCpDfLGA29Ci3x3Z16hT61zedrAFFtgCdRdfwIEP_OcFsLA", # freezingfiref#SG2 (SG)
         "th2": "y-di6H1tcJu0nCQDvFMOsNV-Vq5dymo65sVqwY75rb2Gs5tV9s4n0YcRrGTSt2Pqzwmh7IRQn1Q6pA", # Faker#JZG9 (TH)
         "tw2": "tO4eNOI0HzqNjGRx19zjecS7s2iHEzMZZWf2QgJ5TTriWs9Fl-Vie7ztrqdUFfBZeVh7ODTJW3CbKA", # Hide on bush #ILFAK (TW)
         "vn2": "IMtEblhwor3CDjLUkoisAP3M98IvBSFi8ENoNDAEv3R0GMFxojdqfOI6YfZCEkPVeDDVPvgrE_Kotg", # Ntphuong458#VN2 (VN)
         "eun1": "WXi8PjP0QYEaAQFE3QOp6PBI0wlntWnFC4AGfgGAyXEN2GKWb4u6bCMmKlDlfSB0hU5zmZlzdyxCUA", # BrovarSpirytus#eune (EUNE)
         "euw1": "5XdlztAGE_0HmlS_If7IG9t7oADIxAFbYdUmAiZEk-XhTAmhpwyUvQEtcFgHG2ZqRSivdhKxil9J0g", # ackrite#playa (EUW)
         "ru": "cufjZdqmFdZmyNwpdHwLdCp-YGMFdblBcA70SFUeAdFNmQr0uSnSlT-R_3dbU7YCnxguwEy1vXFw8Q", # saltychocoballs#RU1 (RU)
         "tr1": "XCvU69YoNCi94GiJmu8BEu0AcXD_DnbMhmf22clp6_GRh7F35GbV4JTpq80v_JMFIGJeH8DnKoMVfQ", # Deodat Lawson#3169 (TR)
         "jp1": "MsTgMxS5de1p_z1q7dVaZO6zqjRlPKi6XTYIc3O2xE_hCAHAFm-CaIootbowwYYuTwAfCgmOA9iqdw", # まいこーわらびど#aMike (JP)
         "kr": "ADjeaicFzeuJVDSW4Kukl2Z98LH89mPKfTEwVw2FOeyHZ0Mv-TRo7MSVEMO41WZq7B1SWA4E9pLi_Q", # Endall#5555 (KR)
      }

      self.puuid_collection = puuid_collection
      self.match_collection = match_collection
      
      self.seed(region, patch)
      print(f"Fin seeding {self.seed_user[region]}.")
      
   def seed(self, region, patch):
      puuid_bin = []
      match_bin = []
      matchlist = util.get_summoner_matches_on_patch(self.seed_user[region], region, patch)

      print(f"Seeding {self.seed_user[region]}.")
      for match_id in matchlist:
         match = util.get_match(match_id, region)
         game_patch = '.'.join(match['info']['gameVersion'].split('.')[0:2])

         # ...404 match or ...dead match/remake. Remakes are < 210, but setting to 300 as an arbitrary cutoff for "pointless" games. (5 minute length)
         if match == 404 or  match['info']['gameDuration'] < 210: continue

         # ...old patch
         if patch != game_patch: break

         match_region = match['metadata']['matchId'].split('_')[0]
         skill_level_bin = []
         item_bin = []
         match_timeline = util.get_match_timeline(match_id, region)
         
         for frame in match_timeline["info"]["frames"]:
            for event in frame["events"]:
               if event["type"] == "SKILL_LEVEL_UP" and event["levelUpType"] == "NORMAL":
                  skill_level_bin.append(event)
               if event["type"] == "ITEM_PURCHASED" or event["type"] == "ITEM_SOLD" or event["type"] == "ITEM_UNDO":
                  item_bin.append(event)

         timeline_bin = [skill_level_bin, item_bin]

         [puuid_bin.append({ '_id': puuid }) for puuid in match['metadata']['participants']]

         match_bin.append({
            '_id': match['metadata']['matchId'],
            'region': match_region,
            'metadata': match['metadata'],
            'info': match['info'],
            'timeline': timeline_bin
         })

      try:
         self.puuid_collection.insert_many(puuid_bin, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0: raise Exception(f'Non-11000 errors in insertmany operation for TEST{region}_puuids:', e.details['writeErrors'][0]['errmsg'])

      try:
         self.match_collection.insert_many(match_bin, ordered=False)
      except pymongo.errors.BulkWriteError as e:
         errors = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
         if len(errors) > 0: raise Exception(f'Non-11000 errors in insertmany operation for TEST{patch}_matches')