const mongoose = require("mongoose")

/* 
   Match-level data for each champion for every summoner. 
*/
const summonerMatchesSchema = new mongoose.Schema({
   m: String,           // master reference to summoner
   mId: String,         // matchId
   gc: Number,          // gameCreation
   gd: Number,          // gameDuration
   gv: String,          // gameVersion
   w: Boolean,          // win
   k: Number,           // kills
   d: Number,           // deaths
   a: Number,           // assists
   kp: Number,          // killParticipation
   ds: Number,          // damageShare
   i: [Number],         // items
   s1: Number,          // summoner1
   s2: Number,          // summoner2
   tsd: Number,          // damage taken
   pr: Number,          // primary rune
   sr: Number,          // secondary rune
   t: {                 // TOTAL
      dtc: Number,      // damage dealt to champions
      dt: Number,       // damage taken
      sm: Number,       // self mitigated
      h: Number,        // heal
      ah: Number,       // allyHeal
      g: Number         // gold
   },
   mk: [0, 0, 0],          // multikills [triple, quad, penta]
   te: [String],           // team encounters
   ee: [String],           // enemy encounters
   tc: [Number],           // team composition
   ec: [Number],           // enemy composition
   tId: Number,            // teamId
})

module.exports = mongoose.model('test_summoner_matches', summonerMatchesSchema)