// const mongoose = require("mongoose")

// /* 
//    Dynamically set the collection name
// */
// const matchModel = (patch) => {
//    const matchesSchema = new mongoose.Schema({
//       metadata: {
//          dataVersion: String,
//          matchId: { type: String, unique: true },
//          participants: [String]
//       },
//       info: Object
//    }, { versionKey: false})

//    return mongoose.model('matches_' + patch, matchesSchema)
// }

// module.exports = { matchModel }