const mongoose = require("mongoose")
const championEmbedSchema = require("./championEmbed")

const queueSchema = new mongoose.Schema({
   current: { type: Number, default: 0 },
   total: { type: Number, default: 0 },
})

const challengeSchema = new mongoose.Schema({
   _id: false,
   challengeId: Number,
   percentile: Number,
   level: String,
   value: Number,
   achievedTime: Number
})

const summonerSchema = new mongoose.Schema({
   _id: String, // Summoner puuid
   gameName: String,
   tagLine: String,
   level: Number,
   region: String,
   profileIcon: Number,
   fountainSitter: { type: Number, default: 0 },
   updated: { type: Date },
   parse: {
      current: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
   },
   queue: {
      current: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
   },
   lastMatchId: { type: String, default: '' },
   challenges: [challengeSchema],
   championData: [championEmbedSchema]
}, { versionKey: false })

module.exports = mongoose.model('test_summoners', summonerSchema)