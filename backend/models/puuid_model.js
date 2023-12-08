const mongoose = require("mongoose")

/* 
   Dynamically set the collection name
*/
const puuidSchema = new mongoose.Schema({
   _id: String,
   gn: String,
   tl: String,
   name: String,
}, { versionKey: false })

module.exports = mongoose.model('summoner_puuid', puuidSchema)