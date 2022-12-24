const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../../twisted_calls')


dotenv.config()

const router = express.Router()

router
   .route('/:region/:summonerURI')
   .get(async (req, res) => {

      // Check summoner existence.
      const summoner = await twisted.getSummoner(req.params.summonerURI, req.params.region)
         .catch((e) => {
            console.log('Summoner DNE', e)
            res.send('Summoner DNE')
            return
         })

      const client = await loadSummonerCollection()

         
      if (summoner) {   
         const result = (await client.collection(summoner.name).find({}).toArray()).shift()

         // Check if summoner is in database
         await summonerCheckInitialMatchPullv2(client, summoner, req.params.region)

         // UTIL 
         // await client.collection('fri').deleteMany()

         // Parse matches
         const hasMatchContainer = (await client.collection(summoner.name).findOne({matchContainer: {$exists: true}}))
         if (hasMatchContainer == null) {
            await matchParserV2(client, result, summoner, req.params.region)
         } else {
            console.log(`Account ${summoner.name} already parsed.`)
         }



         // Yeet data
         // res.send(summoner) 
         // res.send(await client.find({ name: summoner.name}).toArray()) 
         res.send(result)
      }


   })

async function loadSummonerCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   return client.db('summoners')
}

async function summonerCheckInitialMatchPullv2(client, summoner, region) {

   parsedIdxExist = await client.collection(summoner.name).findOne({'parsedIndex': {$exists: true}})

   if (parsedIdxExist) {
      return
   }
   
   // Add new summoner to database
   await client.collection(summoner.name).insertOne(summoner)

   // Pull all games
   await matchIdPull(client, summoner, region)

   // Finalize summoner creation, add parsedIndex
   await client.collection(summoner.name).updateOne({'name': summoner.name}, {$set : {'parsedIndex': 0}})
}

async function matchIdPull(client, summoner, region) {
   const matchList = await twisted.getAllSummonerMatches(summoner.name, region)
      .catch((e) => {
         console.log('matchList',)
      })
   
   await client.collection(summoner.name).updateOne({'name': summoner.name}, {$set : {'matchId': matchList}})
   console.log(`Added ${summoner.name} to database.`)

}

async function matchParserV2(client, result, summoner, region) {
   // const result = (await client.collection(summoner.name).find({}).toArray()).shift()

   if (result.matchId == undefined) {
      await matchIdPull(client, summoner, region)
   }
   let parsedIndex = result.parsedIndex
   const matchLength = result.matchId.length
   
   // Check if existing parses || init matchContainer
   let matchEndIndex = await parseCheck(client, summoner)
   
   
   console.log(`Starting parse at ${parsedIndex}`)
   while (parsedIndex <= matchLength) {
      
      // console.log(`Parsed ${parsedIndex + 1} matches`)
      console.log(`${parsedIndex}`)
      
      const match = await twisted.getMatchInfo(result.matchId[parsedIndex], region)
         .catch(async (e) => {
            console.log(e.status)
         })
      
      if (match) {
         await client.collection(summoner.name).updateOne({'matchEnd': matchEndIndex}, {$push: {'matches': match}})
         await client.collection(summoner.name).updateOne({'name': summoner.name}, {$set: {'parsedIndex': parsedIndex}})

         if (parsedIndex != 0 && parsedIndex % 25 == 0) {
            matchEndIndex = await addMatchContainer(client, summoner, parsedIndex, parsedIndex+25)
         }

         parsedIndex++
         
      } else {
         console.log(`Got rate limit check, recycling same game.`)
      }

      if (parsedIndex == matchLength) {
         console.log(`I am done :)`)
         break
      }

      
   }
}

async function removeParse(client, summoner, matchEndIndex) {
   const toad2 = (await client.collection(summoner.name).find({'matchEnd': matchEndIndex})).toArray()
   console.log('toad', await toad2)

   await client.collection(summoner.name).updateOne({'matchEnd': matchEndIndex}, {$pop: {matches: 1}})

   const toad = (await client.collection(summoner.name).find({'matchEnd': matchEndIndex})).toArray()
   console.log('toad', await toad)
   console.log(`Got rate limit check, reducing parsedIndex by 1`)
}

async function parseCheck(client, summoner) {

   const toad = (await client.collection(summoner.name).findOne({ matchEnd: {$exists: true}}))
   let matchContainer

   if (toad == undefined) {
      // Summoner has no recorded parsed matches.
      console.log(`No existing parsed matches`)
      return matchContainer = addMatchContainer(client, summoner, 0, 25)
   } else {
      // Summoner has existing parsed matches.
      console.log(`Has existing parsed matches`)
      return matchContainer = (await client.collection(summoner.name).find().sort({ matchEnd: -1 }).limit(1).toArray()).shift().matchEnd
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