const mongodb = require('mongodb')

class Queue {
   constructor(db) {
      this.name = 'queue'
      this.inactiveRegions = new Set([
         'na',
         'euw',
         'eune',
         'kr',
         'lan',
         'las',
         'oce',
         'tr',
         'ru',
         'jp',
         'br',
         'vn',
         'tw',
         'th',
         'sg',
         'ph',
      ])
      this.db = db
      this.initCollection()
   }
   
   async initCollection() {
      const queueCollection = await this.db.listCollections({ name: this.name }, { nameOnly: true }).toArray()
      if (!queueCollection.length) {
         const $jsonSchema = {
            bsonType: 'object',
            required: [ 'qPuuid', 'region' ],
            properties: {
               qPuuid: { bsonType: 'string' },
               region: { bsonType: 'string' }
            }
         }

         await this.db.createCollection(this.name, { validator: { $jsonSchema } })
      }

      this.collection = await this.db.collection(this.name)
   }

   /**
    * Gets the proceeding summoner in the queue
    * @param region Summoner Region
   */
   async get(region) {
      try {
         return (await this.collection.findOneAndDelete({ region: region }, { sort: { _id: 1 }, projection: { _id: 0, qPuuid: 1 } })).value
      } catch (e) {
         if (e instanceof mongodb.MongoServerError) throw e
      }
   }

   /**
    * Adds a summoner to the end of the queue
    * @param puuid Summoner PUUID
    * @param region Summoner Region
   */
   async add(puuid, region) {
      try {
         await this.collection.insertOne({ qPuuid: puuid, region: region })
      } catch (e) {
         if (e instanceof mongodb.MongoServerError) throw e
      }
   }

   /**
    * Deletes a summoner from the queue
    * @param puuid Summoner PUUID
    * @param region Summoner Region
   */
   async remove(puuid) {
      this.collection.deleteOne({ puuid: puuid })
   }
   
   /**
    * Counts the number of summoners in the queue
   */
   async count() {
      try {
         return await this.collection.countDocuments()
      } catch (e) {
         if (e instanceof mongodb.MongoServerError) throw e
      }
   }

   /**
    * Counts the number of summoners from a region in the queue
    * @param region Specified region to count
   */
   async regionCount(region) {
      try {
         return await this.collection.countDocuments({ region: region })
      } catch (e) {
         if (e instanceof mongodb.MongoServerError) throw e
      }
   }

   /**
    * Deletes all summoners in the queue
   */
   async purge() {
      try {
         await this.collection.deleteMany({})
      } catch (e) {
         if (e instanceof mongodb.MongoServerError) throw e
      }
   }
}

module.exports = Queue