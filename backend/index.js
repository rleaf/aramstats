const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// const queue = require('express-queue')

const app = express()

app.use(bodyParser.json())
app.use(cors())

// const queueMw = queue({ activeLimit: 1, queuedLimit: -1})
// app.use(queueMw)


const summoners = require('./routes/api/summoners')

app.use('/api/summoners', summoners)
// console.log(`queueLength: ${queueMw.queue.getLength()}`)

if(process.env.NODE_ENV === 'production') {
   app.use(express.static(__dirname + '/public/'))

   app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}


const port = process.env.PORT || 5000

app.listen(port, () => {
   console.log(`Server started on ${port}`)
})
