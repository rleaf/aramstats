const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(cors())


const summoners = require('./routes/old/summoners')
const matchInfo = require('./routes/old/matchInfo')
// const history = require('./routes/matchHistory')

app.use('/api/summoners', summoners)
app.use('/api/matchInfo', matchInfo)
// app.use('/api/history', history)

// app.use(express.static(__dirname + '/public/'))
// app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
// if(process.env.NODE_ENV === 'production') {
// }


const port = process.env.PORT || 5000

app.listen(port, () => {
   console.log(`Server started on ${port}`)
})
