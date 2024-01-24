import { defineStore } from 'pinia'

export const championStore = defineStore('configuration', {
   state() {
      return {
         visibleCore: 10, // Limit core build to top N builds, sorted by popularity
         winrateSort: false, // Sort trailing items by highest winrate
         winrateThreshold: 0.1, // Threshold parameter for winrate sort to exclude games with small representation.
         trailingExtended: 2, // How many trailing items to display
         levelCutoff: 10, // Minimum character level when considering skill order.
         localStorage: false,
         modals: {
            tldr: false,
            items: false,
            startingAndSpells: false
         },
      }
   },
   actions: {

   }
})