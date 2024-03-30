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

function parseTimeline3(timeline, playerIndex) {
   const CONTIGUITY = 5000
   const AVG_TEAMFIGHT_DISTANCE = 1300
   const BUILDING_KILL_WINDOW = 30000
   let timelineData = {
      exp: 0,   // expectation
      cap: 0,   // capitalization
      use: 0,   // usefullness
      part: 0,  // participation
      freq: 0,  // frequency
      fs: 0,    // fountain sitting
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
         if (e[j].timestamp - capFlag <= BUILDING_KILL_WINDOW && e[j].type === 'BUILDING_KILL') {
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

function parseTimeline2(timeline, playerIndex) {
   // Use a "middle-out" approach that will iterate, more efficiently, than parseTimeline. Instead of checking every single CHAMPION_KILL and it's proceeding ~30 seconds of data to see if a teamfight exists, it only looks at every CHAMPION_KILL with 3+ assists. It then looks at the proceeding 8 seconds to see if there's another CHAMPION_KILL with 3+ assists in favor of the other team. If both of these CHAMPION_KILLS flag true, then it's a teamfight.

   // Although it's more efficient, it's a little more painful grabbing all of the pertaining data because, now, instead of only having to look forward for relevant data, I also need to go backwards since the flag for a teamfight is likely to occur in the middle of a teamfight.

   // UPDATE: Okay Jared reminded me that this wouldn't work for 5-0 teamfights, because one side won't die at all. All my homies hate Jared. Instead, we discussed qualifying teamfights based off CHAMPION_KILL death proximities. If they're close enough, then it's a teamfight. https://discord.com/channels/@me/230170098785189889/1223021090998063195

   let timelineData = {
      exp: 0,   // expectation
      cap: 0,   // capitalization
      use: 0,   // usefullness
      part: 0,  // participation
      freq: 0,  // frequency
      fs: 0,    // fountain sitting @@@
   }
   let teamfights = []
   let t1 // timestamp_1
   const teamCheck = (id) => (id > 5) ? 0 : 1


   // ITER FRAMES
   for (let i = 0; i < timeline.info.frames.length; i++) {
      const e = timeline.info.frames[i].events
      // const e2 = timeline.info.frames[i+1].events
      const e2 = (timeline.info.frames[i+1]) ? timeline.info.frames[i+1].events : null
      let demarcate = false
      let f1, f2 // flags
      let c1, c2 // team check
      
      // ITER EVENTS
      for (let j = 0; j < e.length; j++) {
         if (('assistingParticipantIds' in e[j] && e[j].assistingParticipantIds.length > 3)) {
            if (!f1) { // Initial flag check
               c1 = teamCheck(e[j].killerId)
               t1 = e[j].timestamp
               f1 = j
               continue
            } else {
               if (e[j].timestamp - t1 <= 8000) {
                  c2 = teamCheck(e[j].killerId)
                  if (c1 !== c2) {
                     f2 = j
                     break
                  }

                  if (e2 && !f2 && !e[j+1]) { // In the event a demarcation is between a teamfight.
                     for (let k = 0; k < e2.length; k++) {
                        if (e2[k].timestamp - t1 <= 8000) break
                        if ('assistingParticipantIds' in e2[k] && e2[k].assistingParticipantIds.length > 3) {
                           c2 = teamCheck(e2[k].killerId)
                           if (c1 !== c2) {
                              demarcate = true // Detect if the index is on the proceeding frame
                              f2 = k
                              break
                           }
                        }
                     }
                  }
               } else {
                  f1 = f2 = null
               }
            }
         }
      }

      // if (f1 && f2) teamfights.push([i, f1, f2])
      console.log(f1, f2)
      if (typeof f1 === 'number' && typeof f2 === 'number') teamfights.push([i, f1, f2])
   }
   console.log(teamfights, 'tf')
   for (let i in teamfights) {
      const tf = teamfights[i]
      const tl = timeline.info.frames[tf[0]]

      // 
      for (let j = 0; j < tl[2]; j++) {

      }
   }
}

function parseTimeline(timeline, playerIndex) {
   // Timeline explanations: https://www.figma.com/file/iOKkrg5bBTd5IFp3ghjSS0/Aramstats?type=whiteboard&node-id=0%3A1&t=YEwCSx4b514A9eFe-1
   let capFlag = false
   let timelineData = {
      exp: 0,   // expectation
      cap: 0,   // capitalization
      use: 0,   // usefullness
      part: 0,  // participation
      freq: 0,  // frequency
   }
   
   //  ITER FRAMES
   for (let i = 0; i < timeline.info.frames.length; i++) {
      let e = timeline.info.frames[i].events
      let victims = []
      let participants = new Set()
      let tf = false
      let tfContainer = []
      
      // ITER EVENTS
      for (let j = 0; j < e.length; j++) {
         /**
          * Prerequisites for a teamfight are any champion kill.
          * After every champion kill, look into the proceeding 30 seconds to find any teamfighting corroborating data.
          * Corroborating data is any champion kill accompanied with 3 assists. For a teamfight to be flagged, both sides must have corroborating data.
         */

         if (capFlag && e[j].type === 'BUILDING_KILL') {
            timelineData.cap++
            capFlag = false
         }
         
         if (e[j].type === 'CHAMPION_KILL') {
            let o = j + 1
            let flag = false
            for (o; o < e.length; o++) {
               // if (!e[o]) {
               //    e = timeline.info.frames[i + 1].events
               //    o = 0
               //    flag = true
               // }
               if ((e[o].timestamp - e[j].timestamp) >= 30000) break
               if (e[o].type === 'CHAMPION_KILL') tfContainer.push(e[o])
            }
            j += o
            if (flag) e = timeline.info.frames[i].events
         }
         // console.log(e[j-1], 'turkeys')

         if (tfContainer) {
            let f1, f2
            for (let k = 0; k < tfContainer.length; k++) {
               // if ('assistingParticipantIds' in tfContainer[k]) {
               //    tfContainer[k].assistingParticipantIds.forEach(p => participants.add(p))
               //    if (tfContainer[k].assistingParticipantIds.length < 3) continue
               // }
               victims.push(tfContainer[k].victimId)
               if (!('assistingParticipantIds' in tfContainer[k]) || tfContainer[k].assistingParticipantIds.length < 3) continue
               tfContainer[k].assistingParticipantIds.forEach(p => participants.add(p))
               if (tfContainer[k].killerId <= 5) {
                  f1 = true
               } else {
                  f2 = true
               }
               if (f1 && f2) {
                  console.log(`teamfight detected on frame ${i}, timestamp ${tfContainer[k].timestamp}`)
                  tf = true
               }
            }
         }

         tfContainer = []

         if (tf) {
            let t2 = 0
            let e2 = 0
            let use = []
            capFlag = true

            timelineData.freq++

            victims.forEach(v => {
               if (v <= 5 && playerIndex <= 5) {
                  use.push(v)
                  t2++
               } else {
                  e2++
               }

               if (v > 5 && playerIndex > 5) {
                  t2++
               } else {
                  e2++
               }
            })
            
            timelineData.use += use.findIndex(o => o === playerIndex) + 1
            timelineData.exp += (e2 - t2)               
            if (participants.has(playerIndex)) timelineData.part++
            tf = false
         }
      }
   }

   if (timelineData.freq) {
      const af = (o) => {
         return Math.round((o / timelineData.freq) * 10) / 10
      }
      timelineData.exp = af(timelineData.exp)
      timelineData.use = af(timelineData.use)
   }

   return timelineData
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

      try {
         timeline = await twisted.getMatchTimeline(matchId, summonerDocument.region)
      } catch(e) {}

      if (timeline) {
         timelineData = parseTimeline3(timeline, playerIndex)
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