const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../../twisted_calls')
const cat = require('../../cat')
const championNameBook = require('../../constants/championNames')
const challengeIds = require('../../constants/challengesIds')

dotenv.config()

const router = express.Router()

router
   .route('/:region/:summonerURI')
   .get(async (req, res) => {
      // Check summoner existence.
      console.log(`Searching for ${req.params.summonerURI} (${req.params.region})`)

      let summoner

      try {
         summoner = await twisted.getSummoner(req.params.summonerURI, req.params.region)
      } catch (e) {       
         if (e.status == 429) {
            console.log(`Hit rate limit on getSummoner for ${req.params.summonerURI} (${req.params.region})`)
         }
         if (e.status == 404 || e.status == 403) {
            res.status(e.status).send(e.statusText)
            return
         }
      }

      const client = await loadSummonerCollection()


      // start here
      console.log(await client.listCollections().toArray())
      
      // Check if summoner is in database
      if (summoner) {
         
         const summonerCollection = client.collection(summoner.name)
         
         // Check if already pulling
         check = await summonerCollection.findOne(
            {'activePull': {$exists: true}}
         )
   
         if(check && check.activePull) {
            console.log(`already pulling ${summoner.name}`)
            return
         }

         const summonerExist = (await summonerCollection.findOne({'name': summoner.name}))

         if(summonerExist) {
            console.log(`Summoner ${summoner.name} (${req.params.region}) already parsed.`)

            result = (await client.collection(summoner.name).find({}).toArray())
            res.send(result)

            return
         } 

         // Create summoner collection and pull all matchIds
         const matchlist = await populateSummoner(summonerCollection, summoner, req.params.region)
                  
         // Parse & scribe individual matches
         await matchParser(summonerCollection, matchlist, summoner, req.params.region)

         // Average all matches
         await championParser(summonerCollection)

         await challengeScribe(summoner, summonerCollection, req.params.region)


         console.log(`Finished parsing ${summoner.name} (${req.params.region})`)
         result = (await client.collection(summoner.name).find({}).toArray())
         res.send(result)

      } else {

         res.sendStatus(504)

         // Potentially have it to send data for pre-parsed summoners still
         // const dbSummonerCollection = client.collection(req.params.summonerURI)

         // if (dbSummonerCollection) {
         //    result = (await dbSummonerCollection.find({}).toArray())
         //    console.log(result)
         //    res.send(result)
         // } else {
         //    res.sendStatus(504)
         // }
      }
   })

async function challengeScribe(summoner, collection, region) {
   const challengesDto = await twisted.playerChallenges(summoner.puuid, region)
   const challenges = challengesDto.challenges.filter(el => challengeIds.includes(el.challengeId))
   
   collection.updateOne(
      {'name': summoner.name},
      {$set: {'challenges': challenges}},
      {upsert: true}
   )
}

async function championParser(collection) {

   const allChamps = await collection.find(
      {'championName': {$exists: true}}
   ).toArray()
   
   // Parse average stats of all games
   for (let i = 0; i < allChamps.length; i++) {
      let stats = cat.averages(allChamps[i].matches)

      // Pushing data
      await collection.updateOne(
         {'championName': allChamps[i].championName},
         {$set: {
            'totalGames': stats.totalGames,
            'wins': stats.wins,
            'averageTotalDamageDealt': stats.avg.dmgDealt,
            'averageDamagePerMinute': stats.avg.damagePerMinute,
            'averageTotalHeal': stats.avg.heal,
            'averageHealPerMinute': stats.avg.healPerMinute,
            'averageHealingOnTeammates': stats.avg.healingOnTeam,
            'averageAllyHealPerMinute': stats.avg.allyHealPerMinute,
            'averageTotalDamageTaken': stats.avg.tank,
            'averageDamageTakenPerMinute': stats.avg.damageTakenPerMinute,
            'averageTotalSelfMitigated': stats.avg.mitigated,
            'averageSelfMitigatedPerMinute': stats.avg.selfMitigatedPerMinute,
            'averageKills': stats.avg.kills,
            'averageDeaths': stats.avg.deaths,
            'averageAssists': stats.avg.assists,
            'averageKillParticipation': stats.avg.killParticipation,
            'averageDamageShare': stats.avg.damageShare,
            'averageGoldEarned': stats.avg.gold,
            'averageGoldPerMinute': stats.avg.goldPerMinute,
            'totalTripleKills': stats.tripleKills,
            'totalQuadraKills': stats.quadraKills,
            'totalPentaKills': stats.pentaKills,
            }
         },
      )   
   }
}

router.put('/update/:region/:summonerURI', async (req, res) => {
   
   const summoner = await twisted.getSummoner(req.params.summonerURI, req.params.region)
      // .catch((e) => {
      //    console.log(`Update error for ${req.params.summonerURI}`, e)
      //    return
      // })
   const client = await loadSummonerCollection()
   const summonerCollection = client.collection(summoner.name)

   check = await summonerCollection.findOne(
      {'activePull': {$exists: true}}
   )

   await challengeScribe(summoner, summonerCollection, req.params.region)

   if(check && check.activePull == true) {
      console.log(`Already updating ${summoner.name} (${req.params.region})`)
      res.send('Already updating')
      return 
   }

   await summonerCollection.updateOne(
      {'name': summoner.name},
      {$set: {'activePull' : true}}
   )

   /* Update summoner profile
         - Refresh matchId pull
         - Get current parsed Index
         - Iterate over matchId pull with parsed Index
   */
   const lastMatchId = (await summonerCollection.findOne({'name': summoner.name})).lastMatchID
   let matches

   try {
      matches = (await matchIdPull(summoner, req.params.region)).slice().reverse()
   } catch (e) {
      console.log(`(${e.status}) @ update. Repulling summoner matches.`)
      matches = (await matchIdPull(summoner, req.params.region)).slice().reverse()
   }

   
   if (lastMatchId == matches[matches.length - 1]) {
      console.log(`${summoner.name} (${req.params.region}) already updated.`)
   
      await summonerCollection.updateOne(
            {'name': summoner.name},
            {$set: {'activePull' : false}}
         )
      
      result = (await summonerCollection.find({}).toArray())
      res.send(result)
      return
   }

   const lastMatchIndex = matches.findIndex(x => x == lastMatchId) + 1

   for (let i = lastMatchIndex ; i < matches.length; i++) {

      console.log(`Updating ${summoner.name} (${req.params.region}), match ${matches[i]}`)

      const game = await twisted.getMatchInfo(matches[i], req.params.region)
         .catch(async (e) => {
            console.log(`Got rate limit check (${e.status}), recycling same game`)
            i--
         })
      
      if (game) {
         const champion = cat.scribe(summoner.puuid, game)

         if (champion) {
            await createChampionDocument(summonerCollection, champion.championName)
            await summonerCollection.updateOne(
               {'championName': champion.championName},
               {$push: {'matches': {$each: [champion], $position: 0}}}
            )
         }
      }
   }
   
   // Get new averages
   await championParser(summonerCollection)

   await summonerCollection.updateOne(
      {'name': summoner.name},
      {$set: {'lastMatchID': matches[matches.length - 1]}}
   )
   
   await summonerCollection.updateOne(
      {'name': summoner.name},
      {$set: {'activePull' : false}}
   )

   console.log(`Finished updating ${summoner.name} (${req.params.region})`)
   result = (await summonerCollection.find({}).toArray())
   res.send(result)
})


router.delete('/delete/:region/:summonerURI', async (req, res) => {
   const summoner = await twisted.getSummoner(req.params.summonerURI, req.params.region)
   const client = await loadSummonerCollection()
   
   client.collection(summoner.name).drop()
   console.log(`${summoner.name} (${req.params.region}) deleted`)
   res.sendStatus(200)
})


async function loadSummonerCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   return client.db('summoners')
}

async function populateSummoner(collection, summoner, region) {

   // Add new summoner to database
   await collection.insertOne(summoner)

   // Live update flag
   await collection.updateOne(
      {'name': summoner.name},
      {$set: {'activePull': true}}
   )

   // Pull all games into 'matchId'
   let matchlist

   try {
      matchlist = await matchIdPull(summoner, region)
   } catch (e) {
      console.log(`(${e.status}) @ initial pull. Repulling summoner matches.`)
      matchlist = await matchIdPull(summoner, region)
   }

   // let length = (await collection.findOne({'name': summoner.name})).matchId.length

   await collection.updateOne(
      {'name': summoner.name},
      {$set: {'lastMatchID': matchlist[0]}}
   )

   console.log(`Added ${summoner.name} (${region}) to database, [${matchlist.length} matches].`)
   return matchlist
}

async function matchIdPull(summoner, region) {

   let matchList = await twisted.getAllSummonerMatches(summoner.name, region)

   // collection.updateOne(
   //    {'name': summoner.name},
   //    {$set : {'matchId': matchList}}
   // )

   
   // if (length) {
   //    return new Promise(resolve => resolve(matchList))
   // }
   return new Promise(resolve => resolve(matchList))
}

async function matchParser(collection, matchlist, summoner, region) {
   /*
   Initial parse through summoner matches
   */

   let matches = matchlist.reverse()

   for (let i = 0; i < matches.length; i++) {
      
      if (i % 25 == 0) console.log(`Parsing ${summoner.name} (${region}), match ${i}`)

      const game = await twisted.getMatchInfo(matches[i], region)
         .catch((e) => {
            if (e.status == 429) {
               console.log(`(${e.status}) @ matchParse. Recycling same game.`,)
               i--
            }
         })
      
      if (game) {
         const match = cat.scribe(summoner.puuid, game)

         if (match) {
            await createChampionDocument(collection, match.championName)
            await collection.updateOne(
               {'championName': match.championName},
               {$push: {'matches': {$each: [match], $position: 0}}},
            )
         }
      }
   }

   await collection.updateOne(
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

async function createChampionDocument(collection, champion) {
   const food = await collection.findOne({ championName: champion})

   if (!food) {
      await collection.insertOne(
         { 
            championName: champion,
            trueChampionName: championNameBook[champion],
            // totalGames: 0,
            // wins: 0,
            // averageTotalDamageDealt: 0,
            // averageDamagePerMinute: 0,

            // averageTotalHeal: 0,
            // averageHealPerMinute: 0,

            // averageHealingOnTeammates: 0,
            // averageAllyHealPerMinute: 0,

            // averageTotalDamageTaken: 0,
            // averageDamageTakenPerMinute: 0,

            // averageTotalSelfMitigated: 0,
            // averageSelfMitigatedPerMinute: 0,

            // averageKDA: '',

            // averageKillParticipation: 0,
            // averageDamageShare: 0,

            // averageGoldEarned: 0,
            // averageGoldPerMinute: 0,
            // totalTripleKills: 0,
            // totalQuadraKills: 0,
            // totalPentaKills: 0,
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

// Utility
async function deleteSummoner(client, summoner) {
   await client.deleteMany({ name: summoner })
   console.log(`Deleted ${summoner.name}`);
}

module.exports = router