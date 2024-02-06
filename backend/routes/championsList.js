const express = require('express')
const mongodb = require('mongodb')

const router = express.Router()

router.get('/', async (req, res) => {
   const coll = await loadChampionStatsCollection()
   const pancakes = await coll.find({}, {projection: { _id: 1, games: 1, wins: 1, pickRate: 1 }}).toArray()
   res.send(pancakes)
})

async function loadChampionStatsCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   const dbPatch = (await client.db('aramstats').collection('meta').findOne( {'_id': 'crawler'})).patch
   const collectionSize = await client.db('aramstats').collection(`${dbPatch[1]}_championstats`).countDocuments()
   const livePatch = (collectionSize) ? dbPatch[1] : dbPatch[0]
   // let livePatch
   // if (collectionSize) {
   //    livePatch = dbPatch[1]
   // } else {
   //    livePatch = dbPatch[0]
   // }

   // const dbPatch = '14.2'
   return client.db('aramstats').collection(`${livePatch}_championstats`)
}

module.exports = router