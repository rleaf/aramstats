const express = require('express')
const dotenv = require('dotenv')
const twisted = require('../twisted_calls')

dotenv.config()

const router = express.Router()

router.get('/:region/:summonerURI', async (req, res) => {
   const history = await twisted.getSummonerMatches(req.params.summonerURI, req.params.region)
   res.send(history)
})

module.exports = router