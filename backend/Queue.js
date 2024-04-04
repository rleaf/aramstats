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
            required: [ 'qPuuid', 'region', 'position' ],
            properties: {
               qPuuid: { bsonType: 'string' },
               region: { bsonType: 'string' },
               position: { bsonType: 'int' }
            }
         }
         await this.db.createCollection(this.name, { validator: { $jsonSchema } })
         await this.db.collection(this.name).createIndex('qPuuid')
      }
      
      this.collection = await this.db.collection(this.name)
      await this.establishMeta()
   }
   
   async establishMeta() {
      this.metaCollection = await this.db.collection('meta')
      const metaDoc = await this.metaCollection.findOne({ _id: 'queue' })
      if (!metaDoc) {

         const schema = {
            '_id': 'queue',
            'na': 0,
            'euw': 0,
            'eune': 0,
            'kr': 0,
            'lan': 0,
            'las': 0,
            'oce': 0,
            'tr': 0,
            'ru': 0,
            'jp': 0,
            'br': 0,
            'vn': 0,
            'tw': 0,
            'th': 0,
            'sg': 0,
            'ph': 0
         }

         this.metaCollection.insertOne(schema)
      }
   }

   /**
    * Gets the proceeding summoner in the queue
    * @param region Summoner Region
   */
   async get(region) {
      let nextInQueue
      try {
         nextInQueue = (await this.collection.findOneAndDelete({ region: region }, { sort: { _id: 1 }, projection: { _id: 0, qPuuid: 1 } })).value
      } catch (e) {
         if (e instanceof mongodb.MongoServerError) throw e
      }
      if (nextInQueue) {
         await this.metaCollection.updateOne({ _id: 'queue' }, { $inc: { [region]: -1 } })
         return nextInQueue
      }
   }
   
   /**
    * Updates queue members position
    * @param region Summoner Region
   */
   async update(region) {
      try {
         await this.collection.updateMany({ region: region }, { $inc: { position: -1 } })
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
         const idx = (await this.metaCollection.findOneAndUpdate({ _id: 'queue' }, { $inc: { [region]: 1 } }, { projection: { _id: 0, [region]: 1 } })).value[region]
         await this.collection.insertOne({ qPuuid: puuid, region: region, position: idx + 1 })
      } catch (e) {
         if (e instanceof mongodb.MongoServerError) throw e
      }
   }

   /**
    * Check to see if summoner exists in the queue
    * @param puuid Summoner PUUID
   */
   async check(puuid) {
      let position 

      await this.collection.findOne({ qPuuid: puuid })
         .then(res => position = res.position)
         .catch(e => (e instanceof mongodb.MongoServerError) ? e : null)

      return position
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
    * Gets the queue length stored in the meta collection for a corresponding region.
    * @param region Specified region to count
   */
   async regionCount(region) {
      try {
         return await this.metaCollection.findOne({ _id: 'queue' }, { projection: { [region]: 1 } })
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