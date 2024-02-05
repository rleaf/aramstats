const express = require('express')
const mongodb = require('mongodb')
const idMap = require('../constants/idMap')

const router = express.Router()

router.get('/:champion', async (req, res) => {
   const coll = await loadChampionStatsCollection()
   // const pancakes = await coll.findOne({"_id": idMap[req.params.champion.toLowerCase()]}, {projection: { raw: 0 }})
   const pancakes = (await aggregateChampion(coll, idMap[req.params.champion.toLowerCase()]))[0]
   res.send(pancakes)
})

async function loadChampionStatsCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   const dbPatch = (await client.db('aramstats').collection('meta').findOne( {'_id': 'crawler'})).patch
   return client.db('aramstats').collection(`${dbPatch}_championstats`)
}

async function aggregateChampion(coll, champion) {
   return await coll.aggregate([
      { $match: {"_id": champion} },
      { $project: {
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
      } }
   ]).toArray()
}

module.exports = router