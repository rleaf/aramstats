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
         await summonerCheckInitialMatchPull(client, summoner, req.params.region)
         
         // Get matches for summoner

         // ***************************************
         // Parse matches
         for (let i = 0; i <= 2; i++) {
            let matchId = await client.findOne({ matches: {$indexOfArray: i} })
            console.log(matchId)
            const matchStats = await twisted.getMatchInfo(matchId, req.params.region)
            client.updateOne({'name': summoner.name}, {$set : {'matchInfo': matchStats}})
         }
         // ***************************************
         
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
         
         // Pull all games
         const matchList = await twisted.getAllSummonerMatches(summoner.name, region)
         client.updateOne({'name': summoner.name}, {$set : {'matches': matchList}})
         console.log(`Added ${summoner.name} to database.`)

      }
}

// Utility
async function deleteSummoner(client, summoner) {
   await client.deleteMany({ name: summoner })
   console.log(`Deleted ${summoner.name}`);
}

module.exports = router