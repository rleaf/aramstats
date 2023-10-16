champion_schema = {
      "$jsonSchema": {
         "bsonType": "object",
         "required": ["name", "games", "wins", "builds"],
         "properties": {
            "name": {
               "bsonType": "string",
               "description": "champion name"
            },
            "games": {
               "bsonType": "int",
               "description": "champion observations"
            },
            "wins": {
               "bsonType": "int",
               "description": "champion win observations"
            },
            "builds": {
               "bsonType": "object",
               "description": "nested objs storing build data"
            }
         }
      }
   }