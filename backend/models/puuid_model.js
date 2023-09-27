const mongoose = require("mongoose")

const puuidSchema = new mongoose.Schema({
   puuid: String,
   region: String
}, { versionKey: false})

module.exports = mongoose.model('puuids', puuidSchema)

/* 
   Dynamically set the collection name, matches_PATCH (matches_13.18).
*/
// const puuidModel = (region) => {
//    const puuidSchema = new mongoose.Schema({
//       metadata: Object,
//       info: Object
//    })

//    return mongoose.model('puuids_' + region, matchesSchema)
// }

// module.exports = { puuidModel }