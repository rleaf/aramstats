const mongoose = require("mongoose")
const championEmbedSchema = require("./championEmbed")

const summonerSchema = new mongoose.Schema({
   _id: String, // Summoner puuid
   gameName: String,
   tagLine: String,
   level: Number,
   region: String,
   profileIcon: Number,
   updated: { type: Date },
   pull: {
      active: Boolean,
      current: Number,
      queue: Number,
      lastMatchId: String,
   },
   challenges: [
      {
         _id: false,
         challengeId: Number,
         percentile: Number,
         level: String,
         value: Number,
         achievedTime: Number
      }
   ],
   championData: [championEmbedSchema]
})

module.exports = mongoose.model('test_summoners', summonerSchema)