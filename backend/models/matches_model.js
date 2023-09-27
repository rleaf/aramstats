const mongoose = require("mongoose")

/* 
   Dynamically set the collection name
*/
const matchModel = (patch) => {
   const matchesSchema = new mongoose.Schema({
      metadata: Object,
      info: Object
   })

   return mongoose.model('matches_' + patch, matchesSchema)
}

module.exports = { matchModel }