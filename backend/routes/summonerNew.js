const express = require('express')
// const Queue = require('promise-queue')
const dotenv = require('dotenv')
const twisted = require('../twisted_calls')
const summonerModel = require('../models/summoner_model')
const summonerMatchesModel = require('../models/summonerMatches_model')
const puuidModel = require('../models/puuid_model')
const challengeIds = require('../constants/challengesIds');

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

function getPlayerUsefulness(victims, playerIndex) {
   let teamVictims = victims.filter(el => {
      if (playerIndex <= 5) {
         return el <= 5
      } else {
         return el > 5
      }
   })
   
   let use = teamVictims.findIndex(el => el === playerIndex) + 1
   let exp = teamVictims.length - victims.length
   return [use, exp]
}

function parseTimeline(timeline, playerIndex, playerTeam) {
   const CONTIGUITY = 5000
   const AVG_TEAMFIGHT_DISTANCE = 1300
   const BUILDING_KILL_WINDOW = 30000
   const FOUNTAIN_SITTING = 30000
   let timelineData = {
      exp: 0,   // expectation
      cap: 0,   // capitalization
      use: 0,   // usefullness
      part: 0,  // participation
      freq: 0,  // frequency
      fs: 1,    // fountain sitting
   }
   let teamfights = []
   let bin = []
   let c1, c2
   let initTimestamp
   let capFlag
   let tfPrerequisite = 0

   //  ITER FRAMES
   for (let i = 0; i < timeline.info.frames.length; i++) {
      let e = timeline.info.frames[i].events

      // ITER EVENTS
      for (let j = 0; j < e.length; j++) {
         if (timelineData.fs && playerIndex === e[j].participantId && e[j].timestamp < FOUNTAIN_SITTING && e[j].type === 'ITEM_PURCHASED') {
            timelineData.fs = 0
         }

         if (e[j].timestamp - capFlag <= BUILDING_KILL_WINDOW && e[j].type === 'BUILDING_KILL' && e[j].teamId !== playerTeam) {
            timelineData.cap++
            capFlag = undefined
         }

         if (e[j].timestamp - initTimestamp > CONTIGUITY) {
            if (tfPrerequisite > 1 && bin.length > 3 && averageDistance(bin) < AVG_TEAMFIGHT_DISTANCE) {
               teamfights.push(bin)
               capFlag = e[j].timestamp
            }

            tfPrerequisite = 0
            initTimestamp = c1 = c2 = undefined
            bin = []
         }

         if (e[j].type === 'CHAMPION_KILL') {
            if (e[j].timestamp - initTimestamp <= CONTIGUITY) {
               if ('assistingParticipantIds' in e[j] && e[j].assistingParticipantIds.length >= 2) tfPrerequisite++
               initTimestamp = e[j].timestamp
               bin.push(e[j])
            } else {
               if ('assistingParticipantIds' in e[j] && e[j].assistingParticipantIds.length >= 2) tfPrerequisite++
               
               if (!initTimestamp) {
                  initTimestamp = e[j].timestamp
                  bin.push(e[j])
               }
            }
         }
      }
   }

   // Frequency
   timelineData.freq = teamfights.length

   for (let i = 0; i < teamfights.length; i++) {
      let use = []
      let part = false
      for (let j = 0; j < teamfights[i].length; j++) {
         const cell = teamfights[i][j]

         // Expectation
         if ((playerIndex <= 5 && cell.killerId <= 5) || (playerIndex > 5 && cell.killerId > 5)) timelineData.exp++
         if ((playerIndex <= 5 && cell.victimId <= 5) || (playerIndex > 5 && cell.victimId > 5)) timelineData.exp--
         
         // Participation
         if (cell.assistingParticipantIds[playerIndex] || cell.killerId === playerIndex) part = true

         // Usefullness
         if ((playerIndex <= 5 && cell.victimId <= 5) || (playerIndex > 5 && cell.victimId > 5)) use.push(cell.victimId)
      }
      if (part) timelineData.part++
      
      // Usefullness
      timelineData.use += use.findIndex(o => o === playerIndex) + 1
   }

   const af = (o) => {
      return Math.round((o / timelineData.freq) * 10) / 10
   }

   timelineData.exp = af(timelineData.exp)
   timelineData.use = af(timelineData.use)

   return timelineData
}

function averageDistance(bin) {
   bin = bin.map(x => ({x: x.position.x, y: x.position.y}))

   let arr = []
   let avg
   for (let i = 0; i < bin.length; i++) {
      for (let j = i + 1; j < bin.length; j++) {
         arr.push(Math.sqrt(Math.pow(bin[i].x - bin[j].x, 2) + Math.pow(bin[i].y - bin[j].y, 2)))
      }
   }
   avg = arr.reduce((a, b) => a + b, 0) / arr.length
   return avg
}

async function parseMatchlist(summonerDocument, matchlist, update=false) {
   for (let i = 0; i < matchlist.length; i++) {
      let matchId = matchlist[matchlist.length - i - 1]
      let match
      let timeline
      let timelineData
      let playerIndex
      let player
      let championEmbed
      let participantPuuids = []

      try {
         match = await twisted.getMatchInfo(matchId, summonerDocument.region)
      } catch (e) {
         if (e.status === 404) continue
         // if (e.status > 500) Riot API error
         // if (e.status === 429) {
         //    i--
         //    continue
         // }
      }

      // ARAM Remake window is 3 min. Make it +30s in case someone someone takes a long time to vote.
      if (match.info.gameDuration < 210) continue
      console.log(matchId)

      // https://leagueoflegends.fandom.com/wiki/Surrendering (ctrl+f "early") Don't use gameEndedInEarlySurrender. It is neq to a remake.
      player = match.info.participants.find(p => p.puuid === summonerDocument._id)
      playerIndex = player.participantId
      playerTeam = player.teamId

      try {
         timeline = await twisted.getMatchTimeline(matchId, summonerDocument.region)
      } catch(e) {}

      if (timeline) {
         timelineData = parseTimeline(timeline, playerIndex, playerTeam)
         console.log(timelineData, 'toadies')
      }
      console.log(turkeys)

      const matchDocument = new summonerMatchesModel({
         m: summonerDocument._id,
         mId: match.metadata.matchId,
         gc: match.info.matchCreation,
         gd: (match.info.gameEndTimestamp) ? Math.round(match.info.gameDuration / 60) : Math.round(match.info.gameDuration / 60000),
         gv: match.info.matchVersion,
         w: player.win,
         k: player.kills,
         d: player.deaths,
         a: player.assists,
         kp: getKillParticipation(player, match.info.participants),
         ds: getDamageShare(player, match.info.participants),
         i: getItems(player),
         s1: player.summoner1Id,
         s2: player.summoner2Id,
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
         mk: [
            player.tripleKills,
            player.quadraKills,
            player.pentaKills,
         ],
         tId: player.teamId,
      })

      summonerDocument.pull.current = i
      // Consider storing championData as a map for constant lookup.
      championEmbed = summonerDocument.championData.find(c => c.championId === player.championId)
      if (!championEmbed) {
         summonerDocument.championData.push({championId: player.championId})
         championEmbed = summonerDocument.championData.find(c => c.championId === player.championId)
      }

      championEmbed.wins += (player.win) ? 1 : 0
      championEmbed.games += 1
      championEmbed.tg += match.info.participants.find(p => p.teamId !== player.teamId).turretsLost
      championEmbed.tl += player.turretsLost
      championEmbed.fbk += player.firstBloodKill
      // color-side wins
      championEmbed.bw += (player.teamId === 100) ? 1 : 0
      championEmbed.rw += (player.teamId === 200) ? 1 : 0
      // multikills
      championEmbed.mk.t += player.tripleKills
      championEmbed.mk.q += player.quadraKills
      championEmbed.mk.p += player.pentaKills
      // champion spells
      championEmbed.sc.q += player.spell1Casts
      championEmbed.sc.w += player.spell2Casts
      championEmbed.sc.e += player.spell3Casts
      championEmbed.sc.r += player.spell4Casts
      // summoner spells
      championEmbed.ss[player.summoner1Id].games += 1
      championEmbed.ss[player.summoner1Id].casts += player.summoner1Casts
      championEmbed.ss[player.summoner2Id].games += 1
      championEmbed.ss[player.summoner2Id].casts += player.summoner2Casts
      // pings
      championEmbed.p.all += player.allInPings
      championEmbed.p.assist += player.assistMePings
      championEmbed.p.basic += player.basicPings
      championEmbed.p.comm += player.commandPings
      championEmbed.p.danger += player.dangerPings
      championEmbed.p.enMiss += player.enemyMissingPings
      championEmbed.p.enVis += player.enemyVisionPings
      championEmbed.p.back += player.getBackPings
      championEmbed.p.hold += player.holdPings
      championEmbed.p.vis += player.needVisionPings
      championEmbed.p.omw += player.onMyWayPings
      championEmbed.p.push += player.pushPings
      championEmbed.p.visClr += player.visionClearedPings
      championEmbed.matches.unshift(matchDocument._id)

      if (timelineData) {
         championEmbed.tf.exp += timelineData.exp
         championEmbed.tf.cap += timelineData.cap
         championEmbed.tf.rel += timelineData.rel
         championEmbed.tf.part += timelineData.part
         championEmbed.tf.freq += timelineData.freq
      }

      for (const participant of match.info.participants) {
         participantPuuids.push({
            updateOne: {
               filter: { _id: participant.puuid },
               update: {
                  _id: participant.puuid,
                  gn: participant.riotIdGameName || participant.riotIdName,
                  tl: participant.riotIdTagline,
               },
               upsert: true
            }
         })

         if (participant.puuid != player.puuid) {
            if (player.teamId === participant.teamId) {
               matchDocument.te.push(participant.puuid)
               matchDocument.tc.push(participant.championId)
            } else {
               matchDocument.ee.push(participant.puuid)
               matchDocument.ec.push(participant.championId)
            }
         }
      }

      // await puuidModel.bulkWrite(participantPuuids)
      //    .catch(e => {
      //       throw e
      //    })

      // await matchDocument.save()
      // await summonerDocument.save()
   }
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
   let summonerResponse = null
   
   try {
      summoner = await findSummoner(req.params.gameName, req.params.tagLine, req.params.region)
   } catch (e) {
      if (e.status_code < 500) {
         console.log(e.status_code, e.message)
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
         // Consider long polling
         res.send(summonerDoc.pull)
         return
      }
      
      // summonerResponse = aggregateSummoner()
      res.send(summonerResponse)
      return
   }

   // Summoner DNE and needs initial pull
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
      updated: Date.now(),
      pull: {
         active: true,
         current: 0,
         queue: null, // matchlist.length
         lastMatchId: null // last match id for updating
      },
      challenges: challenges,
   })

   await parseMatchlist(summonerDocument, matchlist)

   summonerDocument.pull.active = false
   await summonerDocument.save()
   // summonerResponse = aggregateSummoner()
   res.send(summonerResponse)
})

router.put('/update/:region/:summonerURI', async (req, res) => {
   
})

router.delete('/delete/:region/:summonerURI', async (req, res) => {
   
})

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

   for (let i = 0; i < 6; i++) {
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