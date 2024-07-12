import { defineStore } from 'pinia'

export const summonerStore = defineStore('summoner', {
   state() {
      return {
         championPool: new Set(), // Set comtaining aggregated champions ids for a summoner page
         aggregatedStats: {
            general: {
               kda: '',
               gameLength: 0,
               deathTime: 0,
               damage: 0,
               taken: 0,
               mitigated: 0,
               healed: 0,
               allyHealed: 0,
               gold: 0,
            },
            multikills: {
               t: 0,
               q: 0,
               p: 0,
            },
         },
         patchHr: '', // Rolling string to check for new patches for patch markers in Match.vue
      }
   },
   
})