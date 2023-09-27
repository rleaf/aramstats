const twisted = require('../twisted_calls')
const { matchModel } = require('../models/matches_model')
const puuidModel = require('../models/puuid_model')

const Util = require('./Util')

class Propagate {
   constructor() {

      this.util = new Util()
      this.init()
   }
   
   async init() {
      this.patch = await this.util.getPatch()
      // this.patch = '13.18'
      this.matchModel = matchModel(this.patch)
      this.region = 'na' // fix twisted pls

      for (const doc of await puuidModel.find({})) {
         console.log(doc.puuid)
         const matchlist = await twisted.getSummonerMatchesOnPatch(doc.puuid, this.region, this.patch)
         await this.propagate(matchlist)
      }
   }

   async propagate(matchlist) {
      for (const matchId of matchlist) {
         console.log(matchId)

         if (this.pause) return

         const match = await twisted.getMatchInfo(matchId, this.region)
         if (this.patch != match.info.gameVersion.split('.').slice(0, 2).join('.')) break

         for (const puuid of match.metadata.participants) {
            if (await puuidModel.findOne({ puuid: puuid })) continue
            await puuidModel.create({ puuid: puuid })
         }

         if (await this.matchModel.findOne({ 'metadata.matchId': matchId})) continue
         await this.matchModel.create({
            metadata: match.metadata,
            info: match.info
         })

      }
   }
}

module.exports = Propagate