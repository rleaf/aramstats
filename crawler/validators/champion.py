champion_schema = {
      "$jsonSchema": {
         "bsonType": "object",
         "required": ["games", "wins", "skills", "builds", "items"],
         "properties": {
            "_id": {
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
            "coreBuild": {
               "bsonType": "object",
               "description": "coreBuild dict",
            },
            "startingItems": {
               "bsonType": "object",
               "description": "startingItems dict",
            },
            "items": {
               "bsonType": "object",
               "description": "items dict",
            },
            "primaryRunes": {
               "bsonType": "object",
               "description": "primaryRunes dict",
            },
            "secondaryRunes": {
               "bsonType": "object",
               "description": "secondaryRunes dict",
            },
            "flexRunes": {
               "bsonType": "object",
               "description": "flexRunes dict",
            },
         }
      }
   }