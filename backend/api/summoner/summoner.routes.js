const config = require('../../config')
const Queue = require('../../Queue')
const util = require('./summoner')
const twisted = require('../../twisted_calls')
const summonerModel = require('../../models/summoner_model')
const summonerMatchesModel = require('../../models/summonerMatches_model')

class SummonerRoutes {
   initRoutes(app, db) {
      this.queue = new Queue(db)

      app
         .get(config.SUMMONER_PREFIX, this.getSummoner.bind(this))
         .get(config.UPDATE_SUMMONER_PREFIX, this.updateSummoner)
         .get(config.CHECK_SUMMONER, this.checkSummoner)
         .get(config.JANE_DOE, this.getRandom)
         // .delete(config.DELETE_SUMMONER_PREFIX, this.deleteSummoner)
   }
   
   async getSummoner(req, res) {
      let summoner
      let summonerResponse
      let summonerDoc
      let check

      try {
         console.log(`Searching: ${req.params.gameName}#${req.params.tagLine} (${req.params.region})`)
         summoner = await util.findSummoner(req.params.gameName, req.params.tagLine, req.params.region)
      } catch (e) {
         res.status(e.status).send(e.body.status.message)
         return
      }

      check = await this.queue.check(summoner.puuid, summoner.region)
      if (typeof check[0] === 'number') {
         console.log(`${summoner.gameName} already in Queue.`)
         await this.workQueue(summoner)
         const parse = { parse: { status: config.STATUS_IN_QUEUE, position: check[0], length: check[1] } }
         res.status(200).send(parse)
         return
      }

      summonerDoc = await summonerModel.findOne({ '_id': summoner.puuid })

      if (summonerDoc) {
         if (summonerDoc.parse.status && summonerDoc.parse.status !== config.STATUS_COMPLETE) {
            res.status(200).send({ parse: summonerDoc.parse})
            return
         }

         // Obsolete, but just in case. Logic is in this.checkSummoner already and returns summoner aggregation if complete
         summonerResponse = (await util.aggregateSummoner(summoner.puuid))[0]
         res.status(200).send(summonerResponse)
         return
      }

      // Summoner exists & DNE in Aramstats DB. Need to parse.

      const queuePosition = await this.queue.count(summoner.region)
      await util.skeletonizeSummoner(summoner, queuePosition)
      console.log(`+ ${summoner.gameName}#${summoner.tagLine} (${summoner.region}) to Queue.`)
      await this.queue.add(summoner.puuid, summoner.region)
      check = await this.queue.check(summoner.puuid, summoner.region)

      if (check[0] === 1 && this.queue.inactiveRegions.has(summoner.region)) {
         res.status(200).send({ parse: { status: config.STATUS_PARSING, current: 'TBD', total: 'TBD' } })
      } else {
         res.status(200).send({ parse: { status: config.STATUS_IN_QUEUE, position: check[0], length: check[1] } })
      }
      
      await this.workQueue(summoner)
   }

   async workQueue(summoner) {
      /**
       * Queue management that works via baton passing.
       * Longterm, maybe more reliable to create a separate script that runs via cronjobs to ping the queue for a given region every ~minute. Can build this in python too.
      */
      if (this.queue.inactiveRegions.has(summoner.region)) { 
         let qSummoner = await this.queue.get(summoner.region)
         let document

         this.queue.inactiveRegions.delete(summoner.region) 

         while (qSummoner) {
            try {
               document = await summonerModel.findOne({ '_id': qSummoner.qPuuid })
               await this.queue.update(summoner.region)
               await util.initialParse(document)
               qSummoner = await this.queue.get(summoner.region)
               if (qSummoner) document = await summonerModel.findOne({ '_id': qSummoner.qPuuid })
            } catch (e) {
               console.log(e, 'rip bozo')   
               this.queue.inactiveRegions.add(summoner.region)
            }
         }
         console.log(`(${summoner.region}) Queue complete.`)
         this.queue.inactiveRegions.add(summoner.region)
      }
   }

   async updateSummoner(req, res) {
      console.log('Updating: ' + req.params.gameName + '#' + req.params.tagLine + ' (' + req.params.region + ')')
      let summoner
      let summonerResponse
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
               throw e
            }
         } else {
            throw e
         }
      }

      summonerDocument = await summonerModel.findOne({ _id: summoner.puuid })

      const [matchlist, challenges] = await Promise.all([
         twisted.getAllSummonerMatches(summoner.puuid, summoner.region, summonerDocument.lastMatchId),
         util.challengeScribe(summoner.puuid, summoner.region)
      ])

      if (!matchlist.length) {
         res.status(204).send()
         return
      }


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

   async getRandom(_, res) {
      const summonerPUUID = await summonerModel.findOne()._id
      const response = (await util.aggregateSummoner(summonerPUUID))[0]
      res.status(200).send(response)
   }

   async checkSummoner(req, res) {
      let summoner
      try {
         summoner = await util.findSummoner(req.params.gameName, req.params.tagLine, req.params.region)
      } catch (e) {
         res.status(e.status).send(e.body.status.message)
         return
      }

      const response = await summonerModel.findOne({ '_id': summoner.puuid })
      if (response && response.parse.status === config.STATUS_COMPLETE) {
         const response = (await util.aggregateSummoner(summoner.puuid))[0]
         res.status(200).send(response)
      } else {
         res.status(404).send(config.SUMMONER_UNPARSED)
      }
   }

   async deleteSummoner(req, res) {
      console.log(`Deleting: ${req.params.gameName}#${req.params.tagLine} (${req.params.region})`)
      let summoner
      let bin = []

      try {
         summoner = await util.findSummoner(req.params.gameName, req.params.tagLine, req.params.region)
      } catch (e) {
         if (e.status_code < 500) {
            throw e
         }
      }

      const dbSummoner = await summonerModel.findOne({ _id: summoner.puuid })

      for (const data of dbSummoner.championData) {
         for (const match of data.matches) {
            bin.push({
               deleteOne: { filter: { _id: match } }
            })
         }
      }

      
      await summonerMatchesModel.bulkWrite(bin)
      await summonerModel.deleteOne({ _id: summoner.puuid })
      res.status(200).send('deleted')
   }
}

module.exports = new SummonerRoutes()