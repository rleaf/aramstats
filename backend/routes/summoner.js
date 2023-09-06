const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../twisted_calls')
const summonerModel = require('../models/summoner_model')
const matchModel = require('../models/match_model')
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
      const exists = await summonerModel.findOne({ 'puuid': summoner.puuid })

      // 2.
      if (exists) {
         console.log(`Summoner ${summoner.name} (${req.params.region}) already parsed.`)
         res.send(exists)
         return
      }

      // 3.
      
      // 3.1 Pull all matchIds
      // Reverse so it starts processing the last game first - most recent game should be at top.
      const matchlist = (await twisted.getAllSummonerMatches(summoner.name, req.params.region)).reverse()
      const challenges = await challengeScribe(summoner.puuid, req.params.region)
      
      // console.log(challenges, 'challenges')
      // 3.2 Create summoner document
      const summonerDocument = new summonerModel({
         puuid: summoner.puuid,
         name: summoner.name,
         profileIcon: summoner.profileIconId,
         pull: {
            active: true,
            current: 0,
            queue: matchlist.length
         },
         challenges: challenges
      })

      // 3.3 Parse every match, store what I want in matches collection. Once match document
      //     is created, push the _id to summoner.<champion>.matches 
      await matchParser(summoner, req.params.region, matchlist, summonerDocument)

      // Iterate over champion matches & calc avgs
      championParser(summonerDocument.championData)

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

async function championParser(championData) {

   championData.forEach((data) => {
      data.matches.forEach(async (id) => {
         await matchModel.findById(id)
      }) 
   })
}

async function matchParser(summoner, region, matchlist, summonerDocument) {

   // for (let i = 0; i < matchlist.length; i++) {
   for (let i = 0; i < 8; i++) {
      if (i % 25 == 0) {
         console.log(`Parsing ${summoner.name} (${region}), match ${i}`)
         summonerDocument.pull.current = i
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


         const match = new matchModel({
            matchId: game.metadata.matchId,
            gameCreation: game.info.gameCreation,
            gameDuration: game.info.gameDuration,
            gameVersion: game.info.gameVersion,
            win: getWin(player, game.info.participants),
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

async function challengeScribe(puuid, region) {
   const challengesDto = await twisted.playerChallenges(puuid, region)
   const challenges = challengesDto.challenges.filter(el => challengeIds.includes(el.challengeId))

   return challenges
}

function getWin(player, participants) {
   // 0: win, 1: loss, 2: remake
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