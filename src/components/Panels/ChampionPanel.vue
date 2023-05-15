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
         statFilter: ['DPM', 'damagePerMinute'],
         // statBook: ['DPM', 'HPM', 'AHPM', 'TPM', 'MPM', 'GPM'],
         statBook: {
            'DPM': 'damagePerMinute',
            'HPM': 'healPerMinute',
            'AHPM': 'allyHealPerMinute',
            'DTPM': 'damageTakenPerMinute',
            'DMPM': 'selfMitigatedPerMinute',
            'GPM': 'goldPerMinute'
         },
         statDrop: false
      }
   },


   created() {
      this.nunuIndex = this.data.findIndex(e => e.championName == 'Nunu')

      // no...nunu...games...?
      if (this.nunuIndex == -1) this.nunuIndex = 3

      this.championData = this.data[this.nunuIndex]
   },

   watch: {
      championFilter(c, p) {
         this.getChampionIndex()
         this.championData = this.data[this.championIndex]
      }
   },

   methods: {
      changeUnit() {
         this.statDrop = !this.statDrop
         // this.$emit('unit', this.statDrop)
      },

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
         return `${this.championData.averageKills}/${this.championData.averageDeaths}/${this.championData.averageAssists}`
      },

      kdr() {
         return `${Math.round(((this.championData.averageKills + this.championData.averageAssists) / this.championData.averageDeaths) * 100) / 100}`
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
   <div class="champion-main">
      <div class="head">
         <ChampSearch :data="this.data" @championFocus="champion => championFilter = champion"/>
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
            <MythicWinrate :data="this.championData"/>
         </div>
         <Histogram
         :championData="this.championData"
         :stat="this.statFilter[1]"
         :comparisonData="this.comparisonData"
         :initChampion="this.data[this.nunuIndex]"/>
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
   /* change color ? */
   border-radius: 9px;
   cursor: pointer;
   background: var(--tint200);
}

button:hover {
   background: var(--tint301);
}

.stat-drop {
   position: absolute;
   /* background: var(--tint200); */
   backdrop-filter: blur(13px) saturate(120%);
   -webkit-backdrop-filter: blur(13px) saturate(120%);
   background-color: rgba(38, 41, 51, 0.2);
   box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.65);
   z-index: 5;
   border-radius: 5px;
   /* margin: 5px; */
}

.stat {
   border-radius: 5px;
   /* padding: 5px; */
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