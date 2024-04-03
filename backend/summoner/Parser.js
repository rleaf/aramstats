const util = require('../api/summoner/summoner')
const Queue = require('../Queue')
const { MongoClient } = require('mongodb')
const dotenv = require('dotenv')

class Parser {
   constructor() {
      
      dotenv.config()
      this.initDatabaseConnection()
      this.queue = new Queue(this.db)
   }

   initDatabaseConnection() {
      this.db = new MongoClient(process.env.DB_CONNECTION_STRING).db('aramstats')
      // this.meta = this.db.collection('meta')
   }
   
   async check(rg) {
      if (await this.queue.regionCount(rg) > 0) {
         const summoner = this.queue.get(rg)
      }
   } 
}

(() => new Parser())()