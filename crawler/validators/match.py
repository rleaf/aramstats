match_schema = {
      "$jsonSchema": {
         "bsonType": "object",
         "required": ["metadata", "info"],
         "properties": {
            "metadata": {
               "bsonType": "object",
               "description": "metadata field of match response"
            },
            "info": {
               "bsonType": "object",
               "description": "info field of match response"
            }
            
         }
      }
   }