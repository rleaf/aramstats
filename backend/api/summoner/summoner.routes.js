const config = require('../../config')
const Queue = require('../../Queue')
const util = require('./summoner')
const twisted = require('../../twisted_calls')
const summonerModel = require('../../models/summoner_model')

class SummonerRoutes {
   initRoutes(app, db) {
      this.queue = new Queue(db)
      
      app
         .get(config.SUMMONER_PREFIX, this.getSummoner.bind(this))
         .put(config.UPDATE_SUMMONER_PREFIX, this.updateSummoner)
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
            summonerDoc = await summonerModel.findOne({ '_id': puuid })

            if (!summonerDoc) {
               res.status(e.status_code).send(e.message)
               return
            }

            summonerResponse = (await util.aggregateSummoner(summoner.puuid))[0]
            res.send(summonerResponse)
            return
         } 
      }
      
      summonerDoc = await summonerModel.findOne({ '_id': summoner.puuid })

      if (summonerDoc) {
         // if ((summonerDoc.parse.status && summonerDoc.parse.status !== config.STATUS_COMPLETE)
         // || (summonerDoc.queue.status && summonerDoc.queue.status !== config.STATUS_COMPLETE)) {
         if (summonerDoc.parse.status && summonerDoc.parse.status !== config.STATUS_COMPLETE) {
            res.send({ parse: summonerDoc.parse, queue: summonerDoc.queue })
            return
         }

         summonerResponse = (await util.aggregateSummoner(summoner.puuid))[0]
         res.send(summonerResponse)
         return
      }

      // Summoner exists & DNE in Aramstats DB. Need to parse.

      /**
       * Temporary(?) queue management that works via "baton passing".
       * Longterm, probably more ideal to create a separate node script that runs via cronjobs to ping the queue for a given region every ~minute. Can build this in python too.
      */
      const queuePosition = await this.queue.regionCount(summoner.region)
      await util.skeletonizeSummoner(summoner, queuePosition)
      await this.queue.add(summoner.puuid, summoner.region)

      if (this.queue.inactiveRegions.has(summoner.region)) { // if baton is not held
         this.queue.inactiveRegions.delete(summoner.region) // take baton

         let qSummoner = await this.queue.get(summoner.region)
         summonerDoc = await summonerModel.findOne({ '_id': qSummoner.qPuuid })
         
         while (qSummoner) {
            // await util.queueBump()
            await util.initialParse(summonerDoc)
            qSummoner = await this.queue.get(summoner.region)
            if (qSummoner) summonerDoc = await summonerModel.findOne({ '_id': qSummoner.qPuuid })
         }

         this.queue.inactiveRegions.add(summoner.region) // put baton back
      }

      console.log('fin')
      // summonerResponse = (await util.aggregateSummoner(summoner.puuid))[0]
      // res.status(200).send(summonerResponse)
   }

   async updateSummoner(req, res) {
      let summoner
      let summonerDocument
      let championIds = new Set()

      try {
         summoner = await util.findSummoner(req.params.gameName, req.params.tagLine, req.params.region)
      } catch (e) {
         if (e instanceof Error) {
            if (e.status_code < 500) {
               console.log(`${req.params.gameName}#${req.params.tagLine} (${req.params.region}) DNE`)
               res.status(e.status_code).send(e.message)
               return
            } else {
               summonerDocument = await summonerModel.findOne({ '_id': puuid })

               if (!summonerDocument) {
                  res.status(e.status_code).send(e.message)
                  return
               }

               summonerResponse = (await util.aggregateSummoner(summoner.puuid))[0]
               res.send(summonerResponse)
               return
            }
         } else {
            throw e
         }
      }

      const [matchlist, challenges] = Promise.all([
         twisted.getAllSummonerMatches(summoner.puuid, summoner.region, summonerDocument.lastMatchId),
         util.challengeScribe(summoner.puuid, summoner.region)
      ])

      if (!matchlist.length) res.status(200).send('No new matches found.')

      summonerDocument = await summonerModel.findOne({ _id: summoner.puuid })

      summonerDocument.challenges = challenges
      summonerDocument.gameName = summoner.gameName
      summonerDocument.tagLine = summoner.tagLine
      summonerDocument.region = summoner.region
      summonerDocument.level = summoner.summonerLevel
      summonerDocument.profileIcon = summoner.profileIconId
      
      championIds = await util.parseMatchlist(summonerDocument, matchlist, championIds)
      await util.computeChampionAverages(summonerDocument, championIds)

      summonerResponse = (await util.aggregateSummoner(summoner.puuid))[0]
      res.status(200).send(summonerResponse)
   }
}

module.exports = new SummonerRoutes()