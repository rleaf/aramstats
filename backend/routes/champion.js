const express = require('express')
const twisted = require('../twisted_calls')

const router = express.Router()

router.get('/:champion', async (req, res) => {
   res.send(req.params.champion)
})

module.exports = router