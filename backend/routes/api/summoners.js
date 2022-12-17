const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../../riot/twisted_calls')


dotenv.config()

const router = express.Router()

router
   .route('/:region/:summonerURI')
   .get(async (req, res) => {
      const client = await loadSummonerCollection()

      // Check summoner existance.
      const summoner = await twisted.getSummoner(req.params.summonerURI, req.params.region)
         .catch(() => {
            console.log('Summoner DNE')
            res.send('Summoner DNE')
            return
         })
      
      if (summoner) {
         // Check if summ is already in database & if summoner isn't, add to database
         // and do initial match pull.
         summonerCheckInitialMatchPull(client, summoner, req.params.region)
         
         // Get matches for summoner


         // Send back data
         res.send(await client.find({ name: summoner.name}).toArray())  
      }


   })

async function loadSummonerCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   return client.db('users').collection('summoner')
}

async function summonerCheckInitialMatchPull(client, summoner, region) {
      const result = await client.findOne({ puuid: summoner.puuid })

      if (result) {
         return
      } else {
         // Add new summoner to database.
         client.insertOne(summoner)
         console.log(`Added ${summoner.name} to database.`)

         // const matchList = await twisted.getSummonerMatches(summoner.name, region)
         // console.log(matchList)

         // **************************************************
         // Figure out a way to iteratively pull by 100 matches until end of API
         // let group
         // let idx = 0
         // const matchList = await twisted.getAllSummonerMatches(summoner.name, region, idx)
         // client.updateOne({'name': summoner.name}, {$set : {'matches': matchList}})
         // **************************************************

         // client.insertOne(matchList)
      }
}

// Utility
async function deleteSummoner(client, summoner) {
   await client.deleteMany({ name: summoner })
   console.log('deleted');
}

module.exports = router