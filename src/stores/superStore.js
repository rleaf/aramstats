import { defineStore } from 'pinia'

export const superStore = defineStore('super', {
   state() {
      return {
         loading: false,  // Boolean to determine if loading component is active
         champions: [],   // Array of champions for search bars. Initialized in App.vue
      }
   },
   actions: {

   }
})