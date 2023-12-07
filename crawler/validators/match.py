match_schema = {
      "$jsonSchema": {
         "bsonType": "object",
         "required": ["_id", "region", "metadata", "info", "timeline"],
         "properties": {
            "_id": {
               "bsonType": "string",
               "description": "matchid of match response"
            },
            "region": {
               "bsonType": "string",
               "description": "region of match response"
            },
            "metadata": {
               "bsonType": "object",
               "description": "metadata field of match response"
            },
            "info": {
               "bsonType": "object",
               "description": "info field of match response"
            },
            "timeline": {
               "bsonType": "array",
               "description": "array storing timeline data"
            }
            
         }
      }
   }