const express = require('express')
const twisted = require('../../twisted_calls')

const router = express.Router()

router.get('/:region/:matchId', async (req, res) => {
   const data = await twisted.getMatchInfo(req.params.matchId, req.params.region)
   res.send(data)
})

module.exports = router