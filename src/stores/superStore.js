import { defineStore } from 'pinia'

export const superStore = defineStore('super', {
   state() {
      return {
         loading: false,         // Boolean to determine if loading component is active
         champions: [],          // Array of champions for search bars. Initialized in App.vue
         focus: false,           // Boolean to determine if nav search bar is focused.
         notification: '',       // Notifacation message
         patches: null,          // Array of 10 most recent patches
         items: null,            // Items on most recent patch
         tooltip: {
            active: false,
            mode: null,
            x: 0,
            y: 0,
            key: null,
            runes: null,            // Runes on most recent patch
            spells: null,           // Spells on most recent patch
            spell: null,
            skills: null,           // Skills on most recent patch
            skillIndex: null,       
         },
      }
   },
   actions: {
      setNotification(notification, duration) {
         this.notification = notification
         setTimeout(() => this.notification = '', duration || 2000)
      },
      
      setTooltipData(event, key, mode, skillIndex) {
         this.tooltip.active = true
         this.tooltip.mode = mode
         this.tooltip.x = event.target.offsetLeft + (event.target.offsetWidth / 2)
         this.tooltip.y = event.target.offsetTop - (event.target.offsetHeight)
         this.tooltip.key = key
         this.tooltip.skillIndex = skillIndex
      }
   }
})