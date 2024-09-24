<script>
import Loading from '../components/Loading.vue'
import UXTooltip from '../components/UXTooltip.vue'
import axios from 'axios'
import champions from '../constants/champions'
import { superStore } from '@/stores/superStore'

export default {
   components: {
      Loading,
      UXTooltip
   },
   data() {
      return {
         store: superStore(),
         champions: null,
         total: null,
         region: 'Global',
         sort: 1,
         sortOrder: 1,
         winrates: {
            max: 0,
            min: 101,
            delta: 0
         },
         descending: false,
         metricSort: false,
         mean: false,
         patchParam: '',
      }
   },

   head: {
      meta: function() {
         return [
            { property: 'og:title', content: `${this.$route.meta.title}`},
            { property: 'og:type', content: `website`},
            { property: 'og:url', content: `https://aramstats.lol${this.$route.fullPath}`},
            { property: 'og:description', content: `ARAM tier list for patch ${this.store.cleanPatch}.`},
            { name: 'description', content: `ARAM tier list for patch ${this.store.cleanPatch}.`},
            { name: 'keywords', content: `ARAM tier list`}
         ]
      }
   },

   created() {
      this.lookup() 
   },
   
   methods: {
      patchChange(patch) {
         this.$router.push({ query: { patch: this.cleanPatch(patch) } })
      },

      computeSampleMean(o, g) {
         if (!o) return '-'
         return Math.round(o / g)
      },
      
      computeSampleVariance(games, x, xx) {
         if (!games) return '-'
         return Math.round(Math.sqrt((( xx ) - (( x**2 ) / games)) / (games - 1)))
      },
      
      champIcon(id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/${champions.imageName[id]}.png`
      },

      lookup() {
         const url = `/api/championsList`
         this.patchParam = new URLSearchParams(window.location.search).get('patch')

         axios.get(url, {params: { patch: this.patchParam }}).then(res => {
            this.champions = res.data
            this.computeWinrates()
         }).catch(e => {
            console.log('error', e)
         })
      },
      
      computeWinrates() {
         for (const i in this.champions) {
            const c = this.champions[i]
            c.winrate = Math.round(c.wins / c.games * 10000) / 100

            for (const j in c.metrics) {
               c[j] = {}
               c[j].m = this.computeSampleMean(c.metrics[j].x, c.games)
               c[j].v = this.computeSampleVariance(c.games, c.metrics[j].x, c.metrics[j].xx)
            }
            
            delete c.metrics
            if (c.winrate > this.winrates.max) this.winrates.max = c.winrate
            if (c.winrate < this.winrates.min) this.winrates.min = c.winrate
         }
         
         // this.winrates is for the lerp homie.
         this.winrates.delta = this.winrates.max - this.winrates.min
      },

      headerSort(sort) {
         if (sort === this.sort) {
            this.descending = !this.descending
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
      },

      cleanPatch(patch) {
         return patch.split('.').slice(0, 2).join('.')
      },

      headersExtended(val) {
         switch (val) {
            case 4:
               return 'DPM µ'
            case 5:
               return 'DPM σ'
            case 6:
               return 'DTPM µ'
            case 7:
               return 'DTPM σ'
            case 8:
               return 'DMPM µ'
            case 9:
               return 'DMPM σ'
            case 10:
               return 'GPM µ'
            case 11:
               return 'GPM σ'
            default:
               return '-'
         }
      }
   },

   computed: {
      headers() {
         return [
            ['Champion', '_id'],
            ['Winrate', 'winrate'],
            ['Games', 'games'],
            ['Pickrate', 'pickRate'],
            ['DPM', 'dpm'],
            ['DTPM', 'dtpm'],
            ['SMPM', 'dmpm'],
            ['GPM', 'gpm'],
         ]
      },

      patch() {
         if (this.store.patches) return this.store.patches[0]
      },

      getChampionsList() {
         if (this.champions) {
            switch (true) {
               case this.sort === 0:
                  return (this.descending) ? this.champions.sort((a, b) => champions.humanName[b._id].localeCompare(champions.humanName[a._id])) :
                     this.champions.sort((a, b) => champions.humanName[a._id].localeCompare(champions.humanName[b._id]))
               case this.sort === 1:
                  return (this.descending) ? this.champions.sort((a, b) => (a.winrate) - (b.winrate)) :
                     this.champions.sort((a, b) => (b.winrate) - (a.winrate))
               case this.sort === 2:
                  return (this.descending) ? this.champions.sort((a, b) => (a.games) - (b.games)) :
                     this.champions.sort((a, b) => (b.games) - (a.games))
               case this.sort === 3:
                  return (this.descending) ? this.champions.sort((a, b) => (a.pickRate) - (b.pickRate)) :
                     this.champions.sort((a, b) => (b.pickRate) - (a.pickRate))
               case this.sort === 4 && typeof(this.champions[0].dpm) === 'object':
                  return (this.descending) ? this.champions.sort((a, b) => (a.dpm.m) - (b.dpm.m)) :
                     this.champions.sort((a, b) => (b.dpm.m) - (a.dpm.m))
               case this.sort === 5 && typeof(this.champions[0].dpm) === 'object':
                  return (this.descending) ? this.champions.sort((a, b) => (a.dpm.v) - (b.dpm.v)) :
                     this.champions.sort((a, b) => (b.dpm.v) - (a.dpm.v))
               case this.sort === 6 && typeof(this.champions[0].dtpm) === 'object':
                  return (this.descending) ? this.champions.sort((a, b) => (a.dtpm.m) - (b.dtpm.m)) :
                     this.champions.sort((a, b) => (b.dtpm.m) - (a.dtpm.m))
               case this.sort === 7 && typeof(this.champions[0].dtpm) === 'object':
                  return (this.descending) ? this.champions.sort((a, b) => (a.dtpm.v) - (b.dtpm.v)) :
                     this.champions.sort((a, b) => (b.dtpm.v) - (a.dtpm.v))
               case this.sort === 8 && typeof(this.champions[0].dmpm) === 'object':
                  return (this.descending) ? this.champions.sort((a, b) => (a.dmpm.m) - (b.dmpm.m)) :
                     this.champions.sort((a, b) => (b.dmpm.m) - (a.dmpm.m))
               case this.sort === 9 && typeof(this.champions[0].dmpm) === 'object':
                  return (this.descending) ? this.champions.sort((a, b) => (a.dmpm.v) - (b.dmpm.v)) :
                     this.champions.sort((a, b) => (b.dmpm.v) - (a.dmpm.v))
               case this.sort === 10 && typeof(this.champions[0].gpm) === 'object':
                  return (this.descending) ? this.champions.sort((a, b) => (a.gpm.m) - (b.gpm.m)) :
                     this.champions.sort((a, b) => (b.gpm.m) - (a.gpm.m))
               case this.sort === 11 && typeof(this.champions[0].gpm) === 'object':
                  return (this.descending) ? this.champions.sort((a, b) => (a.gpm.v) - (b.gpm.v)) :
                     this.champions.sort((a, b) => (b.gpm.v) - (a.gpm.v))
               default:
                  return this.champions.sort((a, b) => champions.humanName[a._id].localeCompare(champions.humanName[b._id]))
            }
         }
      },
   }
}

</script>

<template>
   <div v-if="this.champions" class="champ-list-main">
      <div class="utilities">

         <div class="patch-wrapper">
            <span class="superscript">Patch:</span>
            <button class="patch-button">{{ this.patchParam || this.cleanPatch(this.patch) }}</button>
            <div class="patch-options">
               <button @click="this.patchChange(patch)" v-for="patch in this.store.patches" :key="patch">{{ this.cleanPatch(patch) }}</button>
            </div>
         </div>

         <div class="sort-wrapper">
            <span class="superscript">Sorting by:</span>
            <button v-if="this.sort < 4" class="sort-button">{{ this.headers[this.sort][0] }}</button>
            <button v-else class="sort-button">{{ this.headersExtended(this.sort) }}</button>
            <div class="sort-options">
               <div v-for="(h, i) in this.headers" :key="i">
                  <button v-if="i < 4" @click="this.sort = i">{{ h[0] }}</button>
                  <div class="sort-metrics" v-else>
                     <span>{{ h[0] }}:</span>
                     <button @click="this.sort = (Math.floor(i / 4) - 1) * 4 + i + (i % 4)">µ</button>
                     <button @click="this.sort = (Math.floor(i / 4) - 1) * 4 + i + (i % 4) + 1">σ</button>
                  </div>
               </div>
            </div>
         </div>

         <button @click="this.descending = !this.descending">
            <svg width="18" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
               <rect class="asc-des" x="2" y="8" :width="this.descending ? '6' : '18'" height="2" />
               <rect class="asc-des" x="2" y="13" width="11" height="2" />
               <rect class="asc-des" x="2" y="18" :width="this.descending ? '18' : '6'" height="2" />
            </svg>
         </button>
         <UXTooltip class='toads' :align="'left'" :tip="'tierlist'" />
      </div>
      <div class="champ-table">
         <div class="header">
            <div v-for="(h, i) in this.headers" :key="i">
               <div v-if="i < 4">
                  <h2 :class="{'highlight': this.sort === i}"
                     @click="this.headerSort(i)">{{ h[0] }}</h2>
               </div>
               <div v-else class="metrics">
                  <div>
                     <h3 @click="this.headerSort(i)">{{ h[0] }}</h3>
                     <hr>
                  </div>
                  <div>
                     <h2 :class="{'highlight': this.sort === (Math.floor(i / 4) - 1) * 4 + i + (i % 4)}"
                        @click="this.headerSort((Math.floor(i / 4) - 1) * 4 + i + (i % 4))">µ</h2>
                     <h2 :class="{'highlight': this.sort === (Math.floor(i / 4) - 1) * 4 + i + (i % 4) + 1}"
                        @click="this.headerSort((Math.floor(i / 4) - 1) * 4 + i + (i % 4) + 1)">σ</h2>
                  </div>
               </div>
            </div>
         </div>
         <div :class="{'o': i % 2 === 0}" class="champion" v-for="(champ, i) in getChampionsList" :key="i">
            <div class="index">
               {{ i+1 }}
            </div>
            <div>
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
            <div>
               {{ champ.games }}
            </div>
            <div>
               {{ champ.pickRate }}%
            </div>
            <div class="metric-value">
               <span>{{ (champ.dpm) ? champ.dpm.m : '-' }}</span>
               <span>{{ (champ.dpm) ? champ.dpm.v : '-' }}</span>
            </div>
            <div class="metric-value">
               <span>{{ (champ.dtpm) ? champ.dtpm.m : '-' }}</span>
               <span>{{ (champ.dtpm) ? champ.dtpm.v : '-' }}</span>
            </div>
            <div class="metric-value">
               <span>{{ (champ.dmpm) ? champ.dmpm.m : '-' }}</span>
               <span>{{ (champ.dmpm) ? champ.dmpm.v : '-' }}</span>
            </div>
            <div class="metric-value">
               <span>{{ (champ.gpm) ? champ.gpm.m : '-' }}</span>
               <span>{{ (champ.gpm) ? champ.gpm.v : '-' }}</span>
            </div>
         </div>
      </div>
   </div>
   <div v-else class="loading-champ-list">
      <Loading />
   </div>
   
</template>

<style scoped>
   .utilities {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 950px;
   }

   .toads {
      /* alignment */
      margin-bottom: 5px;
   }
   
   .highlight {
      color: var(--surface-tint);
   }

   .patch-options, .sort-options {
      display: none;
      position: absolute;
      flex-direction: column;
      background: var(--surface);
      padding: 4px 5px;
      border-radius: 3px;
      border: 1px solid var(--outline-variant);
      z-index: 2;
   }

   .patch-wrapper:hover .patch-options {
      display: flex;
   }
   
   .sort-wrapper:hover .sort-options {
      display: flex;
   }

   .patch-wrapper:hover .patch-button {
      border: 1px solid var(--outline);
   }
   .sort-wrapper:hover .sort-button {
      border: 1px solid var(--outline);
   }
   
   .utilities > button {
      margin-bottom: 5px;
   }
   
   .utilities button {
      font-size: 0.9rem;
      padding: 0rem 1rem;
      height: 30px;
      min-width: 45px;
      cursor: pointer;
      border-radius: 3px;
      border: 1px solid var(--outline-variant);
      background: var(--surface);
      color: var(--color-font);
      transition: 150ms ease-in-out;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
   }

   .patch-wrapper > button, .sort-wrapper > button {
      margin-bottom: 5px;
   }

   .superscript {
      color: var(--color-font-faded);
      position: absolute;
      font-size: 0.75rem;
      transform: translateY(-1.1rem);
      text-wrap: nowrap;
   }

   .patch-options button, .sort-options button {
      border: none;
      display: inline-block;
      cursor: pointer;
      border-radius: 3px;
      min-width: 45px;
      padding: 6px 10px;
   }

   button.sort-button {
      min-width: 100px;
   }

   .patch-options button:hover, .sort-options button:hover {
      background: var(--surface-container-highest);
   }

   .sort-metrics span {
      display: inline-block;
      font-weight: normal;
      font-size: 0.7rem;
      padding-left: 10px;
      width: 40px;
      color: var(--color-font-faded);
   }

   .asc-des {
      padding: 0;
      fill: var(--color-font);
      transition: 500ms ease-out;
   }
   
   .region-button {
      padding: 0.5rem 1rem;
      background: tomato;
   }

   .champ-list-main {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 6vh;
   }

   .champ-table {
      width: 950px;
      padding-bottom: 15vh;
      color: var(--color-font)
   }

   .champion {
      display: flex;
      padding-left: 20px;
      align-items: center;
      height: 40px;
      border-radius: 3px;
      font-size: 0.85rem;
   }

   .header {
      position: sticky;
      padding-top: 4vh;
      top: 0;
      background: var(--surface);
      z-index: 1;
      border-radius: 0px;
      display: flex;
      align-items: flex-end;
      padding-left: 50px; /* Same width as .champion:nth-child(1) */
      border-bottom: 1px solid var(--outline-variant);
      padding-bottom: 10px;
      margin-bottom: 5px;
   }

   .image-wrapper {
      height: 30px;
      width: 30px;
      margin-right: 10px;
      overflow: hidden;
      border: 1px solid var(--outline-variant);
   }

   .image-wrapper img {
      width: 100%;
      transform: scale(1.1);
   }

   .o {
      background: var(--surface-container);
   }

   .header h2 {
      font-size: 0.85rem;
      font-weight: 600;
      transition: 0.2s;
      cursor: pointer;
      margin: 0;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
   }
   
   .header h3 {
      display: inline-block;
      text-wrap: nowrap;
      font-size: 0.7rem;
      color: var(--color-font-faded);
      font-weight: normal;
      margin: 0;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
   }

   .metrics hr {
      border: none;
      background-color: var(--outline-variant);
      display: inline-block;
      width: 60%;
      height: 1px;
      margin: 0;
   }

   .metrics {
      width: 120px;
   }

   .metrics > div {
      display: flex;
      align-items: center;
      gap: 2px;
   }

   .metrics > div h2 {
      width: 59px;
   }

   svg.triangle {
      width: 20px;
      height: 20px;
      fill: var(--secondary);
   }

   .descending {
      transform-box: fill-box;
      transform-origin: 7px 10px;
      transform: rotate(180deg);
   }

   .champion div {
      display: flex;
      align-items: center;
   }

   .champion a {
      display: flex;
      align-items: center;
      font-family: var(--font-main);
      color: var(--color-font);
      text-decoration: none;
      transition: 0.2s;
   }

   .champion div {
      position: relative;
   }

   .champion div span {
      transition: 200ms ease-in-out;
   }

   .champion div span:hover {
      color: var(--color-font-focus);
   }

   .champion div span:hover:after { 
      width: 100%; 
      left: 0;
   }

   .rank, .grade {
      min-width: 80px;
   }

   /* INDEX */
   .champion > div:nth-child(1) {
      min-width: 30px; 
   }

   /* CHAMPINON NAME */
   .champion > div:nth-child(2), .header > div:nth-child(1) {
      min-width: 150px; 
   }

   /* WINRATE */
   .champion > div:nth-child(3), .header > div:nth-child(2) {
      min-width: 90px;
   }

   /* GAMES */
   .champion > div:nth-child(4), .header > div:nth-child(3) {
      min-width: 90px;
   }
   
   /* PICKRATE */
   .champion > div:nth-child(5), .header > div:nth-child(4) {
      min-width: 90px;
   }

   /* DPM */
   .champion > div:nth-child(6), .header > div:nth-child(5) {
      min-width: 120px;
   }

   /* DTPM */
   .champion > div:nth-child(7), .header > div:nth-child(6) {
      min-width: 120px;
   }

   /* SMPM */
   .champion > div:nth-child(8), .header > div:nth-child(7) {
      min-width: 120px;
   }

   /* GPM */
   .champion > div:nth-child(9), .header > div:nth-child(8) {
      min-width: 120px;
   }

   .metric-value {
      gap: 2px;
   }

   .metric-value span {
      width: 59px;
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