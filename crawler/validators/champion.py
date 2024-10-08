champion_schema = {
      "$jsonSchema": {
         "bsonType": "object",
         "required": ["games", "wins", "rank", "pickRate", "skills", "runes", "starting", "spells", "items"],
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
            "rank": {
               "bsonType": "int",
               "description": "champion rank measured by winrate"
            },
            "pickRate": {
               "bsonType": "double",
               "description": "champion pickrate measured by total observed games"
            },
            "skills": {
               "bsonType": "object",
               "description": "skills dict",
            },
            "runes": {
               "bsonType": "object",
               "description": "runes dict",
            },
            "starting": {
               "bsonType": "object",
               "description": "startingItems dict",
            },
            "coreBuild": {
               "bsonType": "object",
               "description": "coreBuild dict",
            },
            "spells": {
               "bsonType": "object",
               "description": "spells dict",
            },
            "items": {
               "bsonType": "object",
               "description": "items dict",
            },
            "raw": {
               "bsonType": "object",
               "description": "raw data to be preproessed on championparse",
            },
            "metrics": {
               "bsonType": "object",
               "description": "Rolling per minute statistics computed using sum of squares. Welford method not playing nice with multiprocessing.",
               "properties": {
                  "dpm": {
                     "bsonType": "object",
                     "properties": {
                        "x": { "bsonType": "long" },
                        "xx": { "bsonType": "long" },
                     }
                  },
                  "dtpm": {
                     "bsonType": "object",
                     "properties": {
                        "x": { "bsonType": "long" },
                        "xx": { "bsonType": "long" },
                     }
                  },
                  "dmpm": {
                     "bsonType": "object",
                     "properties": {
                        "x": { "bsonType": "long" },
                        "xx": { "bsonType": "long" },
                     }
                  },
                  "gpm": {
                     "bsonType": "object",
                     "properties": {
                        "x": { "bsonType": "long" },
                        "xx": { "bsonType": "long" },
                     }
                  }
               }
            }
         }
      }
   }