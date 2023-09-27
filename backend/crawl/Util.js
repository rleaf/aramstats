const axios = require('axios')

class Util {
   
   async getPatch() {
      const url = 'https://ddragon.leagueoflegends.com/api/versions.json'
      return (await axios.get(url)).data[0].split('.').slice(0, 2).join('.')
   }

}

module.exports = Util