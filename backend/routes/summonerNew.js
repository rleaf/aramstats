const express = require('express')
const mongodb = require('mongodb')
// const Queue = require('promise-queue')
const dotenv = require('dotenv')
const twisted = require('../twisted_calls')
const summonerModel = require('../models/summoner_model')
const summonerMatchesModel = require('../models/summonerMatches_model')
const puuidModel = require('../models/puuid_model')
const challengeIds = require('../constants/challengesIds')

dotenv.config()
// const maxConcurrent = 1
// const maxQueue = Infinity
// const queue = new Queue(maxConcurrent, maxQueue)

const router = express.Router()

async function findSummoner(gameName, tagLine, region) {
   /*
      Wrapper function for getAccount and GetSummoner
   */
   try {
      const riotId = await twisted.getAccount(gameName, tagLine)
      const summoner = await twisted.getSummoner(riotId.puuid, region)

      return {...riotId, ...summoner, region: region}
   } catch (e) {
      throw e.body.status
   }
}

async function challengeScribe(puuid, region) {
   const challengesDto = await twisted.playerChallenges(puuid, region)
   const challenges = challengesDto.challenges.filter(el => challengeIds.includes(el.challengeId))

   return challenges
}

function populateMatchDocument(match, participant, docId) {
   

   const matchDocument = new summonerMatchesModel({
      // peep schema for human-interpretable
      m: docId,
      mId: game.metadata.matchId,
      gc: game.info.gameCreation,
      gd: getGameDuration(game.info),
      gv: game.info.gameVersion,
      w: participant.win,
      k: participant.kills,
      d: participant.deaths,
      a: participant.assists,
      a: participant.assists,
      kp: getKillParticipation(participant, game.info.participants),
      ds: getDamageShare(participant, game.info.participants),
      i: getItems(participant),
      s1: participant.summoner1Id,
      s1c: participant.summoner1Casts,
      s2: participant.summoner2Id,
      s2c: participant.summoner2Casts,
      sc: [participant.spell1Casts, participant.spell2Casts, participant.spell3Casts, participant.spell4Casts],
      pr: participant.perks.styles[0].selections[0].perk,
      sr: participant.perks.styles[1].style,
      t: {
         dtc: participant.totalDamageDealtToChampions,
         dt: participant.totalDamageTaken,
         sm: participant.damageSelfMitigated,
         h: participant.totalHeal,
         ah: participant.totalHealsOnTeammates,
         g: participant.goldEarned
      },
      mk: {
         t: participant.tripleKills,
         q: participant.quadraKills,
         p: participant.pentaKills,
      },
      tId: participant.teamId,
      fba: participant.firstBloodAssist,
      fbk: participant.firstBloodKill,
      tk: participant.turretKills,
      tl: participant.turretsLost,
      p: {
         all: participant.allInPings,
         assist: participant.assistMePings,
         bait: participant.baitPings,
         basic: participant.basicPings,
         comm: participant.commandPings,
         danger: participant.dangerPings,
         enMiss: participant.enemyMissingPings,
         enVis: participant.enemyVisionPings,
         back: participant.getBackPings,
         hold: participant.holdPings,
         vis: participant.needVisionPings,
         omw: participant.onMyWayPings,
         push: participant.pushPings,
         visClr: participant.visionClearedPings,
      }
   })
}

function parseTimeline(timeline) {
   // console.log(timeline)
}

async function parseMatchlist(summonerDocument, matchlist) {
   for (let i = 0; i < matchlist.length; i++) {
      let match
      let timeline
      let participant
      let championEmbed
      // let matchBin = []
      // let puuidBin = []
      // let binSize = 10

      if (i % 25 === 0 || i === matchlist.length - 1) {
         console.log(`${summonerDocument.gameName}#${summonerDocument.tagLine} (${summonerDocument.region}): match ${i}/${matchlist.length}`)
         summonerDocument.pull.current = i
         // await summonerDocument.save()
      }

      try {
         match = await twisted.getMatchInfo(matchlist[matchlist.length - i - 1], summonerDocument.region)
      } catch (e) {
         if (e.status === 404) continue
         // if (e.status > 500) Riot API error
         // if (e.status === 429) {
         //    i--
         //    continue
         // }
      }

      if (match.info.gameDuration < 300) continue
      participant = match.info.participants.find(p => p.puuid === docId)

      try {
         timeline = await twisted.getMatchTimeline(matchlist[matchlist.length - i - 1], summonerDocument.region)
         // timeline = await twisted.getMatchTimeline('NA1_4265600988', summonerDocument.region) // 404 timeline test
      } catch(e) {}

      const matchDocument = new summonerMatchesModel({
         // peep schema for human-interpretable
         m: docId,
         mId: game.metadata.matchId,
         gc: game.info.gameCreation,
         gd: getGameDuration(game.info),
         gv: game.info.gameVersion,
         w: participant.win,
         k: participant.kills,
         d: participant.deaths,
         a: participant.assists,
         a: participant.assists,
         kp: getKillParticipation(participant, game.info.participants),
         ds: getDamageShare(participant, game.info.participants),
         i: getItems(participant),
         s1: participant.summoner1Id,
         s1c: participant.summoner1Casts,
         s2: participant.summoner2Id,
         s2c: participant.summoner2Casts,
         sc: [participant.spell1Casts, participant.spell2Casts, participant.spell3Casts, participant.spell4Casts],
         pr: participant.perks.styles[0].selections[0].perk,
         sr: participant.perks.styles[1].style,
         t: {
            dtc: participant.totalDamageDealtToChampions,
            dt: participant.totalDamageTaken,
            sm: participant.damageSelfMitigated,
            h: participant.totalHeal,
            ah: participant.totalHealsOnTeammates,
            g: participant.goldEarned
         },
         mk: {
            t: participant.tripleKills,
            q: participant.quadraKills,
            p: participant.pentaKills,
         },
         tId: participant.teamId,
         fba: participant.firstBloodAssist,
         fbk: participant.firstBloodKill,
         tk: participant.turretKills,
         tl: participant.turretsLost,
         p: {
            all: participant.allInPings,
            assist: participant.assistMePings,
            bait: participant.baitPings,
            basic: participant.basicPings,
            comm: participant.commandPings,
            danger: participant.dangerPings,
            enMiss: participant.enemyMissingPings,
            enVis: participant.enemyVisionPings,
            back: participant.getBackPings,
            hold: participant.holdPings,
            vis: participant.needVisionPings,
            omw: participant.onMyWayPings,
            push: participant.pushPings,
            visClr: participant.visionClearedPings,
         }
      })

      // matchDocument.save()

      championEmbed = summonerDocument.championData.find(c => c.id === participant.championId)
      if (championEmbed) {
         championEmbed.matches.unshift(match._id)
      } else {
         summonerDocument.championData.push(
            {
               id: participant.championId,
               matches: matchDocument._id
            }
         )
      }
      console.log(summonerDocument.championData)
      /* 
         https://leagueoflegends.fandom.com/wiki/Surrendering (ctrl+f "early")
         Don't use gameEndedInEarlySurrender. It is neq to a remake.
      */
      
      return
      continue
   }
}

async function initPull(summoner) {
   /* 
      Initial summoner pull.
      0. Get relevant data from riot
      1. Create summoner document
      2. Iter through matchlist and push to corresponding champion 
   */
   const [matchlist, challenges] = await Promise.all([
      twisted.getAllSummonerMatches(summoner.puuid, summoner.region),
      challengeScribe(summoner.puuid, summoner.region)
   ])

   const summonerDocument = new summonerModel({
      _id: summoner.puuid,
      gameName: summoner.gameName,
      tagLine: summoner.tagLine,
      region: summoner.region,
      level: summoner.summonerLevel,
      profileIcon: summoner.profileIconId,
      pull: {
         active: true,
         current: 0,
         queue: null, // matchlist.length
         lastMatchId: null// last match id for updating
      },
      challenges: challenges
   })
   
   await parseMatchlist(summonerDocument, matchlist)

   // summonerDocument.save()
}


router.get('/:region/:gameName/:tagLine', async (req, res) => {
   /* 
      Use ryi#na1

      0. Check to see if summoner exists in Riot DB, if not return DNE
      1. Check to see if summoner document exists in summoner collection in DB
         2. If exists, send summoner document
         3. If DNE, init pull

      Initial pull:
         1. Get total matchlist.
         2. 
   */
   let summoner
   
   try {
      summoner = await findSummoner(req.params.gameName, req.params.tagLine, req.params.region)
   } catch (e) {
      if (e.status_code < 500) {
         console.log(`${req.params.gameName}#${req.params.tagLine} (${req.params.region}) DNE`)
         res.status(e.status_code).send(e.message)
         return
      } else {
         console.log('Riot servers down?')
         /* 
            1. Attempt lookup anyways on Aramstats db
            2. If DNE, res.status(e.status_code).send(e.message)
            3. If exists, return summoner
         */
      }
   }
   
   const summonerDoc = await summonerModel.findOne({ '_id': summoner.puuid })
   
   if (summonerDoc) {
      if (summonerDoc.pull.active) {
         /* 
            If setup long polling, need to cache prior pull index to see if neq to current polled.
            const previous = req.params.poll
         */
         res.send(summonerDoc.pull)
         return
      }
      
      // Aggregate summoner data to send to front
      const summonerResponse = null
      res.send(summonerResponse)
      return
   }
   
   await initPull(summoner)
})

router.put('/update/:region/:summonerURI', async (req, res) => {
   
})

router.delete('/delete/:region/:summonerURI', async (req, res) => {
   
})

module.exports = router