<script>
import Loading from '../components/Loading.vue'
import axios from 'axios'
import champions from '../constants/champions'
import { superStore } from '@/stores/superStore'

export default {
   components: {
      Loading
   },
   data() {
      return {
         store: superStore(),
         champions: null,
         total: null,
         region: 'Global',
         sort: 'rank',
         sortOrder: 1,
         winrates: {
            max: 0,
            min: 101,
            delta: 0
         }
      }
   },

   created() {
      this.lookup() 
   },
   
   methods: {
      champIcon(id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/${champions.imageName[id]}.png`
      },
      lookup() {
         const url = `/api/championsList`
         axios.get(url).then(res => {
            this.champions = res.data
            this.populate()
         }).catch(e => {
            console.log('error', e)
         })
      },
      populate() {
         for (const i in this.champions) {
            const c = this.champions[i]
            // c.frontName = this.getName(c._id)
            // c.pickrate = this.getPickRate(c.games)
            c.winrate = this.getWinrate(c.wins, c.games)
            if (c.winrate > this.winrates.max) this.winrates.max = c.winrate
            if (c.winrate < this.winrates.min) this.winrates.min = c.winrate
         }

         this.winrates.delta = this.winrates.max - this.winrates.min

         for (const i in this.champions.sort((a, b) => b.winrate - a.winrate)) {
            const rank = Number(i) + 1
            this.champions[i].rank = rank
            this.champions[i].grade = this.getGrade(rank, this.champions.length)
         }
      },
      getGrade(rank, total) {
         const val = rank / total
         if (val < 0.02) return 'S'
         if (val < 0.06) return 'A'
         if (val < 0.2) return 'B'
         if (val < 0.42) return 'C'
         return 'D'
      },
      getWinrate(w, g) {
         return Math.round((w / g) * 10000) / 100
      },
      getName(name) {
         return (name in champions.table) ? champions.table[name] : name
      },
      getPickRate(g) {
         // if (this.total) return (g / this.total * 1000)
         if (this.total) return Math.round(g / this.total * 10000) / 10
      },
      headerSort(sort) {
         if (sort === this.sort) {
            this.sortOrder = this.sortOrder * -1
         } else {
            this.sort = sort
         }
      },
      winrateColors(g) {
         if (g === 'D') return 'color: red;'
         if (g === 'C') return 'color: orange;'
         if (g === 'B') return 'color: yellow;'
         if (g === 'A') return 'color: var(--green100);'
         if (g === 'S') return 'color: var(--orange100);'
      },
      computeColor(g) {
         const val = (g - this.winrates.min) / this.winrates.delta 
         const green = [79, 201, 79]
         const red = [201, 40, 0]

         const lerp = green.map((p, i) => p * val + red[i] * (1 - val))
         return `rgba(${lerp[0]},${lerp[1]},${lerp[2]})`
      },

      getChampName(id) {
         return champions.humanName[id]
      },

      champMap(name){
         return champions.urlName[name]
      }
   },

   computed: {
      patch() {
         if (this.store.patches) return this.store.patches[0]
      },
      getChampionsList() {
         if (this.champions) {
            // const table = {
            //    'S' : 1,
            //    'A' : 2,
            //    'B' : 3,
            //    'C' : 4,
            //    'D' : 5
            // }

            if (this.sort === '_id') {
               return this.champions.sort((a, b) => champions.humanName[a[this.sort]].localeCompare(champions.humanName[b[this.sort]]) * this.sortOrder)
            }

            // if (this.sort === 'grade') {
            //    return this.champions.sort((a, b) => (table[a[this.sort]] - table[b[this.sort]]) * this.sortOrder)
            // }

            return this.champions.sort((a, b) => (a[this.sort] - b[this.sort]) * this.sortOrder)
         }
      },
   }
}

</script>

<template>
   <div v-if="this.champions" class="champ-list-main">
      <div class="champ-table">
         <!-- <div class="filters">
            <div class="region-button" @click="">
               {{ this.region}}
            </div>
         </div> -->
         <div class="champion header">
            <!-- <div class="rank">
               <h2 @click="this.headerSort('rank')">Rank</h2>
               <svg v-if="this.sort === 'rank'" class="triangle" :class="{ 'descending': this.sortOrder === 1}">
                  <polygon points="7 5, 14 14, 0 14"/>
               </svg>
            </div> -->
            <div class="name-image">
               <h2 @click="this.headerSort('_id')">Name</h2>
               <svg v-if="this.sort === '_id'" class="triangle" :class="{ 'descending': this.sortOrder === 1 }">
                  <polygon points="7 5, 14 14, 0 14"/>
               </svg>
            </div>
            <!-- <div class="grade">
               <h2 @click="this.headerSort('grade')">Grade</h2>
               <svg v-if="this.sort === 'grade'" class="triangle" :class="{ 'descending': this.sortOrder === 1 }">
                  <polygon points="7 5, 14 14, 0 14"/>
               </svg>
            </div> -->
            <div class="winrate">
               <h2 @click="this.headerSort('winrate')">Winrate</h2>
               <svg v-if="this.sort === 'winrate'" class="triangle" :class="{ 'descending': this.sortOrder === 1 }">
                  <polygon points="7 5, 14 14, 0 14"/>
               </svg>
            </div>
            <div class="pickrate">
               <h2 @click="this.headerSort('pickRate')">Pickrate</h2>
               <svg v-if="this.sort === 'pickRate'" class="triangle" :class="{ 'descending': this.sortOrder === 1 }">
                  <polygon points="7 5, 14 14, 0 14"/>
               </svg>
            </div>
            <div class="games">
               <h2 @click="this.headerSort('games')">Games</h2>
               <svg v-if="this.sort === 'games'" class="triangle" :class="{ 'descending': this.sortOrder === 1 }">
                  <polygon points="7 5, 14 14, 0 14"/>
               </svg>
            </div>
         </div>
         <div :class="{'o': i % 2 === 0}" class="champion" v-for="(champ, i) in getChampionsList" :key="i">
            <div class="name-image">
               <router-link :to="{ name: 'champions', params: { champion: this.champMap(champ._id) } }">
                  <div class="image-wrapper">

                     <img rel="preload" :src="this.champIcon(champ._id)" alt="">
                  </div>
                  <div>
                     <span>{{ this.getChampName(champ._id) }}</span>
                  </div>
               </router-link>
            </div>
            <div :style="{ color: this.computeColor(champ.winrate) }" class="winrate">
               {{ champ.winrate }}%
            </div>
            <div class="pickrate">
               {{ champ.pickRate }}
            </div>
            <div class="games">
               {{ champ.games }}
            </div>
         </div>
      </div>
   </div>
   <div v-else class="loading-champ-list">
      <Loading />
   </div>
   
</template>

<style scoped>
   .region-button {
      padding: 0.5rem 1rem;
      /* width: 50px; */
      background: tomato;
   }
   .filters {
      margin-bottom: 20px;
      border-bottom: 1px solid var(--cell-border)
   }
   .champ-list-main {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 6vh;
   }

   .champ-table {
      width: 1100px;
      padding-bottom: 15vh;
      color: var(--color-font)
   }

   .champion {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 45px;
      border-radius: 3px;
      font-size: 0.9rem;
   }

   .image-wrapper {
      height: 34px;
      width: 34px;
      margin-right: 10px;
      overflow: hidden;
      border: 1px solid var(--cell-border);
   }

   .image-wrapper img {
      width: 100%;
      transform: scale(1.2);
   }

   .o {
      background: var(--cell-panel);
      /* background: var(--alpha-01); */
   }

   .header h2 {
      font-size: 0.9rem;
      font-weight: normal;
      padding: 0.5rem;
      width: auto;
      transition: 0.2s;
      border-radius: 8px;
      cursor: pointer;
      margin: 0;
      margin-left: -0.5rem;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
   }

   .header h2:hover {
      background: var(--cold-blue-focus);
   }

   svg.triangle {
      width: 20px;
      height: 20px;
      fill: var(--light-12);
   }

   .descending {
      transform-box: fill-box;
      transform-origin: 7px 10px;
      transform: rotate(180deg);
   }

   .header div {
      display: flex;
      gap: 10px;
   }

   .champion div {
      display: flex;
      align-items: center;
   }

   .champion a {
      display: flex;
      align-items: center;
      color: var(--color-font);
      text-decoration: none;
      transition: 0.2s;
   }

   .champion div {
      position: relative;
   }

   .champion div span:hover {
      color: var(--color-font-focus);
   }

   .champion div span:after {    
      background: none repeat scroll 0 0 transparent;
      position: absolute;
      bottom: -3px;
      content: "";
      display: block;
      height: 1px;
      left: 50%;
      background: var(--color-font-focus);
      transition: width 0.3s ease 0s, left 0.3s ease 0s;
      width: 0;
   }

   .champion div span:hover:after { 
      width: 100%; 
      left: 0;
   }
   

   .rank, .grade {
      min-width: 80px;
   }

   .name-image {
      min-width: 150px;
   }

   .winrate, .pickrate {
      min-width: 100px;
   }

   .games {
      min-width: 100px;
   }

   .loading-champ-list {
      display: flex;
      justify-content: center;
      margin-top: 20vh;
      color: var(--color-font);
      width: 100%;
      text-align: center;
   }
   
</style>