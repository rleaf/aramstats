import { defineStore } from 'pinia'

export const championStore = defineStore('configuration', {
   state() {
      return {
         localStorage: false, // Use local storage?
         visibleCore: false, // Limit core build to top N builds, sorted by popularity
         winrateSort: false, // Sort trailing items by highest winrate
         winrateThreshold: 0.1, // Threshold parameter for winrate sort to exclude games with small representation.
         itemsExtended: 2,
         modals: {
            tldr: false,
            items: false,
            runes: false
         }
      }
   },
   actions: {

   }
})