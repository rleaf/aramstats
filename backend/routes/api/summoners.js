// Hello read this :)
// Iteratively pull oldest match to newest match. How does the 'start' query work.
//       > When Searching
//   1. Enter input
//   2. Check if input is valid syntax
//   3. Check if input is existing summonerName
//   4. Make request to Riot API to pull summonerName
//   5. Write pull to MongoDB
//   6. Read from MongoDB

// > Best way to access data from DB?
//   1. Check if data exists on DB first
//   2. If exists, render data
//   3. If does not exist, submit api reqs to Riot API to populate
//   4. Have to have option to manually resubmit reqs to Riot API

const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const twisted = require('../../riot/twisted_calls')


dotenv.config()

const router = express.Router()

router
   .route('/:region/:summonername')
   .get(async (req, res) => {
      const client = await loadSummonerCollection()

      // !!!!!!!!!!!!!
      // Work on error handling if a summoner DNE
      const HUH = twisted.getSummoner('eoaiofids', 'na')
      HUH.then((res) => {
         console.log('res', res)
      })
      // Find Summoner in Collection & check if exists
      const summoner = await findSummoner(client, req.params.summonername, req.params.region)
      
      // const matchHistory = twisted.getMatchHistory(req.params.summonername, req.params.region)
      // matchHistory.then((res) => {
      //    console.log(res)
      // })

      // twisted.getMatchId()
      // console.log(await summoner)

      // res.send(await summoner.find().toArray());
      res.send(await summoner)
   })

async function loadSummonerCollection() {
   const client = await mongodb.MongoClient.connect(process.env.DB_CONNECTION_STRING)
   return client.db('users').collection('summoner')
}

async function findSummoner(client, summoner, region) {
   const result = await client.findOne({name: summoner})
   
   if (result) {
      console.log(`${summoner} already exists in database.`)
      return result
   } else {
      console.log(`Checking if ${summoner} exists on Riot.`)
      const getSummoner = twisted.getSummoner(summoner, region)

      if (getSummoner) {
         getSummoner.then((res) => {
               console.log(`Summoner exists. Adding ${res.name} to database.`)
               client.insertOne(res)
               return res
            })
      } else {
         return 'DNE'
      }
   }
}

async function deleteSummoner(client, summoner) {
   await client.deleteMany({ name: summoner })
   console.log('deleted');
}

async function pullSummoner(client, summoner, region) {
   // twisted.getSummoner(summoner, region) {}
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

