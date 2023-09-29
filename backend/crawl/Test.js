const testModel = require('../models/test_model')
const twisted = require('../twisted_calls')
const { puuidModel } = require('../models/puuid_model')

class Test {
   constructor() {
      console.log(toads)
      asdlfasd;f
      /* 
      * When not tired, speed check exists() against unique ID against find()
      */
      this.data = ['1', '1', '1', '2', '2', '3']
      this.puuidModel = puuidModel('AMERICAS')
      // this.init()
      testModel.syncIndexes()
   }

   async init() {
      // if (await testModel.exists({ field: '4' })) {
      //    console.log('exists')
      // } else {
      //    console.log('DNE')
      // }

      let puuidList = await this.puuidModel.find({})

      for (const doc of puuidList) {
         console.log('on: ', doc.puuid)
         const matchlist = await twisted.getSummonerMatchesOnPatch(doc.puuid, doc.region, this.patch)
         await this.propagate(matchlist)
         if (this.docIndex % 25 === 0) {
            console.log(`On puuid index ${this.docIndex + this.startIndex}`)
         }
      }

      for (const datum of this.data) {
         try {
            await testModel.create({ field: datum })
         } catch (e) {
            console.log(`already have ${datum}`)
            continue
         }
      }
   }
}

module.exports = Test