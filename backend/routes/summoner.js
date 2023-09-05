const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../twisted_calls')
const cat = require('../cat')
const championNameBook = require('../constants/championNames')
const challengeIds = require('../constants/challengesIds')

dotenv.config()

const router = express.Router()

// Get summoner information from database or write summoner to db
router.get('/:region/:summonerURI', async (req, res) => {

   /*
      1.  Check to see if summoner document exists in summoner collection in Aramstats DB
      2.  If summoner doesn't exist in summ collection, check to see if summoner exists in Riot DB
      *3.1 If summoneer exists in Riot DB, start initial pull of summoner
      3.2 If summoner doesn't exist in Riot DB, return DNE

      * For 3.1, have two collections: summoner & matches???
   */

   const db = loadDatabase()
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

module.exports = router