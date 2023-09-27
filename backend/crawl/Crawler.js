const Seed = require('./Seed')
const Propagate = require('./Propagate')

let instance = null

class Crawler {
   constructor() {

      if (instance) return instance
      instance = this

      /* 
      0. See if API key is being used by a user and halt crawl or
         when API key is not under use, resume crawl

      new Seed()
      """
      Fired once to seed the crawl. Inits & populates both db.puuids and db.matches_{patch}
      using match-v5 and a puuid
      """
      1. Get matchlist from SEED user
      1.1 Get most recent patch (ddragon?)
      2. For matches in matchlist
         2.0 If match not on most recent patch, break
         2.1 push *unique* puuids to db.puuids
         2.2 push matchdata to db.matches

      new Propagate()
      """
      Fired whenever (daily?) to increase db.puuid and db.matches_{patch}. Iterates through
      db.puuid and checks for unique matches & summoners to write to corresponding collection.
      """
      1. For puuid in db.puuids
         1.1 get puuid matchlist
         1.1 For match in matchlist until redundant match
            1.11 push *unique* puuids to db.puuids
            1.12 push *unique* matchdata to db.matches
      */

      // this.seed = new Seed()
      // this.propagate = new Propagate()
   }

   stop() {

   }

   resume() {
      
   }
}

module.exports = Crawler