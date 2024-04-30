const mongoose = require('mongoose')

const spellSchema = new mongoose.Schema({
   _id: false,
   games: { type: Number, default: 0 },
   casts: { type: Number, default: 0 },
}, { versionKey: false })

module.exports = spellSchema