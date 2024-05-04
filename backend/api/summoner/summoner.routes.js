const config = require('../../config')
const Queue = require('../../Queue')
const util = require('./summoner')
const twisted = require('../../twisted_calls')
const summonerModel = require('../../models/summoner_model')

class SummonerRoutes {
   async initRoutes(app, db) {
      this.queue = new Queue(db)

      app
         .get(config.SUMMONER_PREFIX, this.getSummoner.bind(this))
         .get(config.UPDATE_SUMMONER_PREFIX, this.updateSummoner)
         .get(config.CHECK_SUMMONER_PREFIX, this.checkSummoner.bind(this))
         // .get(config.JANE_DOE_PREFIX, this.getRandom)
         // .delete(config.DELETE_SUMMONER_PREFIX_PREFIX, this.deleteSummoner)
         
   }
   
   async getSummoner(req, res) {
      let summoner
      let position

      try {
         console.log(`${req.params.gameName}#${req.params.tagLine} (${req.params.region}) [Searching]`)
         summoner = await util.findSummoner(req.params.gameName, req.params.tagLine, req.params.region)
      } catch (e) {
         const msg = (e.status === 404) ? config.SUMMONER_DNE : e.body.status.message
         res.status(e.status).send(msg)
         return
      }

      const dbSumm = await summonerModel.findOne({ '_id': summoner.puuid })

      if (dbSumm) {
         let response
         if (dbSumm.parse.status === config.STATUS_COMPLETE) {
            response = (await util.aggregateSummoner(summoner.puuid))[0]
         } else {
            if (dbSumm.parse.status === config.STATUS_PARSING && this.queue.inactiveRegions.has(summoner.region)) {
               util.deleteSummoner(dbSumm)
               res.status(404).send(config.SUMMONER_DELETED)
               return
            } else {
               console.log(`${req.params.gameName}#${req.params.tagLine} (${req.params.region}) [In Queue]`)
               this.workQueue(summoner)
               position = await this.queue.check(summoner.puuid, summoner.region)
               response = (position) ? { parse: { status: config.STATUS_IN_QUEUE, position: position } } : { parse: dbSumm.parse }
            }

         }

         res.status(200).send(response)
         return
      }

      // Summoner exists & DNE in Aramstats DB. Need to parse.
      try {
         await this.queue.add(summoner.puuid, summoner.region)
         console.log(`${summoner.gameName}#${summoner.tagLine} (${summoner.region}) [+ to Queue].`)
         position = await this.queue.check(summoner.puuid, summoner.region)
         await util.skeletonizeSummoner(summoner)
      } catch (e) {
         return // occasional 11000 errors, which if they occur should be ignored.
      }

      if (position === 1 && this.queue.inactiveRegions.has(summoner.region)) {
         res.status(200).send({ parse: { status: config.STATUS_PARSING, current: 'TBD', total: 'TBD' } })
      } else {
         res.status(200).send({ parse: { status: config.STATUS_IN_QUEUE, position: position } })
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

         while (qSummoner) {
            this.queue.inactiveRegions.delete(summoner.region)

            try {
               document = await summonerModel.findOne({ '_id': qSummoner.qPuuid })
               await this.queue.update(summoner.region)
               await util.initialParse(document)
               qSummoner = await this.queue.get(summoner.region)
               if (qSummoner) document = await summonerModel.findOne({ '_id': qSummoner.qPuuid })
            } catch (e) {
               qSummoner = await this.queue.get(summoner.region)
               this.queue.inactiveRegions.add(summoner.region)
               console.log(e, 'rip bozo') // Also clog so I'm not scrolling for hours
               throw e
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
         const msg = (e.status === 404) ? config.SUMMONER_DNE : e.body.status.message
         res.status(e.status).send(msg)
         return
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
         const msg = (e.status === 404) ? config.SUMMONER_DNE : e.body.status.message
         res.status(e.status).send(msg)
         return
      }

      const dbSumm = await summonerModel.findOne({ '_id': summoner.puuid })
      if (dbSumm) {
         let response
         if (dbSumm.parse.status === config.STATUS_COMPLETE) {
            response = (await util.aggregateSummoner(summoner.puuid))[0]
         } else {
            if (dbSumm.parse.status === config.STATUS_PARSING && this.queue.inactiveRegions.has(summoner.region)) {
               util.deleteSummoner(dbSumm)
               res.status(404).send(config.SUMMONER_DELETED)
               return
            } else {
               console.log(`${summoner.gameName} already in Queue.`)
               this.workQueue(summoner)
               const position = await this.queue.check(summoner.puuid, summoner.region)
               response = (position) ? { parse: { status: config.STATUS_IN_QUEUE, position: position } } : { parse: dbSumm.parse }
            }

         }

         res.status(200).send(response)
         return
      } else {
         res.status(404).send(config.SUMMONER_UNPARSED)
      }
   }

   async deleteSummoner(req, res) {
      console.log(`Deleting: ${req.params.gameName}#${req.params.tagLine} (${req.params.region})`)
      let summoner

      try {
         summoner = await util.findSummoner(req.params.gameName, req.params.tagLine, req.params.region)
      } catch (e) {
         if (e.status_code < 500) {
            throw e
         }
      }

      util.deleteSummoner(summoner)
      res.status(200).send(config.SUMMONER_DELETED)
   }
}

module.exports = new SummonerRoutes()