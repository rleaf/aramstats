<script>
import Histogram from '../Histogram.vue'
import ChampSearch from '../ChampSearch.vue'
import RuneWinrate from '../RuneWinrate.vue'
import MythicWinrate from '../MythicWinrate.vue'

export default {
   components: {
      Histogram,
      ChampSearch,
      RuneWinrate,
      MythicWinrate,
   },
   data() {
      return {
         championFilter: null,
         championData: null,
         championIndex: null,
         initChampionData: null,
         nunuIndex: null,
         comparison: null,
         comparisonData: null,
      }
   },

   created() {
      this.nunuIndex = this.data.findIndex((e) => {
         return e.championName == 'Nunu'
      })

      // no...nunu...games...?
      if (this.nunuIndex == -1) this.nunuIndex = 3

      this.championData = this.data[this.nunuIndex]
   },

   watch: {
      championFilter() {
         this.getChampionIndex()
         this.championData = this.data[this.championIndex]
      }
   },

   methods: {
      getChampionIndex() {
         this.championIndex = this.data.findIndex((e) => {
            if (e.trueChampionName) {
               return e.trueChampionName == this.championFilter
            } else {
               return e.championName == this.championFilter
            }
         })

      },

      champComparison() {
         let comparisons = this.comparison.split(', ')
         let ensembleMatches = []
         
         comparisons.forEach((comparison) => {
            let index = this.data.findIndex((e) => {
               if (e.championName === undefined) return
               return e.championName.toLowerCase() == comparison.toLowerCase()
            })

            if (index != -1) {
               let champion = this.data[index]
               ensembleMatches.push(champion.matches)
            }
         })

         this.comparisonData = ensembleMatches.flat()
      },

      winrateColor(x) {
         // https://stackoverflow.com/a/12259830/1545958
         if (x < 50) return 'color: var(--parse50)'
         if (x < 75) return 'color: var(--parse75)'
         if (x < 85) return 'color: var(--parse85)'
         if (x <= 100) return 'color: var(--parse100)'
      }
   },

   computed: {
      winrate() {
         return Math.round((this.championData.wins / this.championData.matches.length) * 100)
      }
   }, 

   props: {
      data: null
   }
}
</script>

<template>
   <div class="offensive-header">
      <ChampSearch :data="this.data" @championFocus="champion => championFilter = champion" />
      <div class="header-el" style="flex-direction: row-end;">
         <div class="stats-a">
            <div :style="winrateColor(winrate)" class="champ-wr">
               {{ winrate }}%
            </div>
            <div class="wr-fraction">
               ({{ this.championData.wins }}/{{ this.championData.matches.length }})
            </div>
         </div>
         <!-- <div class="stats-a">
            Games: <div class="stat-aa">{{ this.championData.matches.length }}</div>
         </div>
         <div class="stats-a">
            Wins: <div class="stat-aa">{{ this.championData.wins }}</div>
         </div>
         <div class="stats-a">
            KDA: <div class="stat-aa">{{ this.championData.averageKDA }}</div>
         </div> -->
      </div>
      <input class="comparison-input" type="text" spellcheck="false"
         v-model="comparison" v-on:keyup.enter="champComparison"
         placeholder="kogmaw, ezreal, nunu, ksante, jarvaniv, morgana...">
   </div>
   
   <div class="offensive-main">
      <div class="runes-mythic-wrapper">
         <div class="runes-mythic-wr">
            <RuneWinrate :data="this.championData"/>
         </div>
         <div class="runes-mythic-wr">
            <MythicWinrate :data="this.championData"/>
         </div>
      </div>
      <Histogram
         :championData="this.championData"
         :comparisonData="this.comparisonData"
         :initChampion="this.data[this.nunuIndex]"/>

   </div>
</template>

<style scoped>
.runes-mythic-wrapper {
   display: flex;
   justify-content: space-evenly;
   color: var(--color-font);
   padding: 0 10px;
   gap: 10px;
   width: 240px;
   border-right: 2px solid var(--color-background);
}

.comparison-input {
   margin-left: auto;
   background: var(--champion-search-bar);
   color: var(--color-font);
   font-style: oblique;
   padding: 0.5rem 0.8rem;
   border: none;
   border-radius: 5px;
   width: 500px;
   margin-right: 10px;
}

.comparison-input:focus {
   outline: none;
   background: var(--champion-search-bar);
}
.offensive-header {
   display: flex;
   align-items: center;
   font-size: 0.9rem;
   border-bottom: 1px solid var(--color-font);
   padding-top: 10px;
   padding-bottom: 10px;
   padding-left: 10px;
}
.champ-wr {
   font-weight: bold;
   color: var(--color-font);
   font-size: 1.1rem;
}
.wr-fraction {
   color: var(--color-font-fade);
   font-size: 0.9rem;
}

.stats-a {
   display: flex;
   align-items: center;
   gap: 8px;
   padding-left: 1rem;
}

.offensive-main {
   display: flex;
   height: 298px;
   flex-direction: row;
}
</style>