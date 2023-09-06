const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.DB_CONNECTION_STRING, {dbName: 'aramstats'})

const summoners = require('./routes/summoner')
// const matchInfo = require('./routes/matchInfo')
// const summoners = require('./routes/old/summoners')
// const matchInfo = require('./routes/old/matchInfo')
// // const history = require('./routes/matchHistory')

app.use('/api/summoners', summoners)
// app.use('/api/matchInfo', matchInfo)
// app.use('/api/history', history)

// app.use(express.static(__dirname + '/public/'))
// app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
// if(process.env.NODE_ENV === 'production') {
// }


const port = process.env.PORT || 5000

app.listen(port, () => {
   console.log(`Server started on ${port}`)
})
