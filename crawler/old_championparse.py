import os
import util
import validators as V
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

class ChampionParser():
   def __init__(self) -> None:
      db = MongoClient(os.environ['DB_CONNECTION_STRING'])['aramstats']
      collection_list = db.list_collection_names()
      patch = util.get_latest_patch()
      match_collection_name = f"{patch}_matches"
      self.champion_stats_name = "championstats"
      self.items = util.get_items()["data"]

      if match_collection_name in collection_list:
         self.match_collection = db[match_collection_name]
      if self.champion_stats_name in collection_list:
         self.champion_stats_collection = db[self.champion_stats_name]
      else:
         self.champion_stats_collection = db.create_collection(self.champion_stats_name, validator=V.champion_schema)
      if "meta" in collection_list:
         self.meta_document = db["meta"]
         self.index = self.meta_document.find_one({ "name": self.champion_stats_name })["index"]
      print("Starting champion parser")
      self.forward()
      self.meta_document.update_one({ "name": self.champion_stats_name}, { "$set": {"index": self.index} })
      print("Fin champion parser")

   def forward(self):
      """
      Iterate through matchdata and update champion documents for observed champions.
      """
      for match in self.match_collection.find(skip=self.index):
         print(match["metadata"]["matchId"], self.index)
         if self.index % 20 == 0 and self.index != 0:
            print('updating index')
            self.meta_document.update_one({ "name": self.champion_stats_name}, { "$set": {"index": self.index} })
         team_100 = []
         team_200 = []
         for participant in match["info"]["participants"]:
            if participant["teamId"] == 100:
               team_100.append(participant["championName"])
            else:
               team_200.append(participant["championName"])
               
         for participant in match["info"]["participants"]:
            """
            win <int>: whether champion won or loss
            name <str>: champion name
            path <str>: build path in dot notation
            level_path <str>: level path in dot notation
            starting_build <str>: starting build in dot notation
            friends <list>: list containing ally champions encountered
            enemies <list>: list containing ememy champion encountered

            CONSIDERATIONS
               1. Store friends & enemies as a summed multi-hot vector where each index
                  corresponds to the championId as opposed to a dict of championNames.
            """
            win = 1 if participant["win"] else 0
            name = 'wukong' if participant["championName"] == 'MonkeyKing' else participant["championName"].lower()
            # name = participant["championName"].lower()
            id = participant["championId"]
            path = [str(participant[f"item{x}"]) for x in range(6)]
            filtered_items = list(filter(lambda x: util.item_filter(x, self.items), path))
            path = 'builds.' + '.'.join([str(x) for x in filtered_items]) + '.meta'
            level_path = ''.join(str(x["skillSlot"]) for x in match["timeline"][0] if x["participantId"] == participant["participantId"])
            # starting_build = 'startingBuild.' + '.'.join(str(x["itemId"]) \
            #    for x in match["timeline"][1] if x["timestamp"] < 60000 and x["participantId"] == participant["participantId"] and x["type"] == "ITEM_PURCHASED") + '.meta'
            starting_build = []
            for x in match["timeline"][1]:
               if x["timestamp"] < 60000 and x["participantId"] == participant["participantId"]:
                  if x["type"] == "ITEM_PURCHASED":
                     starting_build.append(x["itemId"])
                  if x["type"] == "ITEM_UNDO":
                     if x["beforeId"] in starting_build: starting_build.remove(x["beforeId"])
            starting_build = 'startingBuild.' + '.'.join(str(x) for x in starting_build) + '.meta'         
            if starting_build == 'startingBuild..meta': starting_build = 'startingBuild.0000.meta'
            friends = list(filter(lambda x: x != participant["championName"], team_100 if participant["teamId"] == 100 else team_200))
            enemies = team_100 if participant["teamId"] != 100 else team_200

            if len(filtered_items) > 0:
               try:
                  self.champion_stats_collection.update_one(
                     {
                        "name": name,
                        "id": id
                     },
                     {
                        "$inc": {
                           "games": 1,
                           "wins": win,
                           f'{path}.games': 1,
                           f'{path}.wins': win,
                           f"{path}.levelPath.{level_path}": 1,
                           f"{path}.{starting_build}.games": 1,
                           f"{path}.{starting_build}.wins": win,
                           # Friendlies
                           f"{path}.friendlyEncounters.{friends[0]}": 1,
                           f"{path}.friendlyEncounters.{friends[1]}": 1,
                           f"{path}.friendlyEncounters.{friends[2]}": 1,
                           f"{path}.friendlyEncounters.{friends[3]}": 1,
                           # Enemies
                           f"{path}.enemyEncounters.{enemies[0]}": 1,
                           f"{path}.enemyEncounters.{enemies[1]}": 1,
                           f"{path}.enemyEncounters.{enemies[2]}": 1,
                           f"{path}.enemyEncounters.{enemies[3]}": 1,
                           f"{path}.enemyEncounters.{enemies[4]}": 1,
                        },
                     },
                     upsert = True
                  )
               except Exception as e:
                  print(e, 'pancakes')

         self.index+= 1

if __name__ == "__main__":
   champion_parse = ChampionParser()