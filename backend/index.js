const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Crawler = require('./crawler/Crawler')

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.DB_CONNECTION_STRING, {dbName: 'aramstats'})
// const crawler = new Crawler()

const summoners = require('./routes/summoner')
const matchInfo = require('./routes/matchInfo')

app.use('/api/summoners', summoners)
app.use('/api/matchInfo', matchInfo)
// app.use('/api/history', history)

let server

if (process.env.NODE_ENV === 'dev') {
   server = http.createServer(app)
}

if (process.env.NODE_ENV === 'production') {
   http.createServer(app).listen(80)
   app.enable('trust proxy')
   app.use((req, res, next) => {
      req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
   })

   app.use(express.static(__dirname + '/public/'))
   app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))

   server = https.createServer({
      key: fs.readFileSync('/etc/letsencrypt/live/www.aramstats.lol/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/www.aramstats.lol/fullchain.pem')
   }, app)
}

const port = process.env.PORT || 5000

server.listen(port, () => console.log(`Server started on ${port}`))