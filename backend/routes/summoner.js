const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../twisted_calls')
const summonerModel = require('../models/summoner_model')
const summonerMatchesModel = require('../models/summonerMatches_model')
const puuidModel = require('../models/puuid_model')
const challengeIds = require('../constants/challengesIds')

dotenv.config()

const router = express.Router()

// Get summoner information from database or write summoner to db
router.get('/:region/:gameName/:tagLine', async (req, res) => {

   /*
      0. Check to see if summoner exists in Riot DB, if not return DNE
      1. Check to see if summoner document exists in summoner collection in Aramstats DB
      2. If summoner exists in Aramstats, return summoner document
      3. If summoner DNE in Aramstats DB, init pull

      (Dec 5, 2023)
      CURRENTLY: 
         0. Create summoner document & fill with summoner stuff.
         1. Get total matchlist. For match in matchlist, write as document to summonermatches collection. Use _id as a pointer and store in corresponding championsData matches array.
         2. Once fin step 1, for match in champion.matches for champion in championData for summoner, compute champion averages by querying the db for all match documents. Once averaging finishes, save document.
         3. Once finish step 1 and 2, aggregate all summoner data using riot.puuid and send that to front.
         + More efficient for frequent requests.
         - Uglier to look at.
         - Requires more CRUD operations to the database.
      
      BETTER?:
         0. Create summoner document & fill with summoner stuff.
         1. Get total matchlist. For match in matchlist, write as document to summonermatches collection. Use _id as a pointer and store in corresponding championsData matches array.
         2. Aggregate summoner data using riot.puuid. For match in champion.matches for champion in championData for summoner, lookup ($lookup) match document with _id and compute averages of all interested fields, as done in step 2 in CURRENTLY. Will have to use some fun aggregation pipeline with lookups, match, unwind, group, project, etc...

         + This is...simpler code-wise? Simplifies backend logic to a create -> store -> aggregate -> send VERSUS the other's create -> store -> get -> mutate -> store -> aggregate -> send (or something like that).
         - This aggregation is computationally waaaaay more expensive and is fired upon every request.
   */

   let riotId

   // 0.
   try {
      console.log(`Searching for ${req.params.gameName}#${req.params.tagLine} (${req.params.region})`)
      riotId = await twisted.getAccount(req.params.gameName, req.params.tagLine)
      summoner = await twisted.getSummoner(riotId.puuid, req.params.region)
   } catch (e) {
      if (e.status === 429) {
         console.log(`Hit rate limit on getSummoner for ${req.params.summonerURI} (${req.params.region})`)
      }
      if (e.status === 404 || e.status === 403) {
         console.log(`${req.params.gameName}#${req.params.tagLine} (${req.params.region}) DNE`)
         res.status(e.status).send(e.statusText)
         return
      }
   }

   if (summoner) {
      // 1.
      const exists = await summonerModel.findOne({ '_id': riotId.puuid })

      // 2.
      if (exists) {
         if (exists.pull.active) {
            // console.log(`already pulling ${summoner.name} (${req.params.region})`)
            // res.send(exists.pull)
            res.send(exists.pull)
            return
         }

         const summonerResponse = await aggregateSummoner(riotId.puuid)
         console.log(`Summoner ${req.params.gameName}#${req.params.tagLine} (${req.params.region}) already parsed.`)
         res.send(summonerResponse[0])
         return
      }

      // 3.
      // 3.1 Pull all matchIds
      // Most recent game is at [0]
      const matchlist = (await twisted.getAllSummonerMatches(riotId.puuid, req.params.region))
      const challenges = await challengeScribe(riotId.puuid, req.params.region)
      
      // 3.2 Create summoner document
      const summonerDocument = new summonerModel({
         _id: riotId.puuid,
         gameName: riotId.gameName,
         tagLine: riotId.tagLine,
         // name: summoner.name,
         level: summoner.summonerLevel,
         region: req.params.region,
         profileIcon: summoner.profileIconId,
         pull: {
            active: true,
            current: 0,
            queue: matchlist.length,
            lastMatchId: matchlist[0]
         },
         challenges: challenges
      })

      if (matchlist.length === 0) {
         const summonerResponse = (await aggregateSummoner(riotId.puuid))[0]
         res.send(summonerResponse)
      }

      // 3.3 Parse every match, store what I want in matches collection. Once match document
      //     is created, push the _id to summoner.<champion>.matches
      await matchParser(riotId, req.params.region, matchlist, summonerDocument)

      // Iterate over champion matches & calc avgs
      await championParser(summonerDocument)

      summonerDocument.pull.active = false
      summonerDocument.pull.queue = 0
      await summonerDocument.save()

      const summonerResponse = (await aggregateSummoner(riotId.puuid))[0]

      
      res.send(summonerResponse)
      console.log(`${summoner.name} (${req.params.region}) finished.`)
   } else {
      // Summoner DNE
      res.sendStatus(504)
   }
})

// Update summoner
router.put('/update/:region/:gameName/:tagLine', async (req, res) => {
// router.put('/update/:region/:summonerURI', async (req, res) => {

   /* 
      1. Get the lastMatchID field for summoner document & their match history from Riot.
      2. Find corresponding lastMatchID index and then begin updating summoner document from
         proceeding match data.
   */ 
   let summoner
   let riotId

   try {
      riotId = await twisted.getAccount(req.params.gameName, req.params.tagLine)
      summoner = await twisted.getSummoner(riotId.puuid, req.params.region)
   } catch (e) {
      if (e.status === 429) {
         console.log(`Hit rate limit on getSummoner for ${req.params.summonerURI} (${req.params.region})`)
      }
      if (e.status === 404 || e.status === 403) {
         res.status(e.status).send(e.statusText)
         return
      }
   }
   console.log(`Updating ${riotId.gameName}#${riotId.tagLine} (${req.params.region}).`)
   
   // Get summoner data
   const summonerDocument = await summonerModel.findOne({ _id: riotId.puuid })

   // Update summoner properties
   const challenges = await challengeScribe(riotId.puuid, req.params.region)

   // summonerDocument.name = summoner.name
   summonerDocument.level = summoner.summonerLevel
   summonerDocument.profileIcon = summoner.profileIconId
   summonerDocument.challenges = challenges

   // Get total matchlist & find idx of last match
   const totalMatchlist = (await twisted.getAllSummonerMatches(riotId.puuid, req.params.region))
   const lastMatchIndex = totalMatchlist.findIndex(x => x === summonerDocument.pull.lastMatchId)

   /* 
      Reverse to make oldest games appear at top.
      1. matchlist = [newest, newer, old].reverse() # [old, newer, newest]
      2. championEmbed.matches.unshift(matchlist[i for i in matchlist]) # adds old first...then newer...then newest to beginning
   */
   const matchlist = totalMatchlist.slice(0, lastMatchIndex)

   // There are no matches in matchlist, therefore the summoner is UTD
   if (matchlist.length === 0) {
      console.log(`Summoner ${riotId.gameName}#${riotId.tagLine} (${req.params.region}) already utd`)
      const summonerResponse = (await aggregateSummoner(riotId.puuid))[0]
      res.send(summonerResponse)
      return
   }

   // Set pull flags
   summonerDocument.pull.active = true
   summonerDocument.pull.lastMatchId = totalMatchlist[0]
   await summonerDocument.save()
   
   let updatedChampions = []

   // Parse new matchlist & return updatedChampions, to filter for champion parsing
   await matchParser(riotId, req.params.region, matchlist, summonerDocument, updatedChampions)

   // Basically championParse(), but operates only on the champs in updatedChamps.
   for (const champion of summonerDocument.championData) {
      if (updatedChampions.includes(champion.name)) {
         Object.keys(champion.avg).forEach(v => champion.avg[v] = 0)
         Object.keys(champion.mk).forEach(v => champion.mk[v] = 0)
         champion.wins = 0

         const matches = await summonerMatchesModel.find( {"_id": { $in: champion.matches}} )
      
         champion.games = matches.length

         // Is it more efficient to aggregate average stats on res.send() versus writing & reading them to/from DB?
         for (const match of matches) {
            
            if (match.w) champion.wins++
            champion.avg.ahpm += Math.round(match.t.ah / match.gd)
            champion.avg.a += match.a
            champion.avg.dpm += Math.round(match.t.dtc / match.gd)
            champion.avg.ds += match.ds * 100
            champion.avg.dtpm += Math.round(match.t.dt / match.gd)
            champion.avg.d += match.d
            champion.avg.ge += match.t.g
            champion.avg.gpm += Math.round(match.t.g / match.gd)
            champion.avg.hpm += Math.round(match.t.h / match.gd)
            champion.avg.ah += match.t.ah
            champion.avg.kp += match.kp * 100
            champion.avg.k += match.k
            champion.avg.smpm += Math.round(match.t.sm / match.gd)
            champion.avg.tdd += match.t.dtc
            champion.avg.tdt += match.t.dt
            champion.avg.th += match.t.h
            champion.avg.tsm += match.t.sm
            champion.mk.t += match.mk.t
            champion.mk.q += match.mk.q
            champion.mk.p += match.mk.p
         }

         for (const [k, v] of Object.entries(champion.avg)) {
            champion.avg[k] = Math.round(v / matches.length)
         }

      }  
   }

   summonerDocument.pull.active = false
   await summonerDocument.save()

   const summonerResponse = (await aggregateSummoner(riotId.puuid))[0]
   
   res.send(summonerResponse)
   console.log(`Finished updating ${riotId.gameName}#${riotId.tagLine} (${req.params.region}).`)
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

async function championParser(summonerDocument, updateArr) {

   
   // Iterate over each champion sub document
   for (const champion of summonerDocument.championData) {

      if (updateArr && updateArr.includes(champion.name)) {
         // If champion already exists, zero their values
         Object.keys(champion.avg).forEach(v => champion.avg[v] = 0)
         Object.keys(champion.mk).forEach(v => champion.mk[v] = 0)
         champion.wins = 0
      }
      
      const matches = await summonerMatchesModel.find( {"_id": { $in: champion.matches}} )
      
      champion.games = matches.length

      for (const match of matches) {
         if (match.w) champion.wins++
         champion.avg.ahpm += Math.round(match.t.ah / match.gd)
         champion.avg.a += match.a
         champion.avg.dpm += Math.round(match.t.dtc / match.gd)
         champion.avg.ds += match.ds * 100
         champion.avg.dtpm += Math.round(match.t.dt / match.gd)
         champion.avg.d += match.d
         champion.avg.ge += match.t.g
         champion.avg.gpm += Math.round(match.t.g / match.gd)
         champion.avg.hpm += Math.round(match.t.h / match.gd)
         champion.avg.ah += match.t.ah
         champion.avg.kp += match.kp * 100
         champion.avg.k += match.k
         champion.avg.smpm += Math.round(match.t.sm / match.gd)
         champion.avg.tdd += match.t.dtc
         champion.avg.tdt += match.t.dt
         champion.avg.th += match.t.h
         champion.avg.tsm += match.t.sm
         champion.mk.t += match.mk.t
         champion.mk.q += match.mk.q
         champion.mk.p += match.mk.p
      }

      for (const [k, v] of Object.entries(champion.avg)) {
         champion.avg[k] = Math.round(v / matches.length)
      }
   }

   await summonerDocument.save()
}

async function matchParser(riotId, region, matchlist, summonerDocument, updateArr) {
   for (let i = 0; i < matchlist.length; i++) {
      if (i % 25 === 0) {
         console.log(`${riotId.gameName}#${riotId.tagLine} (${region}): match ${i}/${matchlist.length}`)
         summonerDocument.pull.current = i
         await summonerDocument.save()
      }

      // [:-1] to parse oldest games first
      const game = await twisted.getMatchInfo(matchlist[matchlist.length - i - 1], region)
         .catch(e => {
            if (e.status === 429) {
               console.log(`(${e.status}) @ matchParse. Recycling same game.`,)
               i--
            }
            if (e.status_code === 404) return
         })

      if (!game) continue

      const puuidIndex = game.metadata.participants.findIndex(x => x === riotId.puuid)
      const player = game.info.participants[puuidIndex]

      if (puuidIndex === -1 || !player) continue 

      if (updateArr) updateArr.push(player.championName)
      const match = new summonerMatchesModel({
         // peep schema for human-interpretable
         m: summonerDocument._id,
         mId: game.metadata.matchId,
         gc: game.info.gameCreation,
         gd: getGameDuration(game.info),
         gv: game.info.gameVersion,
         w: player.win,
         k: player.kills,
         d: player.deaths,
         a: player.assists,
         a: player.assists,
         kp: getKillParticipation(player, game.info.participants),
         ds: getDamageShare(player, game.info.participants),
         i: getItems(player),
         s1: player.summoner1Id,
         s1c: player.summoner1Casts,
         s2: player.summoner2Id,
         s2c: player.summoner2Casts,
         sc: [player.spell1Casts, player.spell2Casts, player.spell3Casts, player.spell4Casts],
         pr: player.perks.styles[0].selections[0].perk,
         sr: player.perks.styles[1].style,
         t: {
            dtc: player.totalDamageDealtToChampions,
            dt: player.totalDamageTaken,
            sm: player.damageSelfMitigated,
            h: player.totalHeal,
            ah: player.totalHealsOnTeammates,
            g: player.goldEarned
         },
         mk: {
            t: player.tripleKills,
            q: player.quadraKills,
            p: player.pentaKills,
         },
         tId: player.teamId,
         fba: player.firstBloodAssist,
         fbk: player.firstBloodKill,
         tk: player.turretKills,
         tl: player.turretsLost,
         p: {
            all: player.allInPings,
            assist: player.assistMePings,
            bait: player.baitPings,
            basic: player.basicPings,
            comm: player.commandPings,
            danger: player.dangerPings,
            enMiss: player.enemyMissingPings,
            enVis: player.enemyVisionPings,
            back: player.getBackPings,
            hold: player.holdPings,
            vis: player.needVisionPings,
            omw: player.onMyWayPings,
            push: player.pushPings,
            visClr: player.visionClearedPings,
         }
      })

      let participantPuuids = []

      for (const participant of game.info.participants) {
         participantPuuids.push({
            updateOne: {
               filter: { _id: participant.puuid },
               update: {
                  _id: participant.puuid,
                  gn: participant.riotIdGameName || participant.riotIdName,
                  tl: participant.riotIdTagline,
                  name: participant.summonerName
               },
               upsert: true
            }
         })

         if (participant.puuid != player.puuid) {
            (player.teamId === participant.teamId) ? match.te.push(participant.puuid) : match.ee.push(participant.puuid)
         }
      }

      await puuidModel.bulkWrite(participantPuuids)
         .catch(e => {
            throw e
         })

      await match.save()
      const championEmbed = summonerDocument.championData.find(e => e.name === player.championName)
      if (championEmbed) {
         // Idealy use unshift > push becauase iterating from oldest -> newest and want newest at [0].
         // However doesn't matter because $lookup reoders in aggregation.
         championEmbed.matches.unshift(match._id)
      } else {
         summonerDocument.championData.push(
            {
               name: player.championName,
               championId: player.championId,
               matches: match._id
            }
         )
      }
   }
   
   if (updateArr) return updateArr
}

async function aggregateSummoner(puuid) {
   return await summonerModel.aggregate([
      { $match: { _id: puuid } },
      { $unwind: "$championData" },
      { $lookup: {
            from: "summoner_matches",
            localField: "championData.matches",
            foreignField: "_id",
            as: "championData.matches",
            pipeline: [ // For Encounters.vue
               {
                  $lookup: {
                     from: "summoner_puuids",
                     localField: "te",
                     foreignField: "_id",
                     as: "te",
                     pipeline: [
                        {
                           $project: {
                              _id: 0,
                           }
                        }
                     ]
                  }
               },
               {
                  $lookup: {
                     from: "summoner_puuids",
                     localField: "ee",
                     foreignField: "_id",
                     as: "ee",
                     pipeline: [
                        {
                           $project: {
                              _id: 0,
                           }
                        }
                     ]
                  }
               },
               {
                  $project: {
                     _id: 0,
                     __v: 0
                  }
               }
            ]
         }
      },
      // Lookup does not guarantee order https://stackoverflow.com/questions/67396937/array-is-reordered-when-using-lookup
      // {$sort: {
      //    "championData.gameCreation": 1 # something like this
      // }},
      { $group: {
         _id: "$_id",
         puuid: { $first: "$puuid"},
         level: { $first: "$level"},
         gameName: { $first: "$gameName"},
         tagLine: { $first: "$tagLine"},
         name: { $first: "$name"},
         region: { $first: "$region"},
         profileIcon: { $first: "$profileIcon"},
         pull: { $first: "$pull"},
         challenges: { $first: "$challenges"},
         championData: { $push: "$championData"}
      }},
      {
         $project: {
            _id: 0,
            puuid: 0,
         }
      }
   ])
}

async function challengeScribe(puuid, region) {
   const challengesDto = await twisted.playerChallenges(puuid, region)
   const challenges = challengesDto.challenges.filter(el => challengeIds.includes(el.challengeId))

   return challenges
}

function getGameDuration(info) {

   if (info.gameEndTimestamp) {
      // Seconds
      return Math.round(info.gameDuration / 60)
   } else {
      // Milliseconds
      return Math.round(info.gameDuration / 60000)
   }
}

function getItems(player) {
   let items = []

   for(let i = 0; i < 6; i++) {
      items.push(player[`item${i}`])
   }
   
   return items
}

function getDamageShare(player, participants) {
   let total = 0
   participants.forEach((participant) => {
      if (participant.teamId === player.teamId) {
         total += participant.totalDamageDealtToChampions
      }
   })

   let cowabunga = Math.round(player.totalDamageDealtToChampions / total * 100) / 100
   return cowabunga || 0
}

function getKillParticipation(player, participants) {
   let total = 0
   participants.forEach((participant) => {
      if (participant.teamId === player.teamId) {
         total += participant.kills
      }
   })
   let kp = Math.round((player.kills + player.assists) / total * 100) / 100
   return kp || 0
}

module.exports = router