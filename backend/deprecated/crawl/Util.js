const axios = require('axios')

class Util {
   constructor() {
      this.shorthand = {
         NA1: 'na',
         BR1: 'br',
         LAN: 'lan',
         LAS: 'las',
         EUW1: 'euw',
         EUN1: 'eune',
         TR1: 'tr',
         RU: 'ru',
         KR: 'kr',
         JP1: 'jp',
         OC1: 'oce',
         PH2: 'ph',
         SG2: 'sg',
         TH2: 'th',
         TW2: 'tw',
         VN2: 'vn',
      }
   }

   shorthandToRegionGroup(shorthand) {
      switch (shorthand) {
         case 'na':
         case 'br':
         case 'lan':
         case 'las':
            return 'AMERICAS'
         case 'euw':
         case 'eune':
         case 'tr':
         case 'ru':
            return 'EUROPE'
         case 'kr':
         case 'jp':
            return 'ASIA'
         case 'oce':
         case 'ph':
         case 'sg':
         case 'th':
         case 'tw':
         case 'vn':
            return 'SEA'      
      }
      throw new Error(`Unexpected shorthand: ${shorthand}`)
   }

   getPlatform(id) {
      let platform = id.split('_')[0]  
      return this.shorthand[platform]
   }

   async getPatch() {
      const url = 'https://ddragon.leagueoflegends.com/api/versions.json'
      return (await axios.get(url)).data[0].split('.').slice(0, 2).join('.')
   }

}

module.exports = Util