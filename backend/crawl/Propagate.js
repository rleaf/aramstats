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
      this.regionGroups = ['AMERICAS', 'EUROPE', 'ASIA', 'SEA']
      this.matchModel = matchModel(this.patch)
      this.puuidModel = puuidModel(this.regionGroups[0]) // Fire crawler on 1, 2, 3
      this.docIndex = 0

      for (const doc of await this.puuidModel.find({})) {
         const matchlist = await twisted.getSummonerMatchesOnPatch(doc.puuid, doc.region, this.patch)
         await this.propagate(matchlist)
         if (this.docIndex % 25 === 0) {
            console.log(`On puuid index ${this.docIndex}`)
         }
         this.docIndex++
      }
      console.log('fin')
   }

   async propagate(matchlist) {
      for (const matchId of matchlist) {
         if (this._pause) {
            console.log('Pausing crawl')
            return
         }
         
         const region = this.util.getPlatform(matchId)
         const match = await twisted.getMatchInfo(matchId, region)
            .catch(e => console.log(e))

         // Continue/Break on...

         // ...dead match
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
            await this.puuidModel.create({ puuid: puuid })
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