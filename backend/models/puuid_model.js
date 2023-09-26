const mongoose = require("mongoose")

const puuidSchema = new mongoose.Schema({
   puuid: String
}, { versionKey: false})

module.exports = mongoose.model('puuids', puuidSchema)