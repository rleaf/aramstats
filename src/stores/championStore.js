import { defineStore } from 'pinia'

export const championStore = defineStore('configuration', {
   state() {
      return {
         localStorage: false, // Use local storage?
         visibleCore: false, // Limit core build to top N builds, sorted by popularity
         winrateSort: false, // Sort trailing items by highest winrate
         winrateThreshold: 0.1, // Threshold parameter for winrate sort to exclude games with small representation.
         itemsExtended: 2,
         runes: {
            heatmap: 0, // 0: off, 1: popularity, 2: winrate
            clarity: false // Desaturate rune images to promote visual clarity.
         },
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