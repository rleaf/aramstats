const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const summonerRoutes = require('./api/summoner/summoner.routes')
const championRoutes = require('./api/champion/champion.routes')
const matchRoutes = require('./api/match/match.routes')

class Server {
   constructor() {
      dotenv.config()

      this.app = express()
      this.app.use(bodyParser.json())
      this.app.use(cors())

      this.initRoutes()
      this.startServer()
   }

   initRoutes() {
      summonerRoutes.initRoutes(this.app)
      championRoutes.initRoutes(this.app)
   }

   startServer() {
      // Connect to database
      try {
         mongoose.connect(process.env.DB_CONNECTION_STRING, { dbName: 'aramstats' })
      } catch (e) {
         console.log('pancakes')
         throw new Error(e instanceof Error ? e.message : e)
      }

      // Setup & start server
      if (process.env.NODE_ENV === 'dev') {
         this.server = http.createServer(this.app)
      }

      if (process.env.NODE_ENV === 'production') {
         http.createServer(this.app).listen(80)
         this.app.enable('trust proxy')
         this.app.use((req, res, next) => {
            req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
         })

         this.app.use(express.static(__dirname + '/public/'))
         this.app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))

         this.server = https.createServer({
            key: fs.readFileSync('/etc/letsencrypt/live/www.aramstats.lol/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/www.aramstats.lol/fullchain.pem')
         }, this.app)
      }

      const port = process.env.PORT || 5000
      this.server.listen(port, () => console.log(`Server started on ${port}`))
   }
}

(() => new Server())()