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
         console.log(this.championData)
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
      },

      kdr() {
         let x = this.championData.averageKDA.split('/').map(x => parseInt(x))
         return `${Math.round(( (x[0]+x[2]) / x[1] ) * 100) / 100}`
      },

      background() {
         // let url = new URL(`../../assets/champion_images/${this.championData.championName}_0.webp`, import.meta.url).href

         // lazy way for now :)
         return `background: linear-gradient(to left, rgba(var(--profile-panel-dec-rgb), 0.9) 50%, rgba(var(--profile-panel-dec-rgb), 0.75)),
            no-repeat url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.championData.championName}_0.jpg');`
      },
   }, 

   props: {
      data: null
   }
}
</script>

<template>
   <div class="champion-main" :style="background">
      <div class="champion-header">
         <ChampSearch :data="this.data" @championFocus="champion => championFilter = champion" />
         <div class="stats-a">
            <!-- <div :style="winrateColor(winrate)" class="champ-wr">
               {{ winrate }}%
            </div> -->
            <div style="color: var(--header-stats);" class="champ-wr">
               {{ winrate }}%
            </div>
            <div class="wr-fraction">
               ({{ this.championData.wins }}/{{ this.championData.matches.length }}) W/L
            </div>
         </div>
         <div class="stats-a">
            <div style="color: var(--header-stats);" class="champ-wr">
               {{ kdr }}
            </div>
            <div class="wr-fraction">
               ({{ this.championData.averageKDA }}) KDA
            </div>
         </div>
         <input class="comparison-input" type="text" spellcheck="false"
            v-model="comparison" v-on:keyup.enter="champComparison"
            placeholder="kogmaw, drmundo, renata, ksante, jarvaniv, nunu, xinzhao...">
      </div>
      
      <div class="champion-body">
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
         <div class="temp">
            You may need to re-parse you summoner if something looks like it's not loading properly.
            <br><br>
            Hit 'delete' button up top.
         </div>
      </div>
   </div>
</template>

<style scoped>

.temp {
   margin-left: auto;
   margin-right: auto;
   color: var(--color-font);
   font-size: 0.9rem;
   text-align: center;
   padding-top: 2rem;
   width: 300px;
}
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
.champion-header {
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
   gap: 5px;
   padding-left: 1.5rem;
}

.champion-body {
   display: flex;
   height: 298px;
   flex-direction: row;
}

.champion-main {
   /* background: var(--profile-panel); */
   background: linear-gradient(to left, rgba(var(--profile-panel-dec-rgb), 0.9) 50%, rgba(var(--profile-panel-dec-rgb), 0.75)),
   no-repeat url('../../assets/champion_images/Nunu.webp');
   /* background-position-y: center; */
   border-radius: 5px;
}
</style>