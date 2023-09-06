const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../twisted_calls')
const summonerModel = require('../models/summoner_model')
const cat = require('../cat')
const championNameBook = require('../constants/championNames')
const challengeIds = require('../constants/challengesIds')

dotenv.config()

const router = express.Router()

// Get summoner information from database or write summoner to db
router.get('/:region/:summonerURI', async (req, res) => {

   /*
      0. Check to see if summoner exists in Riot DB, if not return DNE
      1. Check to see if summoner document exists in summoner collection in Aramstats DB
      2. If summoner exists in Aramstats, return summoner document
      3. If summoner DNE in Aramstats DB, start init pull

      For 3, have two collections: summoner & matches???
   */

   let summoner

   // 0.
   try {
      console.log(`Searching for ${req.params.summonerURI} (${req.params.region})`)
      summoner = await twisted.getSummoner(req.params.summonerURI, req.params.region)
   } catch (e) {
      if (e.status === 429) {
         console.log(`Hit rate limit on getSummoner for ${req.params.summonerURI} (${req.params.region})`)
      }
      if (e.status === 404 || e.status === 403) {
         res.status(e.status).send(e.statusText)
         return
      }
   }

   if (summoner) {
      // 1.
      // const db = await loadDatabase()
      // const summonerDocument = await db.collection('summoners').findOne({ 'puuid': summoner.puuid })
      const summonerDocument = await summonerModel.findOne({ 'puuid': summoner.puuid })

      // 2.
      if (summonerDocument) {
         console.log(`Summoner ${summoner.name} (${req.params.region}) already parsed.`)
         res.send(summonerDocument)
         return
      }

      // 3.
      // Pull all matchIds
      let matchList = await twisted.getAllSummonerMatches(summoner.name, req.params.region)
      console.log(matchList[0], 'toad')
      // 3.1 Create archetype forsummoner document
      // 3.2 Pull all matchIds
      // 3.3 

      // Parse & scribe each match

      // Compute statistics

      // Create summoner document

   } else {
      // Summoner DNE
      res.sendStatus(504)
   }
})

// Update summoner
router.put('/update/:region/:summonerURI', async (req, res) => {

   /* 
      1. Get the lastMatchID field for summoner document & their match history from Riot.
      2. Find corresponding lastMatchID index and then begin updating summoner document from
         proceeding match data.
   */ 
})

// Delete summoner
router.delete('/delete/:region/:summonerURI', async (req, res) => {

   /* 
      1. db.<collection>.deleteOne( { correspondence } )
   */
})

async function loadDatabase() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   return client.db('aramstats')
}

async function getMatchlist(summoner, region) {
   return await twisted.getAllSummonerMatches(summoner.name, region)
}

module.exports = router