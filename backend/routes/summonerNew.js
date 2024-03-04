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
      throw e
   }
}

async function challengeScribe(puuid, region) {
   const challengesDto = await twisted.playerChallenges(puuid, region)
   const challenges = challengesDto.challenges.filter(el => challengeIds.includes(el.challengeId))

   return challenges
}

async function initPull(summoner) {
   /* 
      Initial summoner pull.
      0. Get relevant data from riot
      1. Iter through matchlist and push to corresponding champion 
   */
   const [matchlist, challenges] = await Promise.all([
      twisted.getAllSummonerMatches(summoner.puuid, summoner.region),
      challengeScribe(summoner.puuid, summoner.region)
   ])
   // const matchlist = await twisted.getAllSummonerMatches(summoner.puuid, summoner.region)
   // const challenges = await challengeScribe(summoner.puuid, summoner.region)

   for (let i = 0; i < matchlist.length; i++) {
      // Steak and potatos
   }

   console.log(matchlist[0], matchlist[matchlist.length - 1])
   console.log(challenges[0])
   // const summonerDocument = new summonerModel({
   //    _id: summoner.puuid,
   //    pull: {
   //       active: true,
   //       current: 0,
   //       queue: null, // matchlist.length
   //       lastMatchId: null// last match id for updating
   //    }
   // })
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
      console.log(`${req.params.gameName}#${req.params.tagLine} (${req.params.region}) DNE`)
      res.status(e.status).send(e.statusText)
      return
   }

   const summonerDoc = await summonerModel.findOne({ '_id': summoner.puuid })

   if (summonerDoc) {
      if (summonerDoc.pull.active) {
         res.send(summonerDoc.pull)
         return
      }
      
      res.send(summonerDoc)
      return
   }
   
   await initPull(summoner)
})

router.put('/update/:region/:summonerURI', async (req, res) => {
   
})

router.delete('/delete/:region/:summonerURI', async (req, res) => {
   
})

module.exports = router