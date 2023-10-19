match_schema = {
      "$jsonSchema": {
         "bsonType": "object",
         "required": ["metadata", "info", "timeline"],
         "properties": {
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