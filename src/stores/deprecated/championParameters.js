import { defineStore } from 'pinia'

export const championParametersStore = defineStore('parameters', {
   state() {
      return {
         tldr: {
            useLocalStorage: false,
            coreThreshold: 0.05,
            trailingDuplicates: true,
            trailingExtended: 2,
            levelCutoff: 10
         }
      }
   },
   actions: {

   }
})