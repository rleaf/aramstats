import { defineStore } from "pinia"

export const userReadyStore = defineStore('search', {
   state() {
      return {
         userReady: false
      }
   },
   actions: {
      increment() {
         this.count++
      },
   },
})