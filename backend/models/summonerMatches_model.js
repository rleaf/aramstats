const mongoose = require("mongoose")


/* 
   Match-level data for each champion for every summoner. 
*/
const summonerMatchesSchema = new mongoose.Schema({
   _master: mongoose.SchemaTypes.ObjectId,
   matchId: String,
   gameCreation: Number,
   gameDuration: Number,
   gameVersion: String,
   win: Boolean,
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
      healsOnTeammates: Number,
      gold: Number
   },
   multikills: {
      triple: Number,
      quadra: Number,
      penta: Number,
   }
})

module.exports = mongoose.model('summonerMatches', summonerMatchesSchema)