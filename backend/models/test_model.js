const mongoose = require('mongoose')

testSchema = new mongoose.Schema({
   field: { type: String, unique: true }
}, { versionKey: false })

module.exports = mongoose.model('test', testSchema)