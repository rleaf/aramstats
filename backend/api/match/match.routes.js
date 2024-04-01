const config = require('../../config')
const util = require('./match')

class MatchRoutes {
   initRoutes(app) {
      app
         .get(config.MATCH_PREFIX, this.getMatch)
         .get(config.MATCH_HISTORY_PREFIX, this.getMatchHistory)
   }

   async getMatch(req, res) {

   }

   async getMatchHistory(req, res) {
      
   }
}

module.exports = new MatchRoutes()