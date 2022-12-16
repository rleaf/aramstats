const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../../riot/twisted_calls')


dotenv.config()

const router = express.Router()

router
   .route('/:region/:summonername')
   .get(async (req, res) => {
      const posts = await loadProfileCollection()
      const test = twisted.summonerByNameExample(req.params.summonername, req.params.region)
      test.then((res) => {
         console.log(res.response)
      })
      
      res.send(await posts.find().toArray());
   })

async function loadProfileCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   return client.db('users').collection('profile')
}

async function writeProfile() {
   const profile = await loadProfileCollection()
   const ins = null
   profile.insertOne()

}

module.exports = router


// router.get('/:summonername', async (req, res) => {
//    const posts = await loadCollection()
//    const summonerName = req.params.summonername
//    const test = twisted.summonerByNameExample()
//    test.then((res) => {
//       console.log(res)
//    })
   
//    res.send(await posts.find().toArray());
//    console.log(summonerName, ' HUH')
// })

// router.post('/', async (req, res) => {
//    const posts = await loadCollection()
//    await posts.insertOne({
//       text: req.body.text
//    })
//    res.status(201).send()
// })

