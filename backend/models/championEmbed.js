const mongoose = require('mongoose')
const spellSchema = require('./summonerSpell_model')

const championEmbedSchema = new mongoose.Schema({
   _id: false,
   name: String,
   championId: Number,
   wins: { type: Number, default: 0 },         // wins
   games: { type: Number, default: 0 },        // games
   tg: { type: Number, default: 0 },           // turrets gained
   tl: { type: Number, default: 0 },           // turrets lost
   fbk: { type: Number, default: 0 },          // first blood kill
   rw: { type: Number, default: 0 },           // red side wins
   bw: { type: Number, default: 0 },           // blue side wins
   tf: {
      exp: { type: Number, default: 0 },       // expectation
      cap: { type: Number, default: 0 },       // capitalization
      use: { type: Number, default: 0 },       // usefullness
      part: { type: Number, default: 0 },      // participation
      freq: { type: Number, default: 0 },      // frequency
   },
   mk: {                                       // multikills
      t: { type: Number, default: 0 },         // triple
      q: { type: Number, default: 0 },         // quadra
      p: { type: Number, default: 0 },         // penta
   },                              
   sc: {                                       // spell casts
      q: { type: Number, default: 0 },         // q
      w: { type: Number, default: 0 },         // w 
      e: { type: Number, default: 0 },         // e
      r: { type: Number, default: 0 },         // r
   },                           
   ss: {                                       // summoner spells [games, casts]
      1: { type: spellSchema, default: {} },   // cleanse
      3: { type: spellSchema, default: {} },   // exhaust
      4: { type: spellSchema, default: {} },   // flash
      6: { type: spellSchema, default: {} },   // ghost
      7: { type: spellSchema, default: {} },   // heal
      13: { type: spellSchema, default: {} },  // clarity
      14: { type: spellSchema, default: {} },  // ignite
      21: { type: spellSchema, default: {} },  // barrier
      32: { type: spellSchema, default: {} },  // mark
   },
   avg: {
      ahpm: { type: Number, default: 0 },      // allyHeal per minute
      a: { type: Number, default: 0 },         // assists
      dpm: { type: Number, default: 0 },       // damage per minute
      ds: { type: Number, default: 0 },        // damage share
      dtpm: { type: Number, default: 0 },      // damage taken per minute
      d: { type: Number, default: 0 },         // deaths
      ge: { type: Number, default: 0 },        // gold earned
      gpm: { type: Number, default: 0 },       // gold per minute
      hpm: { type: Number, default: 0 },       // heal per minute
      ah: { type: Number, default: 0 },        // allyHeal
      kp: { type: Number, default: 0 },        // kill participation
      k: { type: Number, default: 0 },         // kills
      smpm: { type: Number, default: 0 },      // self mitigated per minute
      tdd: { type: Number, default: 0 },       // total damage dealt
      tdt: { type: Number, default: 0 },       // total damage taken
      th: { type: Number, default: 0 },        // total heal
      tsm: { type: Number, default: 0 }        // total self mitigated
   },
   matches: [mongoose.SchemaTypes.ObjectId],
   p: {                 // PINGS
      all: { type: Number, default: 0 },       // all in
      assist: { type: Number, default: 0 },    // assist me
      basic: { type: Number, default: 0 },     // bait
      comm: { type: Number, default: 0 },      // command
      danger: { type: Number, default: 0 },    // danger
      enMiss: { type: Number, default: 0 },    // enemy missing
      enVis: { type: Number, default: 0 },     // enemy vision
      back: { type: Number, default: 0 },      // get back
      hold: { type: Number, default: 0 },      // hold
      vis: { type: Number, default: 0 },       // need vision
      omw: { type: Number, default: 0 },       // on my way
      push: { type: Number, default: 0 },      // push
      visClr: { type: Number, default: 0 },    // vision clear
   }
}, { versionKey: false })

module.exports = championEmbedSchema