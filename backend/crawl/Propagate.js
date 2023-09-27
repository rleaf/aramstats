const twisted = require('../twisted_calls')
const { matchModel } = require('../models/matches_model')
const { puuidModel } = require('../models/puuid_model')

const Util = require('./Util')

class Propagate {
   constructor() {

      this.util = new Util()
      this.init()
   }
   
   async init() {
      this.patch = await this.util.getPatch()
      this.regionGroups = ['AMERICAS', 'EUROPE', 'ASIA', 'SEA']
      this.matchModel = matchModel(this.patch)
      this.puuidModel = puuidModel(this.regionGroups[0]) // Fire crawler on 1, 2, 3

      for (const doc of await this.puuidModel.find({})) {
         // console.log(doc.puuid)
         const matchlist = await twisted.getSummonerMatchesOnPatch(doc.puuid, doc.region, this.patch)
         console.log(matchlist[0], matchlist[matchlist.length - 1])
         await this.propagate(matchlist)
      }

   }

   async propagate(matchlist) {
      for (const matchId of matchlist) {
         console.log(`starting ${matchId}`)
         
         if (this.pause) return
         
         const region = this.util.getPlatform(matchId)
         const match = await twisted.getMatchInfo(matchId, region)
            .catch(e => console.log(e))

         // Continue/Break on...

         // ...dead match
         if (!match.info.gameDuration) continue
         
         // ...old patch
         if (this.patch != match.info.gameVersion.split('.').slice(0, 2).join('.')) {
            console.log(this.patch, match.info.gameVersion.split('.').slice(0, 2).join('.'))
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
}

module.exports = Propagate