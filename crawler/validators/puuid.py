puuid_schema = {
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