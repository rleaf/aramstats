const mongoose = require('mongoose')

testSchema = new mongoose.Schema({
   puuid: { type: String, unique: true },
   // puuid: { type: String },
}, { versionKey: false })

module.exports = mongoose.model('testdd', testSchema)