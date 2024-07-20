import { defineStore } from 'pinia'
import axios from 'axios'

export const superStore = defineStore('super', {
   state() {
      return {
         loading: false,         // Boolean to determine if loading component is active
         champions: [],          // Array of champions for search bars. Initialized in App.vue
         focus: false,           // Boolean to determine if nav search bar is focused.
         notification: '',       // Notifacation message
         patches: null,          // Array of 10 most recent patches
         championCDN: null,      // (CDN) Champion on most recent patch
         items: null,            // (CDN) Items on most recent patch
         runes: null,            // (CDN) Runes on most recent patch
         spells: null,           // (CDN) Summoner Spells on most recent patch
         tooltip: {
            active: false,
            mode: null,
            x: 0,
            y: 0,
            key: null,
            index: null,
            runeTree: null,
            runeRow: null,
         },
      }
   },
   actions: {
      // Items
      async initItems() {
         if (!this.items) {
            if (!this.patches) await this.initPatches()
               
            // Items
            try {
               const url = `https://ddragon.leagueoflegends.com/cdn/${this.patches[0]}/data/en_US/item.json`
               this.items = (await axios.get(url)).data.data
            } catch (e) {
               if (e instanceof Error) console.log(e)
            }
         }
      },

      // Summoner Spells
      async initSpells() {
         if (!this.spells) {
            // if (!this.patches) await this.initPatches()
               
            try {
               // const url = `https://ddragon.leagueoflegends.com/cdn/${this.patches[0]}/data/en_US/summoner.json`
               const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json`
               this.spells = (await axios.get(url)).data
            } catch (e) {
               if (e instanceof Error) console.log(e)
            }
         }
      },

      // Champion CDN Data. Primarily used for skills
      // Data generated using Meraki: https://github.com/meraki-analytics/lolstaticdata
      async initChampion(champ) {
         try {
            const url = `https://cdn.jsdelivr.net/gh/rleaf/aramstats@master/cdn/${champ}.json`
            this.championCDN = (await axios.get(url)).data
         } catch (e) {
            if (e instanceof Error) console.log(e)
         }
      },

      // Last 10 patches
      async initPatches() {
         if (!this.patches) {
            try {
               const url = 'https://ddragon.leagueoflegends.com/api/versions.json'
               this.patches = (await axios.get(url)).data.slice(0, 10)
            } catch (e) {
               if (e instanceof Error) console.log(e)
            }
         }
      },

      // Runes
      async initRunes() {
         if (!this.runes) {
            if (!this.patches) await this.initPatches()

            try {
               // const url = `https://ddragon.leagueoflegends.com/cdn/${this.patches[0]}/data/en_US/runesReforged.json`
               const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json`
               this.runes = (await axios.get(url)).data
            } catch (e) {
               if (e instanceof Error) console.log(e)
            }
         }
      },

      setNotification(notification, duration) {
         this.notification = notification
         setTimeout(() => this.notification = '', duration || 2000)
      },
      
      setTooltipData(params) {
         this.tooltip.active = true
         this.tooltip.mode = params.mode
         this.tooltip.x = params.event.target.offsetLeft + (params.event.target.offsetWidth / 2)
         this.tooltip.y = params.event.target.offsetTop - (params.event.target.offsetHeight)
         this.tooltip.key = params.key
         this.tooltip.skillIndex = params.skillIndex
         this.tooltip.runeTree = params.runeTree
         this.tooltip.runeRow = params.runeRow
      }
   }
})