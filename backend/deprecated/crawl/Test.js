// const testPuuidModel = require('../models/TEST_PUUIDS')
// const testMatchesModel = require('../models/TEST_MATCHIDS')
const twisted = require('../twisted_calls')
const { puuidModel } = require('../models/puuid_model')

class Test {
   constructor() {
     // Pengwings
     this.summ = {
        puuid: '-GFwYATK9tnAurTAzLbXvuerLZFem1z0Ux6aRbAmQZG9COHQjeNwPzyHfqfjYMuElQLnf8MPfJ7paQ',
        region: 'na'
     }
      this.puuidModel = puuidModel('AMERICAS')
      this.terminate = 100
      this.count = 0 // Util
      this.start = 0
      this.patch = '13.19'
      testPuuidModel.syncIndexes()
      testMatchesModel.syncIndexes()
      this.init()
   }

   async init() {
      /* 
         Time took for first 100 puuids for checking redundant matchIds & puuids (m:ss.mmm)
            - findOne({...}) 14:38.341
            - find({...}) 10:43.510
            - exists({...}) 14:40.294 // is findOne under the hood
            - findOneAndUpdate({..}, {..}, {upsert: true}) incomplete
            - unique/insertmany 13:34.618
            - batching -> insertmany with unique 9:59.336
      */

      const puuidList = await this.puuidModel.find({})
      console.time('total')
      for (const doc of puuidList) {
         if (this.count === this.terminate) break
         console.log('on: ', doc.puuid)
         // const matchlist = await twisted.getSummonerMatchesOnPatch(doc.puuid, doc.region, this.patch)
         console.time('*')
         // await this.propagateTest(matchlist)
         await this.bulkPropagate(doc.puuid, this.start)
         console.timeEnd('*')
         this.count++
      }
      console.timeEnd('total')
      
   }

   async bulkPropagate(puuid, start) {
      const matchlist = await twisted.getSummonerMatches(puuid, 'na', start)

      let matchdeck = []
      let puuiddeck = []

      for (let i = 0; i < matchlist.length; i++) {
         const match = await twisted.getMatchInfo(matchlist[i], 'na')
         if (this.patch != match.info.gameVersion.split('.').slice(0, 2).join('.')) {
            console.log('breaking')
            break
         }

         matchdeck.push(match)
         puuiddeck.push(match.metadata.participants)

         if (i === matchlist.length - 1) {
            console.log('getting more matches')
            this.start+= matchlist.length
            this.bulkPropagate(puuid, this.start)
         }
      }

      let toad = puuiddeck.flat().map(el => {
         return { puuid: el}
      })

      try {
         await testMatchesModel.insertMany(matchdeck, { ordered: false })
         await testPuuidModel.insertMany(toad, { ordered: false })         
      } catch {} // Dismiss duplicate key error
   }
   
   async propagateTest(matchlist) {
      for (const datum of matchlist) {
         const match = await twisted.getMatchInfo(datum, 'na')
         if (this.patch != match.info.gameVersion.split('.').slice(0, 2).join('.')) break

         // Redundant match
         // if (await testMatchesModel.exists({ 'metadata.matchId': datum })) continue
         // await testMatchesModel.create({
         //    metadata: match.metadata,
         //    info: match.info
         // })

         try {
            await testMatchesModel.insertMany([{
               metadata: {
                  dataVersion: match.metadata.dataVersion,
                  matchId: match.metadata.matchId,
                  participants: match.metadata.participants
               },
               info: match.info
            }], { ordered: false })
            // testMatchesModel.create({
            //    metadata: {
            //       dataVersion: match.metadata.dataVersion,
            //       matchId: match.metadata.matchId,
            //       participants: match.metadata.participants
            //    },
            //    info: match.info
            // }, { ordered: false })
         } catch { }

         
         // Redundant puuid
         for (const puuid of match.metadata.participants) {
            try {
               await testPuuidModel.insertMany([{ puuid: puuid}], { ordered: false })
               // testPuuidModel.create({ puuid: puuid }, { ordered: false })
            } catch { }
            // if (await testPuuidModel.exists({ 'puuid': puuid})) continue
            // await testPuuidModel.create({ puuid: puuid })
         }
      }
   }           
}

module.exports = Test