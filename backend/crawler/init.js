let instance = null

export default class Crawler {
   constructor(_something) {

      if (instance) return instance

      instance = this

      /* 
      0. See if API key is being used by a user and halt crawl or
         when API key is not under use, resume crawl

      **Crawling**
      1. Get matchlist from SEED user
      1.1 Get most recent patch (ddragon?)
      2. For matches in matchlist
         2.0 If match not on most recent patch, break
         2.1 *push *unique* puuids to db.puuids
         2.2 push matchdata to db.matches
      3. For puuid in db.puuids
         3.1 get puuid matchlist
         3.2 *Remove duplicate matches
         3.3 For match in matchlist
            3.30 If match not on most recent patch, break
            3.31 push *unique* puuids to db.puuids
            3.32 push *unique* matchdata to db.matches

      **Updating**
      1. For puuid in db.puuids
         1.1 get puuid matchlist
         1.1 Find recent matches. For recent matches
            1.11 push *unique* puuids to db.puuids
            1.12 push *unique* matchdata to db.matches

      Call update step every day/couple days to get new match data.
      */
   }
}