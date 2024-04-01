const mongodb = require('mongodb')

class Champion {

   async loadChampionStatsCollection() {
      const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
      const dbPatch = (await client.db('aramstats').collection('meta').findOne({ '_id': 'crawler' })).patch
      let livePatch
      if (await client.db('aramstats').collection(`${dbPatch[0]}_championstats`).findOne({}, { projection: { _id: 1 } })) {
         livePatch = dbPatch[0]
      } else {
         livePatch = dbPatch[1]
      }

      return client.db('aramstats').collection(`${livePatch}_championstats`)
   }

   async aggregateChampion(coll, champion) {
      return await coll.aggregate([
         { $match: { "_id": champion } },
         {
            $project: {
               core: {
                  $arrayToObject: { $slice: [{ $sortArray: { input: { $objectToArray: "$core" }, sortBy: { "v.games": -1 } } }, 10] }
               },
               starting: {
                  $slice: [{ $sortArray: { input: { $objectToArray: "$starting" }, sortBy: { "v.games": -1 } } }, 10]
               },
               spells: {
                  $slice: [{ $sortArray: { input: { $objectToArray: "$spells" }, sortBy: { "v.games": -1 } } }, 10]
               },
               skills: {
                  $sortArray: { input: { $objectToArray: "$skills" }, sortBy: { "v.games": -1 } }
               },
               games: 1,
               wins: 1,
               runes: 1,
               pickRate: 1,
               rank: 1,
               items: 1,
            }
         }
      ]).toArray()
   }
}

module.exports = new Champion()