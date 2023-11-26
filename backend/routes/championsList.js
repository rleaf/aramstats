const express = require('express')
const mongodb = require('mongodb')

const router = express.Router()

router.get('/', async (req, res) => {
   const coll = await loadChampionStatsCollection()
   // CPU spikes to ~20% usage when doing this aggregation in playground ?.
   // const pancakes = await coll.aggregate([
   //    {
   //       $group: {
   //          _id: null,
   //          name: { $first: "$name"},
   //          games: { $first: "$games" },
   //          wins: { $first: "$wins" },
   //       }
   //    }
   // ]).toArray()

   // Easier find operation using projection
   const pancakes = await coll.find({}, {projection: { _id: 0, id: 1, name: 1, games: 1, wins: 1 }}).toArray()
   res.send(pancakes)
})

async function loadChampionStatsCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   const dbPatch = (await client.db('aramstats').collection('meta').findOne( {'name': 'championstats'})).patch
   return client.db('aramstats').collection(`${dbPatch}_championstats`)
}

module.exports = router