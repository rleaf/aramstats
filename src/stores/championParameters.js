import { defineStore } from 'pinia'

export const championParametersStore = defineStore('parameters', {
   state() {
      return {
         thresholds: {
            core: 0.05,
            trail: 0.05
         },
         trailingDuplicates: true,
         trailingExtended: 2,
         levelCutoff: 10
      }
   },
   actions: {

   }
})