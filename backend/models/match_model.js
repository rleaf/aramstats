const mongoose = require("mongoose")

const matchSchema = new mongoose.Schema({
   matchId: String,
   gameCreation: Number,
   gameDuration: Number,
   gameVersion: String,
   win: Number,
   kills: Number,
   deaths: Number,
   assists: Number,
   killParticipation: Number,
   damageShare: Number,
   items: [Number],
   summoner1Id: Number,
   summoner2Id: Number,
   primaryRune: Number,
   secondaryRune: Number,
   totals: {
      damageDealtToChampions: Number,
      damageTaken: Number,
      selfMitigated: Number,
      healed: Number,
      HealsOnTeammates: Number,
      gold: Number
   },
   multikills: {
      triple: Number,
      quadra: Number,
      penta: Number,
   }
})

module.exports = mongoose.model('matches', matchSchema)