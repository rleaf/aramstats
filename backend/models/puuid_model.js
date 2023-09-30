const mongoose = require("mongoose")

/* 
   Dynamically set the collection name
*/
const puuidModel = (region) => {
   const puuidSchema = new mongoose.Schema({
      puuid: { type: String, unique: true},
      region: String
   }, { versionKey: false })

   return mongoose.model(region + '_puuids', puuidSchema)
}

module.exports = { puuidModel }