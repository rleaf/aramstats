const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../../twisted_calls')
const cat = require('../../cat')

// const queue = require('express-queue')
// const queueMw = queue({ activeLimit: 1, queuedLimit: -1})
dotenv.config()

const router = express.Router()
// router.use(queueMw)


router
   .route('/:region/:summonerURI')
   .get(async (req, res) => {

      // console.log(`router: ${req.app.queueMw}`)
      // console.log(`queueLength: ${queueMw.queue.getLength()}`)

      // Check summoner existence.
      const summoner = await twisted.getSummoner(req.params.summonerURI, req.params.region)
         .catch((e) => {
            // console.log('Summoner DNE', e.status)
            res.status(404).send('Summoner DNE')
            return
         })

      const client = await loadSummonerCollection()

      
      // Check if summoner is in database
      if (summoner) {
         
         const summonerCollection = client.collection(summoner.name)
         
         // Check if already pulling
         check = await summonerCollection.findOne(
            {'activePull': {$exists: true}}
         )
   
         if(check && check.activePull == true) {
            console.log('already pulling')
            res.send('pulling')
            return 
         }

         parsedIdxExist = await summonerCollection.findOne(
               {'parsedIndex': {$exists: true}}
            )

         if(parsedIdxExist) {
            console.log(`Summoner ${summoner.name} already initially parsed`)

            result = (await client.collection(summoner.name).find({}).toArray())
            res.send(result)

            return
         } 

         // Create summoner collection and pull all matchIds
         await summonerCheckInitialMatchPullv2(client, summoner, req.params.region)
                  
         // Parse & scribe individual matches
         await matchParserV2(client, summoner, req.params.region)

         // Add total matches per champ
         const allChamps = await summonerCollection.find(
            {'championName': {$exists: true}}
         ).toArray()

         // Parse average stats of all games
         allChamps.forEach(async x => {

            let avg = cat.averages(x.matches).flat()

            // Pushing data
            await client.collection(summoner.name).updateOne(
               {'championName': x.championName},
               {$set: {
                  'totalGames': avg[0],
                  'wins': avg[1],
                  'averageTotalDamageDealt': avg[2],
                  'averageDamagePerMinute': avg[3],
                  'averageHealingOnTeammates': avg[4],
                  'averageTotalDamageTaken': avg[5],
                  'averageKDA': `${avg[6]}/${avg[7]}/${avg[8]}`,
                  'averageGoldEarned': avg[9],
                  'totalTripleKills': avg[10],
                  'totalQuadraKills': avg[11],
                  'totalPentaKills': avg[12],
                  }
               }
            )
         })

         console.log(`Finished parsing ${summoner.name}`)
         // Yeet data
         result = (await client.collection(summoner.name).find({}).toArray())
         res.send(result)
      }
   })


router.get('/update/:region/:summonerURI', async (req, res) => {
   
   const summoner = await twisted.getSummoner(req.params.summonerURI, req.params.region)
   .catch((e) => {
      console.log('Summoner DNE', e.status)
      res.send('Summoner DNE')
      return
   })
   
   const client = await loadSummonerCollection()

   check = await client.collection(summoner.name).findOne(
      {'activePull': {$exists: true}}
   )

   if(check && check.activePull == true) {
      console.log('Already updating summoner')
      res.send('Already updating')
      return 
   }

   await client.collection(summoner.name).updateOne(
      {'name': summoner.name},
      {$set: {'activePull' : true}}
   )

   /* Update summoner profile
         - Refresh matchId pull
         - Get current parsed Index
         - Iterate over matchId pull with parsed Index
   */
   await matchIdPull(client, summoner, req.params.region)
   const summonerDB = client.collection(summoner.name).findOne(
      {'name': summoner.name}
   )
   
   let parsedIndex = (await summonerDB).parsedIndex
   let matches = (await summonerDB).matchId.reverse()

   for ( ; parsedIndex < matches.length; parsedIndex++) {

      console.log(`Parsing match: ${parsedIndex}`)

      const game = await twisted.getMatchInfo(matches[parsedIndex], req.params.region)
         .catch(async (e) => {
            console.log(`Got rate limit check (${e.status}), recycling same game`)
            parsedIndex--
         })
      
      if (game) {
         const champions = cat.scribe(summoner.puuid, game)

         if (champions) {
            await createChampionDocument(client, summoner, champions.championName)
            await client.collection(summoner.name).updateOne(
               {'championName': champions.championName},
               {$push: {'matches': {$each: [champions], $position: 0}}}
            )
         }
      }
   }
   
   await client.collection(summoner.name).updateOne(
      {'name': summoner.name},
      {$set: {'parsedIndex': matches.length}}
   )

   await client.collection(summoner.name).updateOne(
      {'name': summoner.name},
      {$set: {'activePull' : false}}
   )

   console.log(`Finished updating ${summoner.name}`)
   result = (await client.collection(summoner.name).find({}).toArray())
   res.send(result)
})

async function loadSummonerCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   return client.db('summoners')
}

// async function totalGames(client, summoner, x) {
//    x.forEach(y => {
//       client.collection(summoner.name).insertOne({ totalGames: x.matches.length })
//    });
// }

async function summonerCheckInitialMatchPullv2(client, summoner, region) {

   // parsedIdxExist = await client.collection(summoner.name).findOne(
   //    {'parsedIndex': {$exists: true}}
   // )

   // if (parsedIdxExist) {
   //    return
   // }
   const summonerCollection = client.collection(summoner.name)
   // Add new summoner to database
   await summonerCollection.insertOne(summoner)

   // Live update flag
   await summonerCollection.updateOne(
      {'name': summoner.name},
      {$set: {'activePull': true}}
   )

   // Pull all games
   await matchIdPull(client, summoner, region)

   // Finalize summoner creation, add parsedIndex
   await summonerCollection.updateOne(
      {'name': summoner.name},
      {$set : {'parsedIndex': 0}}
   )
   
   console.log(`Added ${summoner.name} to database.`)
}

async function matchIdPull(client, summoner, region) {
   const matchList = await twisted.getAllSummonerMatches(summoner.name, region)
      .catch((e) => {
         console.log('matchIdPull Error', e) 
      })

   await client.collection(summoner.name).updateOne(
      {'name': summoner.name},
      {$set : {'matchId': matchList}}
   )
}

async function matchParserV2(client, summoner, region) {
   /*
   Initial parse through summoner matches
   */

   const result = (await client.collection(summoner.name).find({}).toArray()).shift()
   let matches = result.matchId.reverse()

   await client.collection(summoner.name).updateOne(
      {'name': summoner.name},
      {$set: {'parsedIndex': matches.length}}
   )

   for (let i = 0 ; i < matches.length; i++) {
      
      console.log(`Parsing match: ${i}`)

      const game = await twisted.getMatchInfo(matches[i], region)
         .catch(async (e) => {
            if (e.status == 429) {
               console.log(`Got rate limit check (${e.status}), recycling same game.`,)
               i--
            }
         })
      
      if (game) {
         const champions = cat.scribe(summoner.puuid, game)

         if (champions) {
            await createChampionDocument(client, summoner, champions.championName)
            await client.collection(summoner.name).updateOne(
               {'championName': champions.championName},
               {$push: {'matches': {$each: [champions], $position: 0}}}
            )
         }
      }
   }

   console.log(`Finished initial match parse`)

   await client.collection(summoner.name).updateOne(
      {'name': summoner.name},
      {$set: {'activePull' : false}}
   )
}

async function removeParse(client, summoner, matchEndIndex) {
   const toad2 = (await client.collection(summoner.name).find({'matchEnd': matchEndIndex})).toArray()
   console.log('toad', await toad2)

   await client.collection(summoner.name).updateOne({'matchEnd': matchEndIndex}, {$pop: {matches: 1}})

   const toad = (await client.collection(summoner.name).find({'matchEnd': matchEndIndex})).toArray()
   console.log('toad', await toad)
   console.log(`Got rate limit check, reducing parsedIndex by 1`)
}

async function createChampionDocument(client, summoner, champion) {
   const food = await client.collection(summoner.name).findOne({ championName: champion})

   if (food == undefined) {

      const championNameBook = {
         'AurelionSol' : 'Aurelion Sol',
         'Belveth' : "Bel'Veth",
         'Chogath' : "Cho'Gath",
         'DrMundo' : 'Dr. Mundo',
         'FiddleSticks' : 'Fiddlesticks',
         'JarvanIV' : 'Jarvan IV',
         "KSante" : "K'Sante",
         "Kaisa" : "Kai'Sa",
         'Khazix' : "Kha'Zix",
         'KogMaw' : "Kog'Maw",
         'Leblanc' : 'LeBlanc',
         'LeeSin' : 'Lee Sin',
         'MasterYi' : 'Master Yi',
         'MissFortune' : 'Miss Fortune',
         'MonkeyKing' : 'Wukong',
         'Nunu' : 'Nunu & Willump',
         'RekSai' : "Rek'Sai",
         'Renata' : 'Renata Glasc',
         'TahmKench' : 'Tahm Kench',
         'TwistedFate' : 'Twisted Fate',
         'Velkoz' : "Vel'Koz",
         'XinZhao' : 'Xin Zhao'
      }
      
      await client.collection(summoner.name).insertOne(
         { 
            championName: champion,
            trueChampionName: championNameBook[champion],
            totalGames: 0,
            wins: 0,
            averageTotalDamageDealt: 0,
            averageDamagePerMinute: 0,
            averageHealingOnTeammates: 0,
            averageTotalDamageTaken: 0,
            averageKDA: '',
            averageGoldEarned: 0,
            totalTripleKills: 0,
            totalQuadraKills: 0,
            totalPentaKills: 0,
            matches: []
         }
      )
   } 
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