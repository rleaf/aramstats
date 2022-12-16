const twisted = require('./twisted_calls')

const test = twisted.summonerByNameExample()

test.then((res) => {
      console.log(res.response.puuid)
   })