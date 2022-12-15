const twisted = require('./twisted_calls')

const test = twisted.Twisted.summonerByNameExample()

test.then((res) => {
      console.log(res)
   })