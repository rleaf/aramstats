const twisted = require('../twisted_calls')
const { matchModel } = require('../models/matches_model')
const { puuidModel } = require('../models/puuid_model')
const Util = require('./Util')

class Propagate {
   constructor() {

      this.util = new Util()
      this._pause = false
      this.init()
   }
   
   async init() {
      this.patch = await this.util.getPatch()
      this.regionGroups = ['americas', 'EUROPE', 'ASIA', 'SEA']
      this.matchModel = matchModel(this.patch)
      this.puuidModel = puuidModel(this.regionGroups[0]) // Fire crawler on 1, 2, 3
      // this.matchModel.syncIndexes()
      // this.puuidModel.syncIndexes()
      this.docIndex = 0
      this.start = 0
      this.startIndex = 510
      this.ceiling = 70
      this.recycle = false

      /* 
      * Have it so it caches index to db on crash
      */

      let puuidList = await this.puuidModel.find()
      if (this.startIndex) puuidList = puuidList.slice(this.startIndex)

      for (const doc of puuidList) {
         console.log('on: ', doc.puuid)
         await this.propagate(doc)
         if (this.docIndex % 10 === 0) {
            console.log(`On puuid index ${this.docIndex + this.startIndex} ***************************************************`)
         }
         this.docIndex++
      }
      console.log('fin')
   }

   async propagate(doc) {
      const matchlist = await twisted.getSummonerMatches(doc.puuid, doc.region, this.start)
      const region = this.util.getPlatform(matchlist[0])
      let matchdeck = []
      let puuiddeck = []

      for (let i = 0; i < matchlist.length; i++) {
         console.log(matchlist[i])
         const match = await twisted.getMatchInfo(matchlist[i], doc.region)

         // Continue/Break on...

         // ...404 match
         if (match.status_code && match.status_code === 404) continue
         // ...dead match
         if (!match.info.gameDuration) continue
         // ...old patch
         if (this.patch != match.info.gameVersion.split('.').slice(0, 2).join('.')) break

         matchdeck.push(match)
         puuiddeck.push(match.metadata.participants)

         if (i === this.ceiling) {
            this.recycle = true
            this.start += this.ceiling
            break
            // console.log('getting more matches')
            // await this.push(matchdeck, puuiddeck, region)
            // await this.propagate(doc, this.start)
         }
      }

      await this.push(matchdeck, puuiddeck, region)
      if (this.recycle) this.propagate(doc)
   }

   async push(matchdeck, puuiddeck, region) {
      let toad = puuiddeck.flat().map(el => {
         return { puuid: el, region: region }
      })

      try {
         await this.matchModel.insertMany(matchdeck, { ordered: false })
      } catch (e){ 
         console.log(`Duplicate matches, inserted: ${e.result.insertedCount}/${matchdeck.length}`)
       }

      try {
         await this.puuidModel.insertMany(toad, { ordered: false }) 
      } catch (e) {
         console.log(`Duplicate puuids, inserted: ${e.result.insertedCount}/${toad.length}`)  
      }
   }

   async propagateOld(matchlist) {
      for (const matchId of matchlist) {
         console.log('match', matchId)
         if (this._pause) {
            console.log('Pausing crawl')
            return
         }
         
         const region = this.util.getPlatform(matchId)
         let match

         match = await twisted.getMatchInfo(matchId, region)
               
         // ...dead match
         if (match.status_code && match.status_code === 404) continue
         if (!match.info.gameDuration) continue

         // ...old patch
         if (this.patch != match.info.gameVersion.split('.').slice(0, 2).join('.')) {
            console.log('old patch')
            break
         }
         // ...duplicate matchId
         if (await this.matchModel.findOne({ 'metadata.matchId': matchId})) continue
         console.log(`adding ${matchId} to db`)
         await this.matchModel.create({
            metadata: match.metadata,
            info: match.info
         })
         
         for (const puuid of match.metadata.participants) {
            // ...duplicate puuid
            if (await this.puuidModel.findOne({ puuid: puuid })) continue
            console.log(`adding ${puuid} to puuids`)
            await this.puuidModel.create({
               puuid: puuid,
               region: region
            })
         }
         
      }
   }

   pause() {
      this._pause = true
   }

   async resume() {
      /* 
      * Untested
      */
      this._pause = false

      const puuids = (await this.puuidModel.find({})).slice(this.docIndex)

      for (const doc of puuids) {
         const matchlist = await twisted.getSummonerMatchesOnPatch(doc.puuid, doc.region, this.patch)
         await this.propagate(matchlist)
         this.docIndex++
      }
   }
}

module.exports = Propagate