const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../../twisted_calls')
const { compileScript } = require('vue/compiler-sfc')


dotenv.config()

const router = express.Router()

router
   .route('/:region/:summonerURI')
   .get(async (req, res) => {
      const client = await loadSummonerCollection()

      // Check summoner existence.
      const summoner = await twisted.getSummoner(req.params.summonerURI, req.params.region)
         .catch((e) => {
            console.log('Summoner DNE')
            res.send('Summoner DNE')
            return
         })
      
      if (summoner) {
         
         const result = (await client.collection(summoner.name).find({}).toArray()).shift()

         // Check if summoner is in database
         if (result == undefined) {
            console.log('Summoner not in database, adding...')
            await summonerCheckInitialMatchPullv2(client, summoner, req.params.region)
         }

         // UTIL 
         // await client.collection('fri').deleteMany()

         // Parse matches
         await matchParserV2(client, summoner, req.params.region)



         // Yeet data
         // res.send(summoner) 
         // res.send(await client.find({ name: summoner.name}).toArray()) 
         res.send(result) 
      }


   })

async function loadSummonerCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   // return client.db('users').collection('summoner')
   return client.db('summoners')
}

async function summonerCheckInitialMatchPullv2(client, summoner, region) {
   // Add new summoner to database
   await client.collection(summoner.name).insertOne(summoner)
   await client.collection(summoner.name).updateOne({'name': summoner.name}, {$set : {'parsedIndex': 0}})
   
   // Pull all games
   const matchList = await twisted.getAllSummonerMatches(summoner.name, region)
   await client.collection(summoner.name).updateOne({'name': summoner.name}, {$set : {'matchId': matchList}})
   console.log(`Added ${summoner.name} to database.`)
}

async function matchParserV2(client, summoner, region) {
   const result = (await client.collection(summoner.name).find({}).toArray()).shift()
   // Check if there are already parsed matches

   let parsedIndex = result.parsedIndex
   const matchLength = result.matchId.length
   
   // Check if existing match containers
   // const huh = (await client.collection(summoner.name).find().sort({ matchEnd: -1 }).limit(1).toArray()).shift()
   const huh = (await client.collection(summoner.name).findOne({ matchEnd: {$exists: true}}))
   let matchContainer

   if (huh == undefined) {
      // Summoner has no recorded parsed matches.
      console.log(`No existing parsed matches`)
      await client.collection(summoner.name).insertOne({matchStart: 0, matchEnd: 25, matches: []})
      // matchContainer = (await client.collection(summoner.name).findOne({matchStart: 0})).matches
      matchContainer = 25

   } else {
      // Summoner has existing parsed matches.
      console.log(`Has existing parsed matches`)
      matchContainer = (await client.collection(summoner.name).find().sort({ matchEnd: -1 }).limit(1).toArray()).shift().matchEnd
   }

   // Set to +2 for dev
   console.log(`Starting parse at ${parsedIndex}`)
   for ( ; parsedIndex < matchLength; parsedIndex++) {
      console.log(`carrot cake ${parsedIndex}`)
      const match = await twisted.getMatchInfo(result.matchId[parsedIndex], region)
         .catch((e) => {
            console.log(e)
         })
      // console.log(matchContainer)
      
      if (parsedIndex != 0 && parsedIndex % 25 == 0) {
         matchContainer = await addMatchContainer(client, summoner, parsedIndex, parsedIndex+25)
      }
      
      if (parsedIndex == matchLength) {
         await client.collection(summoner.name).updateOne({name: summoner.name}, {$set: {'parsedIndex': parsedIndex}})
      }
      await client.collection(summoner.name).updateOne({'matchEnd': matchContainer}, {$push: {'matches': match}})
   }
}

async function addMatchContainer(client, summoner, start, end) {
   await client.collection(summoner.name).insertOne({matchStart: start, matchEnd: end, matches: []})
   return (await client.collection(summoner.name).find().sort({ matchEnd: -1 }).limit(1).toArray()).shift().matchEnd
}

async function matchParser(client, summoner, region) {
   const result = await client.findOne({ puuid: summoner.puuid })
   let parsedIndex

   // Check if there are already parsed matches
   // Check if 'matchInfo' field exists.
   if (result['matchInfo']) {
      console.log('matchinfo Exists')
      parsedIndex = result['matchInfo'].length
   } else {
      // If doesn't exist, create one
      console.log(`'matchInfo' DNE. Creating...`)
      await client.updateOne({ puuid: summoner.puuid }, {$set: {'matchInfo': []}})
      parsedIndex = 0
   }


   // Set to 5 for dev
   console.log(`Starting parse at ${parsedIndex}`)
   for (let i = parsedIndex; i < result.matchId.length; i++) {
      console.log(`carrot cake ${i}`)
      const match = await twisted.getMatchInfo(result.matchId[i], region)
         .catch((e) => {
            console.log(e)
            // if {e.status == 429} {
            //    console.log('rate limit error')
            // }
         })
      await client.updateOne({'name': summoner.name}, {$push : {'matchInfo': match}})
      // matchStats.push(match)
   }
}

// async function summonerCheckInitialMatchPull(client, summoner, region) {
//       const result = await client.findOne({ puuid: summoner.puuid })

//       if (result) {
//          return
//       } else {
//          // Add new summoner to database.
//          client.insertOne(summoner)
         
//          // Pull all games
//          const matchList = await twisted.getAllSummonerMatches(summoner.name, region)
//          await client.updateOne({'name': summoner.name}, {$set : {'matchId': matchList}})
//          console.log(`Added ${summoner.name} to database.`)

//       }
// }



// Utility
async function deleteSummoner(client, summoner) {
   await client.deleteMany({ name: summoner })
   console.log(`Deleted ${summoner.name}`);
}

module.exports = router