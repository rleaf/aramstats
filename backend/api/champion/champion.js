// const mongodb = require('mongodb')

class Champion {

   async loadChampionStatsCollection(db, patch) {
      const list = await db.listCollections().toArray()
      if (list.some(c => c.name === `${patch}_championstats`)) return db.collection(`${patch}_championstats`)

      const dbPatch = (await db.collection('meta').findOne({ '_id': 'crawler' })).patch
      const livePatch = (await db.collection(`${dbPatch[0]}_championstats`).findOne({}, { projection: { _id: 1 } })) ? dbPatch[0] : dbPatch[1]
      
      return db.collection(`${livePatch}_championstats`)
   }

   async aggregateChampion(coll, champion) {
      return await coll.aggregate([
         { $match: { "_id": champion } },
         {
            $project: {
               patch: coll.collectionName.split('_')[0],
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