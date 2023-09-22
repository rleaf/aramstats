import { defineStore } from "pinia"

export const userReadyStore = defineStore('search', {
   state() {
      return {
         count: 0,
         name: 'Ryan',
         userReady: false
      }
   },
   actions: {
      increment() {
         this.count++
      },
   },
})