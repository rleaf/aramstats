const mongoose = require("mongoose")

const summonerSchema = new mongoose.Schema({
   puuid: String,
   name: String,
   region: String,
   profileIcon: Number,
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
   championData: [
      {
         _id: false,
         name: String,
         wins: { type: Number, default: 0 },
         games: { type: Number, default: 0 },
         averages: {
            allyHealPerMinute: { type: Number, default: 0 },
            assists: { type: Number, default: 0 },
            damagePerMinute: { type: Number, default: 0 },
            damageShare: { type: Number, default: 0 },
            damageTakenPerMinute: { type: Number, default: 0 },
            deaths: { type: Number, default: 0 },
            goldEarned: { type: Number, default: 0 },
            goldPerMinute: { type: Number, default: 0 },
            healingPerMinute: { type: Number, default: 0 },
            healingOnTeammates: { type: Number, default: 0 },
            killParticipation: { type: Number, default: 0 },
            kills: { type: Number, default: 0 },
            selfMitigatedPerMinute: { type: Number, default: 0 },
            totalDamageDealt: { type: Number, default: 0 },
            totalDamageTaken: { type: Number, default: 0 },
            totalHeal: { type: Number, default: 0 },
            totalSelfMitigated: { type: Number, default: 0 }
         },
         multikills: {
            triple: { type: Number, default: 0 },
            quadra: { type: Number, default: 0 },
            penta: { type: Number, default: 0 }
         },
         matches: [mongoose.SchemaTypes.ObjectId]
      }
   ]

})

module.exports = mongoose.model('summoners', summonerSchema)