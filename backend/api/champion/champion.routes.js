const config = require('../../config')
const util = require('./champion')
const idMap = require ('../../constants/idMap')

class ChampionRoutes {
   initRoutes(app) {
      app
         .get(config.CHAMPION_PREFIX, this.getChampion)
         .get(config.CHAMPIONS_LIST_PREFIX, this.getChampionList)
   }

   async getChampion(req, res) {
      const coll = await util.loadChampionStatsCollection()
      const pancakes = (await util.aggregateChampion(coll, idMap[req.params.champion.toLowerCase()]))[0]
      res.send(pancakes)
   }

   async getChampionList(req, res) {
      const coll = await util.loadChampionStatsCollection()
      const pancakes = await coll.find({}, { projection: { _id: 1, games: 1, wins: 1, pickRate: 1 } }).toArray()
      res.send(pancakes)
   }
}

module.exports = new ChampionRoutes()