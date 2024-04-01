const config = require('../../config')
const util = require('./summoner')
const twisted = require('../../twisted_calls')
const summonerModel = require('../../models/summoner_model')
// const summonerMatchesModel = require('../../models/summonerMatches_model')
// const puuidModel = require('../../models/puuid_model')
// const challengeIds = require('../../constants/challengesIds');

class SummonerRoutes {
   initRoutes(app) {
      app.get(config.SUMMONER_PREFIX, this.getSummoner)
   }

   async getSummoner(req, res) {
      let summoner
      let summonerResponse
      let summonerDoc

      try {
         summoner = await util.findSummoner(req.params.gameName, req.params.tagLine, req.params.region)
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

      summonerDoc = await summonerModel.findOne({ '_id': summoner.puuid })

      if (summonerDoc) {
         if (summonerDoc.parse.total || summonerDoc.queue.total) {
            res.send({ ...summonerDoc.parse, ...summonerDoc.queue })
            return
         }

         summonerResponse = (await util.aggregateSummoner(summoner.puuid))[0]
         console.log(summonerResponse, 'toads')
         res.send(summonerResponse)
         return
      }

      const [matchlist, challenges] = await Promise.all([
         twisted.getAllSummonerMatches(summoner.puuid, summoner.region),
         util.challengeScribe(summoner.puuid, summoner.region)
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

      await util.parseMatchlist(summonerDocument, matchlist)
      await util.computeChampionAverages(summonerDocument)

      summonerResponse = (await util.aggregateSummoner(summoner.puuid))[0]
      res.status(200).send(summonerResponse)
   }
}

module.exports = new SummonerRoutes()