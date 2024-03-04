const mongoose = require("mongoose")

const summonerSchema = new mongoose.Schema({
   // puuid: String,
   _id: String, // Summoner puuid
   gameName: String,
   tagLine: String,
   name: String, // Slowly being removed
   level: Number,
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
         championId: Number,
         wins: { type: Number, default: 0 },
         games: { type: Number, default: 0 },
         avg: {
            ahpm: { type: Number, default: 0 }, // allyHeal per minute
            a: { type: Number, default: 0 },    // assists
            dpm: { type: Number, default: 0 },  // damage per minute
            ds: { type: Number, default: 0 },   // damage share
            dtpm: { type: Number, default: 0 }, // damage taken per minute
            d: { type: Number, default: 0 },    // deaths
            ge: { type: Number, default: 0 },   // gold earned
            gpm: { type: Number, default: 0 },  // gold per minute
            hpm: { type: Number, default: 0 },  // heal per minute
            ah: { type: Number, default: 0 },   // allyHeal
            kp: { type: Number, default: 0 },   // kill participation
            k: { type: Number, default: 0 },    // kills
            smpm: { type: Number, default: 0 }, // self mitigated per minute
            tdd: { type: Number, default: 0 },  // total damage dealt
            tdt: { type: Number, default: 0 },  // total damage taken
            th: { type: Number, default: 0 },   // total heal
            tsm: { type: Number, default: 0 }   // total self mitigated
         },
         mk: {
            t: { type: Number, default: 0 },    // triples
            q: { type: Number, default: 0 },    // quads
            p: { type: Number, default: 0 }     // pentas
         },
         matches: [mongoose.SchemaTypes.ObjectId]
      }
   ]
})

module.exports = mongoose.model('summoners', summonerSchema)