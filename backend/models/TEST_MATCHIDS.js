const mongoose = require('mongoose')

testSchema = new mongoose.Schema({
   metadata: {
      dataVersion: String,
      matchId: { type: String, unique: true},
      participants: [String]
   },
   info: Object
}, { versionKey: false })

module.exports = mongoose.model('test2', testSchema)