const mongoose = require("mongoose")

/* 
   Dynamically set the collection name
*/
const puuidModel = (region) => {
   const puuidSchema = new mongoose.Schema({
      puuid: String,
      region: String
   }, { versionKey: false })

   return mongoose.model('puuids_' + region, puuidSchema)
}

module.exports = { puuidModel }