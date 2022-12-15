const twisted = require('twisted')
const api = new twisted.LolApi()

class Twisted {

   static async summonerByNameExample () {
      return await api.Summoner.getByName('Night Owl', twisted.Constants.Regions.AMERICA_NORTH)
   }
   
}

module.exports = { Twisted }