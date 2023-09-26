const mongoose = require("mongoose")

/* 
   Dynamically set the collection name, matches_PATCH (matches_13.18).
*/
const matchModel = (patch) => {
   const matchesSchema = new mongoose.Schema({
      metadata: Object,
      info: Object
   })

   return mongoose.model('matches_' + patch, matchesSchema)
}

module.exports = { matchModel }