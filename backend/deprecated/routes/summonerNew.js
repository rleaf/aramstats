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
      death: 0, // death probability
      part: 0,  // participation
      freq: 0,  // frequency
      fs: 1,    // fountain sitting
   }
   let teamfights = []
   let bin = []
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
      let death = false
      let part = false
      for (let j = 0; j < teamfights[i].length; j++) {
         const cell = teamfights[i][j]

         if (('assistingParticipantIds' in cell
            && cell.assistingParticipantIds[playerIndex])
            || cell.killerId === playerIndex
            || cell.victimId === playerIndex) {

               // Participation
               part = true

               // Expectation
               if ((playerIndex <= 5 && cell.killerId <= 5) || (playerIndex > 5 && cell.killerId > 5)) timelineData.exp++
               if ((playerIndex <= 5 && cell.victimId <= 5) || (playerIndex > 5 && cell.victimId > 5)) timelineData.exp--

               // Usefullness
               if ((playerIndex <= 5 && cell.victimId <= 5) || (playerIndex > 5 && cell.victimId > 5)) use.push(cell.victimId)

               // Death Probability
               if (cell.victimId === playerIndex) death = true
            }
      }

      if (part) timelineData.part++
      if (death) timelineData.death++
      
      // Usefullness
      let player = (use.findIndex(o => o === playerIndex) + 1) ? use.findIndex(o => o === playerIndex) + 1 : 6
      timelineData.use += player
   }

   const af = (n) => (Math.round((n / timelineData.part) * 10) / 10)

   timelineData.exp = af(timelineData.exp)
   timelineData.use = af(timelineData.use)
   timelineData.death = af(timelineData.death)

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

   summonerDocument.parse.total = matchlist.length
   summonerDocument.lastMatchId = matchlist[0]
   await summonerDocument.save() // for sanity?

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

      if (timeline) timelineData = parseTimeline(timeline, playerIndex, playerTeam)

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
         championEmbed.tf.use += timelineData.use
         championEmbed.tf.death += timelineData.death
         championEmbed.tf.part += timelineData.part
         championEmbed.tf.freq += timelineData.freq
         summonerDocument.fountainSitter += timelineData.fs
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

      await puuidModel.bulkWrite(participantPuuids)
         .catch(e => {
            throw e
         })
      
      summonerDocument.parse.current = i
      
      await matchDocument.save()
      await summonerDocument.save()
   }
   
   summonerDocument.parse.current = 0
   summonerDocument.parse.total = 0
   summonerDocument.updated = Date.now()

   await summonerDocument.save()
}

router.get('/:region/:gameName/:tagLine', async (req, res) => {
   let summoner
   let summonerResponse
   let summonerDoc
   
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
   
   summonerDoc = await summonerModel.findOne({ '_id': summoner.puuid })
   
   if (summonerDoc) {
      if (summonerDoc.parse.total || summonerDoc.queue.total) {
         res.send({ ...summonerDoc.parse, ...summonerDoc.queue })
         return
      }
      
      summonerResponse = (await aggregateSummoner(summoner.puuid))[0]
      console.log(summonerResponse, 'toads')
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
      challenges: challenges,
   })

   await parseMatchlist(summonerDocument, matchlist)
   await computeChampionAverages(summonerDocument)

   summonerResponse = (await aggregateSummoner(summoner.puuid))[0]
   res.send(summonerResponse)
})

router.put('/update/:region/:summonerURI', async (req, res) => {
   
})

router.delete('/delete/:region/:summonerURI', async (req, res) => {
   
})

async function computeChampionAverages(summonerDocument) {
   for (const champion of summonerDocument.championData) {
      const matches = await summonerMatchesModel.find({ '_id': { $in: champion.matches } })

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
         champion.mk.t += match.mk[0]
         champion.mk.q += match.mk[1]
         champion.mk.p += match.mk[2]
      }

      for (const [k, v] of Object.entries(champion.avg)) {
         champion.avg[k] = Math.round(v / matches.length)
      }

      await summonerDocument.save()
   }
}

async function aggregateSummoner(puuid) {
   return await summonerModel.aggregate([
      { $match: { _id: puuid } },
      { $unwind: "$championData" },
      {
         $lookup: {
            from: "test_summoner_matches",
            localField: "championData.matches",
            foreignField: "_id",
            as: "championData.matches",
            pipeline: [ // For Encounters.vue
               {
                  $lookup: {
                     from: "test_summoner_puuids",
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
                     from: "test_summoner_puuids",
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
      {
         $group: {
            _id: "$_id",
            puuid: { $first: "$puuid" },
            level: { $first: "$level" },
            gameName: { $first: "$gameName" },
            tagLine: { $first: "$tagLine" },
            // name: { $first: "$name" },
            region: { $first: "$region" },
            profileIcon: { $first: "$profileIcon" },
            // pull: { $first: "$pull" },
            challenges: { $first: "$challenges" },
            championData: { $push: "$championData" }
         }
      },
      {
         $project: {
            _id: 0,
            puuid: 0,
         }
      }
   ])
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