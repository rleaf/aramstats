const express = require('express')
const mongodb = require('mongodb')

const router = express.Router()

router.get('/:champion', async (req, res) => {
   
   const coll = await loadChampionStatsCollection()
   const pancakes = await coll.findOne({"lowerName": req.params.champion.toLowerCase()})
   res.send(pancakes)
})

async function loadChampionStatsCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   const dbPatch = (await client.db('aramstats').collection('meta').findOne( {'name': 'championstats'})).patch
   return client.db('aramstats').collection(`${dbPatch}_championstats`)
}

module.exports = router