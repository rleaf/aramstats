champion_schema = {
      "$jsonSchema": {
         "bsonType": "object",
         "required": ["name", "id", "games", "wins", "skills", "runes", "builds", "items"],
         "properties": {
            "name": {
               "bsonType": "string",
               "description": "champion name"
            },
            "id": {
               "bsonType": "int"
            },
            "games": {
               "bsonType": "int",
               "description": "champion observations"
            },
            "wins": {
               "bsonType": "int",
               "description": "champion win observations"
            },
            "skills": {
               "bsonType": "object",
               "description": "skills dict",
            },
            "runes": {
               "bsonType": "object",
               "description": "runes dict",
            },
            "builds": {
               "bsonType": "object",
               "description": "builds dict",
            },
            "items": {
               "bsonType": "object",
               "description": "items dict",
            },
         }
      }
   }