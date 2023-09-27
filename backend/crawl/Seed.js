const twisted = require('../twisted_calls')
const { matchModel } = require('../models/matches_model')
const puuidModel = require('../models/puuid_model')

const Util = require('./Util')


/* 
   Future Ryan: make it so you can do it for all regions 
   https://developer.riotgames.com/docs/lol#routing-values
      - rate limits are per region (americas, asia, europe, sea)
      - collect puuids on X region and store them in db.puuid_{X}
*/
class Seed {
   constructor() {
      // Penguin
      this.seed = {
         puuid: 'Yw6wO3eFywwOWN3TR6H8vdqNY9cIjKU71L9GD9UXDeauGeyQCx-GIq913rMp3sDOZo522ACt32Crkg',
         region: 'na'
      }
      this.util = new Util()
      this.pause = false // Put this somewhere else?
      this.init()
   }
   
   async init() {
      // this.patch = await this.util.getPatch()
      this.patch = '13.18' // Simulate p13.18 cause p13.19 is out
      this.matchModel = matchModel(this.patch)
      this.matchlist = await twisted.getSummonerMatchesOnPatch(this.seed.puuid, this.seed.region, this.patch)
      

      await this.populate()
   }

   async populate() {
      let i = 0
      for (const matchId of this.matchlist) {

         if (i % 25 === 0) console.log(`Completed ${i}/${this.matchlist.length} matches`)
         i++

         if (this.pause) return
         
         const match = await twisted.getMatchInfo(matchId, this.seed.region)
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

      console.log(`Stored all matches on patch ${this.patch} for seed user.`)
   }
}

module.exports = Seed