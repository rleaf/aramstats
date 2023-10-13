""" 
{
   name: string,
   kills: int,  # kills, deaths, assists maybe ridiculous to store?
   deaths: int,
   assists: int,
   games: int,
   wins: int, # losses = games - wins
   builds: [
      # If I want to do buildpath, I will also have to use the timeline endpoint
   ]
}
 """

champion_schema = {
      "$jsonSchema": {
         "bsonType": "object",
         "required": ["puuid", "region"],
         "properties": {
            "puuid": {
               "bsonType": "string",
               "description": "a summoner's puuid"
            },
            "region": {
               "bsonType": "string",
               "description": "a puuid's region"
            }
         }
      }
   }