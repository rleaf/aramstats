const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../twisted_calls')
const summonerModel = require('../models/summoner_model')
const summonerMatchesModel = require('../models/summonerMatches_model')
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
      const exists = await summonerModel.findOne({ 'puuid': summoner.puuid })

      // 2.
      if (exists) {
         if (exists.pull.active) {
            console.log(`already pulling ${summoner.name} (${req.params.region})`)
            res.send(exists.pull)
            return
         }

         const summonerResponse = await aggregateSummoner(summoner.puuid)
         console.log(`Summoner ${summoner.name} (${req.params.region}) already parsed.`)
         res.send(summonerResponse[0])
         return
      }

      // 3.
      // 3.1 Pull all matchIds
      // Reverse so it starts processing the oldest game first - have most recent game should be at [0].
      const matchlist = (await twisted.getAllSummonerMatches(summoner.name, req.params.region)).reverse()
      const challenges = await challengeScribe(summoner.puuid, req.params.region)
      
      // 3.2 Create summoner document
      const summonerDocument = new summonerModel({
         puuid: summoner.puuid,
         name: summoner.name,
         region: req.params.region,
         profileIcon: summoner.profileIconId,
         pull: {
            active: true,
            current: 0,
            queue: matchlist.length,
            lastMatchId: matchlist[matchlist.length - 1]
         },
         challenges: challenges
      })
      // 3.3 Parse every match, store what I want in matches collection. Once match document
      //     is created, push the _id to summoner.<champion>.matches 
      await matchParser(summoner, req.params.region, matchlist, summonerDocument)

      // Iterate over champion matches & calc avgs
      await championParser(summonerDocument)

      summonerDocument.pull.active = false
      summonerDocument.pull.queue = 0
      await summonerDocument.save()

      const summonerResponse = (await aggregateSummoner(summoner.puuid))[0]
      res.send(summonerResponse)
      console.log(`${summoner.name} (${req.params.region}) finished.`)
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
   let summoner

   // I prefer to only use puuid to query aramstats db, so I need to get it from Riot again.
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

   // Get summoner data
   const summonerDocument = await summonerModel.findOne({ puuid: summoner.puuid })

   // Get total matchlist
   const totalMatchlist = (await twisted.getAllSummonerMatches(summoner.name, req.params.region)).reverse()

   // Find idx of last match id in matchlist
   const lastMatchIndex = matches.findIndex(x => x === summonerDocument.pull.lastMatchId) + 1
   const matchlist = totalMatchlist.slice(lastMatchIndex)

   // Set pull flags
   summonerDocument.pull.active = true
   summonerDocument.pull.lastMatchId = totalMatchlist[totalMatchlist.length - 1]
   summonerDocument.save()
   
   
   
   // emergency clog incase i hit update without building this
   console.log(pancakes)
   await matchParser(summoner, req.params.region, matchlist, summonerDocument, true)
   const summonerResponse = (await aggregateSummoner(summoner.puuid))[0]
   
   summonerDocument.pull.active = false
   summonerDocument.save()

   res.send(summonerResponse)
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

async function championParser(summonerDocument) {

   // Iterate over each champion sub document
   for (const champion of summonerDocument.championData) {
      
      const matches = await summonerMatchesModel.find( {"_id": { $in: champion.matches}} )
      // console.log(matches, 'records')
      
      champion.games = matches.length

      for (const match of matches) {
         if (match.win) champion.wins++
         champion.averages.allyHealPerMinute+= Math.round(match.totals.healsOnTeammates / match.gameDuration)
         champion.averages.assists+= match.assists
         champion.averages.damagePerMinute+= Math.round(match.totals.damageDealtToChampions / match.gameDuration)
         champion.averages.damageShare+= match.damageShare * 100
         champion.averages.damageTakenPerMinute+= Math.round(match.totals.damageTaken / match.gameDuration)
         champion.averages.deaths+= match.deaths
         champion.averages.goldEarned+= match.totals.gold
         champion.averages.goldPerMinute+= Math.round(match.totals.gold / match.gameDuration)
         champion.averages.healingPerMinute+= Math.round(match.totals.healed / match.gameDuration)
         champion.averages.healingOnTeammates+= match.totals.healsOnTeammates
         champion.averages.killParticipation+= match.killParticipation * 100
         champion.averages.kills+= match.kills
         champion.averages.selfMitigatedPerMinute+= Math.round(match.totals.selfMitigated / match.gameDuration)
         champion.averages.totalDamageDealt+= match.totals.damageDealtToChampions
         champion.averages.totalDamageTaken+= match.totals.damageTaken
         champion.averages.totalHeal+= match.totals.healed
         champion.averages.totalSelfMitigated+= match.totals.selfMitigated
         champion.multikills.triple+= match.multikills.triple
         champion.multikills.quadra+= match.multikills.quadra
         champion.multikills.penta+= match.multikills.penta
      }

      for (const [k, v] of Object.entries(champion.averages)) {
         champion.averages[k] = Math.round(v / matches.length)
      }
   }

   await summonerDocument.save()
}

async function matchParser(summoner, region, matchlist, summonerDocument, update = false) {

   for (let i = 0; i < matchlist.length; i++) {
   // for (let i = 0; i < 5; i++) {
      if (i % 25 === 0) {
         console.log(`Parsing ${summoner.name} (${region}), match ${i}/${matchlist.length}`)
         summonerDocument.pull.current = i
         await summonerDocument.save()
      }

      const game = await twisted.getMatchInfo(matchlist[i], region)
         .catch((e) => {
            if (e.status == 429) {
               console.log(`(${e.status}) @ matchParse. Recycling same game.`,)
               i--
            }
         })
      
         
      if (game) {
         const puuidIndex = game.metadata.participants.findIndex(x => x === summoner.puuid)
         const player = game.info.participants[puuidIndex]


         const match = new summonerMatchesModel({
            _master: summonerDocument._id,
            matchId: game.metadata.matchId,
            gameCreation: game.info.gameCreation,
            gameDuration: getGameDuration(game.info),
            gameVersion: game.info.gameVersion,
            win: player.win,
            kills: player.kills,
            deaths: player.deaths,
            assists: player.assists,
            assists: player.assists,
            killParticipation: getKillParticipation(player, game.info.participants),
            damageShare: getDamageShare(player, game.info.participants),
            items: getItems(player),
            summoner1Id: player.summoner1Id,
            summoner2Id: player.summoner2Id,
            primaryRune: player.perks.styles[0].selections[0].perk,
            secondaryRune: player.perks.styles[1].style,
            totals: {
               damageDealtToChampions: player.totalDamageDealtToChampions,
               damageTaken: player.totalDamageTaken,
               selfMitigated: player.damageSelfMitigated,
               healed: player.totalHeal,
               healsOnTeammates: player.totalHealsOnTeammates,
               gold: player.goldEarned
            },
            multikills: {
               triple: player.tripleKills,
               quadra: player.quadraKills,
               penta: player.pentaKills,
            },
         })

         await match.save()
         const championEmbed = summonerDocument.championData.find(e => e.name === player.championName)

         if (championEmbed) {
            championEmbed.matches.push(match._id)
         } else {
            summonerDocument.championData.push(
               {
                  name: player.championName, 
                  matches: match._id
               }
            )
         }
      }
   }
}

async function aggregateSummoner(puuid) {
   return await summonerModel.aggregate([
      { $match: { puuid: puuid} },
      { $unwind: "$championData" },
      { $lookup: {
         from: "summonermatches",
         localField: "championData.matches",
         foreignField: "_id",
         as: "championData.matches"
      }},
      { $group: {
         _id: "$_id",
         puuid: { $first: "$puuid"},
         name: { $first: "$name"},
         region: { $first: "$region"},
         profileIcon: { $first: "$profileIcon"},
         pull: { $first: "$pull"},
         challenges: { $first: "$challenges"},
         championData: { $push: "$championData"}
      }},
      // Omit _id?
      // { $project: {
      //    _id: 0,
      //    puuid: 1,
      //    name: 1,
      //    region: 1,
      //    profileIcon: 1,
      //    pull: 1,
      //    challenges: 1,
      //    championData: 1
      // }}
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
   return cowabunga
}

function getKillParticipation(player, participants) {
   let total = 0
   participants.forEach((participant) => {
      if (participant.teamId === player.teamId) {
         total += participant.kills
      }
   })
   let kp = Math.round((player.kills + player.assists) / total * 100) / 100

   return kp
}

module.exports = router