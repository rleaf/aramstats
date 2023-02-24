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
         comparisonWins: 0,
         comparisonKDA: null,
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
               if (comparison == 'wukong') comparison = 'monkeyking'
               return e.championName.toLowerCase() == comparison.toLowerCase()
            })

            if (index != -1) {
               let champion = this.data[index]
               ensembleMatches.push(champion.matches)
            }
         })

         this.comparisonData = ensembleMatches.flat()
         this.comparisonWinRateKDA()
      },

      comparisonWinRateKDA() {
         this.comparisonKDA = null
         this.comparisonWins = 0
         
         if (this.comparisonData.length != 0) {

            let totalKDA = [0, 0, 0]
            
            this.comparisonData.forEach((match) => {
               if (match.win) this.comparisonWins ++
               totalKDA[0] += match.kills
               totalKDA[1] += match.deaths
               totalKDA[2] += match.assists
            })

            this.comparisonKDA = totalKDA.map((x) => Math.round(x / this.comparisonData.length))
         }
         
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

      ensembleWinRate() {
         if (this.comparisonWins != 0) return `${Math.round((this.comparisonWins / this.comparisonData.length) * 100)}%`
      },

      ensembleWinRateFraction() {
         if (this.comparisonWins != 0) return `(${this.comparisonWins}/${this.comparisonData.length}) WR`
      },

      ensembleKDR() {
         if (this.comparisonKDA) return `${Math.round(((this.comparisonKDA[0] + this.comparisonKDA[2]) / this.comparisonKDA[1]) * 100) / 100}`   
      },

      ensembleKDA() {
         if (this.comparisonKDA) return `(${this.comparisonKDA[0]}/${this.comparisonKDA[1]}/${this.comparisonKDA[2]}) KDA`
      },
   }, 

   props: {
      data: null
   }
}
</script>

<template>
   <!-- <div class="champion-main" :style="background"> -->
   <div class="champion-main">
      <div class="misc-wrapper">
         <ChampSearch :data="this.data" @championFocus="champion => championFilter = champion" />
         <div class="wr-kda">
            <div>
               <div style="color: var(--header-stats);" class="champ-wr">
                  {{ winrate }}%
               </div>
               <div class="wr-fraction">
                  ({{ this.championData.wins }}/{{ this.championData.matches.length }}) WR
               </div>
            </div>
            <div>
               <div style="color: var(--header-stats);" class="champ-wr">
                  {{ kdr }}
               </div>
               <div class="wr-fraction">
                  ({{ this.championData.averageKDA }}) KDA
               </div>
            </div>
         </div>
         <div class="runes-mythic-wrapper">
            <div class="runes-mythic-wr">
               <RuneWinrate :data="this.championData"/>
            </div>
            <div class="runes-mythic-wr">
               <MythicWinrate :data="this.championData"/>
            </div>
         </div>
      </div>
      <Histogram
         :championData="this.championData"
         :comparisonData="this.comparisonData"
         :initChampion="this.data[this.nunuIndex]"/>
      <!-- <div style="background: var(--profile-panel); width: 100%;"> -->
      <div class="misc-wrapper">
         <input class="comparison-input" type="text" spellcheck="false" v-model="comparison" v-on:keyup.enter="champComparison"
            placeholder="kogmaw, drmundo, renata, nunu, jarvaniv...">
         <div class="wr-kda">
            <div>
               <div style="color: var(--header-stats);" class="champ-wr">
                  {{ ensembleWinRate }}
               </div>
               <div class="wr-fraction">
                  {{ ensembleWinRateFraction }}
               </div>
            </div>
            <div class="comparison-guide" v-show="this.comparison == null">
               Enter any combination of champions you've played where each champion name: is lowercase, has no spaces,
               and apostrophes are removed and then hit enter. Example in placeholder text in input above.
            </div>
            <div>
               <div style="color: var(--header-stats);" class="champ-wr">
                  {{ ensembleKDR }}
               </div>
               <div class="wr-fraction">
                  {{ ensembleKDA }}
               </div>
            </div>
         </div>
         <div class="runes-mythic-wrapper">
            <div class="runes-mythic-wr">
               <RuneWinrate v-if="this.comparisonData" :data="this.comparisonData" :comparison="true" />
            </div>
            <div class="runes-mythic-wr">
               <MythicWinrate v-if="this.comparisonData" :data="this.comparisonData" :comparison="true" />
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>

.comparison-guide {
   padding-top: 50px;
   color: var(--color-font-fade);
   font-size: 0.8rem;
   font-style: oblique;
   width: 250px;
   line-height: 1.5;
}
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
}

.comparison-input {
   background: var(--champion-search-bar);
   color: var(--color-font);
   font-style: oblique;
   padding: 0.5rem 0.8rem;
   margin: 8px 8px 0 8px;
   border: none;
   border-radius: 5px;
   width: calc(100% - 16px);
   box-sizing: border-box;
   margin-right: 10px;
}

.comparison-input:focus {
   outline: none;
   background: var(--champion-search-bar-focus);
}
.champion-header {
   display: flex;
   align-items: center;
   font-size: 0.9rem;
   padding-top: 10px;
   padding-bottom: 10px;
   padding-left: 10px;
}
.champ-wr {
   display: inline-block;
   font-weight: bold;
   padding-right: 4px;
   color: var(--color-font);
   font-size: 1.1rem;
}
.wr-fraction {
   display: inline-block;
   color: var(--color-font-fade);
   font-size: 0.9rem;
}

.misc-wrapper {
   width: 100%;
   /* margin: 10px; */
   border-radius: 10px;
   background: var(--profile-panel);
}

.wr-kda {
   display: flex;
   align-items: center;
   justify-content: space-evenly;
   text-align: center;
   gap: 5px;
   /* padding: 5px 0; */
   padding-top: 10px;
   padding-bottom: 5px;
}

.champion-main {
   display: flex;
   height: 310px;
   flex-direction: row;
   justify-content: space-evenly;
   border-radius: 5px;
   /* background: var(--profile-panel); */
   /* background: linear-gradient(to left, rgba(var(--profile-panel-dec-rgb), 0.9) 50%, rgba(var(--profile-panel-dec-rgb), 0.75)),
   no-repeat url('../../assets/champion_images/Nunu.webp'); */
   /* background-position-y: center; */
}
</style>