import { defineStore } from "pinia"

export const userReadyStore = defineStore('experience', {
   state() {
      return {

      }
   },
   actions: {
      increment() {
         this.count++
      },
   },
})