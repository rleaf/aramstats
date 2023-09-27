const axios = require('axios')

class Util {
   constructor() {
      this.regions = {
         'BR1': 'br',
         'EUN1': 'eune',
         'EUW1': 'euw',
         'KR': 'kr',
         'LA1': 'lan',
         'LA2': 'las',
         'NA1': 'na',
         'OC1': 'oce',
         'TR1': 'tr',
         'RU': 'ru',
         'JP1': 'jp',
         'VN2': 'vn',
         'TW2': 'tw',
         'TH2': 'th',
         'SG2': 'sg',
         'PH2': 'ph'
      }
   }
   
   async getPatch() {
      const url = 'https://ddragon.leagueoflegends.com/api/versions.json'
      return (await axios.get(url)).data[0].split('.').slice(0, 2).join('.')
   }

}

module.exports = Util