puuid_schema = {
      "$jsonSchema": {
         "bsonType": "object",
         "required": ["_id", "region"],
         "properties": {
            "_id": {
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