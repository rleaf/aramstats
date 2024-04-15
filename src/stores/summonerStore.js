import { defineStore } from 'pinia'

export const summonerStore = defineStore('summoner', {
   state() {
      return {
         championPool: new Set(), // Set comtaining aggregated champions ids for a summoner page
      }
   },
   
})