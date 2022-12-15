const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')

dotenv.config()

const router = express.Router()

router.get('/', async (req, res) => {
   const posts = await loadCollection()
   res.send(await posts.find({}).toArray());
})

router.post('/', async (req, res) => {
   const posts = await loadCollection()
   await posts.insertOne({
      text: req.body.text
   })
   res.status(201).send()
})

async function loadCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   return client.db('test').collection('sales')
}

module.exports = router