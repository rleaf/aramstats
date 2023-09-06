const mongoose = require("mongoose")

const matchSchema = new mongoose.Schema({
   matchId: String,
   gameCreation: Number,
   gameDuration: Number,
   gameVersion: String,
   // fin this
})

module.exports = mongoose.model('matches', matchSchema)