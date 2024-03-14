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
   s1c: Number,         // summoner1 casts
   s2: Number,          // summoner2
   s2c: Number,         // summoner2 casts
   sc: [Number],        // spell casts
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
   mk: {                // MULTIKILL
      t: Number,        // triples
      q: Number,        // quads
      p: Number,        // pentas
   },
   te: [],              // team encounters
   ee: [],              // enemy encounters
   tId: Number,         // teamId
   fba: Boolean,        // first blood assist
   fbk: Boolean,        // first blood kill
   tk: Number,         // turrets killed
   tl: Number,         // turrets lost
   p: {                 // PINGS
      all: Number,      // all in
      assist: Number,   // assist me
      bait: Number,     // bait
      basic: Number,    // bait
      comm: Number,     // command
      danger: Number,   // danger
      enMiss: Number,   // enemy missing
      enVis: Number,    // enemy vision
      back: Number,     // get back
      hold: Number,     // hold
      vis: Number,      // need vision
      omw: Number,      // on my way
      push: Number,     // push
      visClr: Number,   // vision clear
   }
})

module.exports = mongoose.model('summoner_matches_TEST', summonerMatchesSchema)