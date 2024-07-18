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
         itemTooltip: false,     // Boolean for item hovering
         itemTooltipX: 0,        // X position of item tooltip
         itemTooltipY: 0,        // Y position of item tooltip
         itemTooltipKey: null,   // Key value for tooltip for indexing
         runes: null,            // Runes on most recent patch
         spells: null,           // Spells on most recent patch
         skills: null,           // Skills on most recent patch
         tooltipMode: null,
      }
   },
   actions: {
      setNotification(notification, duration) {
         this.notification = notification
         setTimeout(() => this.notification = '', duration || 2000)
      },
      
      setTooltipData(e, k, mode) {
         this.itemTooltip = true
         this.itemToolTipKey = k
         this.tooltipMode = mode
         this.itemTooltipX = e.target.offsetLeft + (e.target.offsetWidth / 2)
         this.itemTooltipY = e.target.offsetTop - (e.target.offsetHeight)
      }
   }
})