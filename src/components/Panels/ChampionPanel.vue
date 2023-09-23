<script>
import Histogram from '../Histogram.vue'
import ChampSearch from '../ChampSearch.vue'
import RuneWinrate from '../RuneWinrate.vue'
import MythicWinrate from '../MythicWinrate.vue'
import championNameBook from '../../constants/championNames'

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
         championData: this.data[0],
         championIndex: null,
         initChampionData: null,
         nunuIndex: null,
         comparison: null,
         comparisonData: null,
         comparisonWins: 0,
         comparisonKDA: null,
         statFilter: ['DPM', 'damageDealtToChampions'],
         // statBook: ['DPM', 'HPM', 'AHPM', 'TPM', 'MPM', 'GPM'],
         statBook: {
            'DPM': 'damageDealtToChampions',
            'HPM': 'healed',
            'AHPM': 'healsOnTeammates',
            'DTPM': 'damageTaken',
            'DMPM': 'selfMitigated',
            'GPM': 'gold'
         },
         statDrop: false
      }
   },

   mounted() {

   },

   watch: {
      championFilter(c, p) {
         if (Object.values(championNameBook).indexOf(c) > -1 ) {
            this.championFilter = Object.keys(championNameBook).find(k => championNameBook[k] === c)
         }

         this.championIndex = this.data.findIndex((e) => e.name === this.championFilter)
         this.championData = this.data[this.championIndex]
      }
   },

   methods: {
      changeUnit() {
         this.statDrop = !this.statDrop
         // this.$emit('unit', this.statDrop)
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
               if (match.win) this.comparisonWins++
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

      kda() {
         return `${this.championData.averages.kills}/${this.championData.averages.deaths}/${this.championData.averages.assists}`
      },

      kdr() {
         return `${Math.round(((this.championData.averages.kills + this.championData.averages.assists) / this.championData.averages.deaths) * 100) / 100}`
      },

      background() {
         const img = new URL(`../../assets/champion_splash/${this.championData.name.toLowerCase()}.webp`, import.meta.url).href
         // return `background: linear-gradient(to right, rgba(var(--tint100RGB), 0.8), rgba(var(--tint100RGB), 0.85) 10%, rgba(var(--tint100RGB), 1.0) 60%), no-repeat -110% 20%/80% url('${img}')`
         return `background: linear-gradient(to left, rgba(var(--tint100RGB), 0.9), rgba(var(--tint100RGB), 0.85) 10%, rgba(var(--tint100RGB), 1.0) 70%), no-repeat 100% 20%/80% url('${img}')`
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
      data: null,
      currentPatch: null
   }
}
</script>

<template>
   <div class="champion-main" :style="background">
      <div class="head">
         <ChampSearch :data="this.data" :currentPatch="this.currentPatch" @championFocus="champion => championFilter = champion"/>
         <div class="champion-stats">
            <div class="winrate">
               {{ winrate }}% <span class="unit">winrate</span>
            </div>
            <div class="kda">
               {{ kda }} <span class="unit">KDA</span>
            </div>
         </div>

         <div class="stat-dropdown">
            <button @click="changeUnit">
               {{ this.statFilter[0] }}
               <img src="../../assets/arrow3.svg" alt="" :class="{ down: this.statDrop }">
            </button>
            <div class="stat-drop" v-if="this.statDrop">
               <div class="stat" v-for="[k, v] of Object.entries(statBook)" :key="k" @click="() => {
                  this.statFilter = [k, v]
                  this.statDrop = false
               }">
                  {{ k }}
               </div>
            </div>
            <div class="stat-modal" v-show="this.statDrop" @click="this.statDrop = false"></div>
         </div>

      </div>
      <div class="body">
         <div class="rune-mythic">
            <RuneWinrate :data="this.championData"/>
            <MythicWinrate :data="this.championData" :currentPatch="this.currentPatch"/>
         </div>
         <Histogram
         :championData="this.championData"
         :stat="this.statFilter[1]"
         :comparisonData="this.comparisonData"
         :initChampion="this.championData"/>
      </div>
   </div>
</template>

<style scoped>

.champion-main {
   display: flex;
   flex-direction: column;
   width: 100%;
   background-color: var(--tint100);
   margin-top: 20px;
   border-radius: 15px;
   /* height: 100px; */
}

.head {
   display: flex;
   height: 50px;
   padding: 0 15px;
   align-items: center;
   justify-content: space-between;
}

.rune-mythic {
   display: flex;
   min-width: 255px;
}

.body {
   display: flex;
   justify-content: space-evenly;
}

.stat-dropdown button {
   background: none;
   border: none;
   padding: 8px 11px;
   color: var(--color-font);
   font-size: 0.9rem;
   font-weight: bold;
   border-radius: 9px;
   cursor: pointer;
   background: var(--tint200);
}

button:hover {
   background: var(--tint301);
}

.stat-drop {
   position: absolute;
   backdrop-filter: blur(13px) saturate(120%);
   -webkit-backdrop-filter: blur(13px) saturate(120%);
   background-color: rgba(38, 41, 51, 0.2);
   box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.65);
   z-index: 5;
   border-radius: 5px;
}

.stat {
   border-radius: 5px;
}
.stat:hover {
   background-color: var(--hoverButton);
}

.stat {
   padding: 5px 10px;
   cursor: pointer;
}

.down {
   transform: rotate(180deg);
}

.stat-modal {
   position: fixed;
   z-index: 1;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
}

.champion-stats div {
   display: inline-block;
   font-size: 1.2rem;
   font-weight: bold;
   margin: 0 20px;
}

.unit {
   font-size: 0.9rem;
   font-weight: normal;
   color: var(--tint400);
}
</style>