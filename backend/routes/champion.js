const express = require('express')
const mongodb = require('mongodb')
const idMap = require('../constants/idMap')

const router = express.Router()

router.get('/:champion', async (req, res) => {
   const coll = await loadChampionStatsCollection()
   const pancakes = await coll.findOne({"_id": idMap[req.params.champion.toLowerCase()]})
   res.send(pancakes)
})

async function loadChampionStatsCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   const dbPatch = (await client.db('aramstats').collection('meta').findOne( {'_id': 'crawler'})).patch
   return client.db('aramstats').collection(`${dbPatch}_championstats`)
   // return client.db('aramstats').collection(`13.24_championstats`)
}

module.exports = router