const mongoose = require("mongoose")

const summonerSchema = new mongoose.Schema({
   puuid: String,
   name: String,
   profileIcon: Number,
   pull: {
      active: Boolean,
      current: Number,
      ceiling: Number
   },
   challenges: [
      {
         challengeId: Number,
         percentile: Number,
         level: String,
         value: Number,
         achievedTime: Number
      }
   ],
   championData: [
      {
         name: String,
         games: Number,
         averages: {
            allyHealPerMinute: Number,
            assists: Number,
            damagePerMinute: Number,
            damageShare: Number,
            damageTakenPerMinute: Number,
            deaths: Number,
            goldEarned: Number,
            goldPerMinute: Number,
            healingOnTeammates: Number,
            killParticipation: Number,
            kills: Number,
            selfMitigatedPerMinute: Number,
            totalDamageDealt: Number,
            totalDamageTaken: Number,
            totalHeal: Number,
            totalSelfMitigated: Number,
         },
         multikills: {
            triple: Number,
            quadra: Number,
            penta: Number,
         },
         matches: [mongoose.SchemaTypes.ObjectId]
      }
   ]

})

module.exports = mongoose.model('summoners', summonerSchema)