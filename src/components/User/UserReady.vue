<script>
import RadarChart from '../RadarChart.vue'
import Tooltip from '@/components/Tooltip.vue'
import Champion from '../Champion.vue'
import Heatmap from '../Heatmap.vue'
import _names from '@/constants/champions.js'
import { summonerStore } from '@/stores/summonerStore'

export default {
   components: {
      RadarChart,
      Tooltip,
      Champion,
      Heatmap
   },

   data() {
      return {
         names: _names,
         championFilter: '',
         championPool: summonerStore().championPool,
         sortFilter: null,
         toggleState: false,
         descending: false,
      }
   },

   mounted() {
      console.log(this.data, 'potatos')
      window.addEventListener('keypress', this.championSearchFocus)
   },

   beforeUnmount() {
      window.removeEventListener('keypress', this.championSearchFocus)
   },
   
   methods: {
      championSearchFocus(e) {
         if (e.key !== 's' || document.activeElement === this.$refs.championSearch) return

         e.preventDefault()
         this.$refs.championSearch.focus()
      },

      toggleAll() {
         this.toggleState = !this.toggleState

         if (this.toggleState) {
            for (const c of this.data.championData) {
               this.championPool.add(c.championId)
            }
         } else {
            this.championPool.clear()
         }

      },

      sort(idx) {
         if (idx === this.sortFilter) {
            (this.descending) ? this.sortFilter = null : this.descending = true

         } else {
            this.sortFilter = idx
            this.descending = false
         }
      },

      updateProfile() {

      },

      deleteProfile() {

      }
   },
   
   computed: {

      filteredChampions() {
         return this.data.championData.filter(c => this.names.urlName[c.championId].toLowerCase().includes(this.championFilter.toLowerCase()))
      },
      
      sortedChampions() {
         switch (this.sortFilter) {
            case 0:
               return (this.descending) ? this.filteredChampions.sort((a, b) => this.names.urlName[b.championId].localeCompare(this.names.urlName[a.championId])) : 
                  this.filteredChampions.sort((a, b) => this.names.urlName[a.championId].localeCompare(this.names.urlName[b.championId]))
            case 1:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.wins / a.games) - (b.wins / b.games)) : 
                  this.filteredChampions.sort((a, b) => (b.wins / b.games) - (a.wins / a.games))
            case 2:
               return (this.descending) ? this.filteredChampions.sort((a, b) => ((a.avg.k + a.avg.a) / a.avg.d) - ((b.avg.k + b.avg.a) / b.avg.d)) :
                  this.filteredChampions.sort((a, b) => ((b.avg.k + b.avg.a) / b.avg.d) - ((a.avg.k + a.avg.a) / a.avg.d))
            case 3:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.kp) - (b.avg.kp)) :
                  this.filteredChampions.sort((a, b) => (b.avg.kp) - (a.avg.kp))
            case 4:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.tdd) - (b.avg.tdd)) :
                  this.filteredChampions.sort((a, b) => (b.avg.tdd) - (a.avg.tdd))
            case 5:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.tdt) - (b.avg.tdt)) :
                  this.filteredChampions.sort((a, b) => (b.avg.tdt) - (a.avg.tdt))
            case 6:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.tsm) - (b.avg.tsm)) :
                  this.filteredChampions.sort((a, b) => (b.avg.tsm) - (a.avg.tsm))
            case 7:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.th) - (b.avg.th)) :
                  this.filteredChampions.sort((a, b) => (b.avg.th) - (a.avg.th))
            case 8:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.ah) - (b.avg.ah)) :
                  this.filteredChampions.sort((a, b) => (b.avg.ah) - (a.avg.ah))
            case 9:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.ge) - (b.avg.ge)) :
                  this.filteredChampions.sort((a, b) => (b.avg.ge) - (a.avg.ge))
            default:
               return this.filteredChampions.sort((a, b) => (b.games) - (a.games))
         }
      },

      profileIcon() {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/profileicon/${this.data.profileIcon}.png`
      },

      lhsHeaders() {
         return ['Champion', 'Winrate']
      },

      rhsHeaders() {
         return ['KDA', 'KP', 'Damage', 'Taken', 'Mitigated', 'Healed', 'Ally Healing', 'Gold']
      }
   },

   props: {
      data: Object,
      patch: null
   }

}
</script>

<template>
   <div class="summoner-ready-main">
      <div class="gradient-bg" />
      <div class="header">
         <div class="header-lhs">
            <div class="header-summoner-icon">
               <img :src="profileIcon" alt="">
            </div>
            <div class="header-lhs-one">
               <div class="summoner-name">
                  {{ this.data.gameName }}
                  <div class="tagLine">#{{ this.data.tagLine }}</div>
               </div>
               <div class="buttons">
                  <button @click="this.updateProfile()">Update</button>
                  <button @click="this.deleteProfile()">Delete</button>
               </div>
            </div>
         </div>

         <div class="header-rhs">
            <RadarChart :data="this.data.championData" />
         </div>
      </div>
      <div class="body">
         
         <div class="lhs-body">
            <div class="account">
               <div class="section-header">
                  <h2>Account</h2>
                  <Tooltip :align="'left'" :tip="'account'" />
               </div>
            </div>
            <div class="champion-stats">
               <div class="section-header">
                  <h2>Champion Stats</h2>
   
               </div>
               
            </div>
         </div>

         <div class="rhs-body">
            <Heatmap :data="this.data.championData" />
            <div class="champions-panel-header">
               <div class="utility">
                  <div>
                     <input ref="championSearch" @keyup.escape="this.$refs.championSearch.blur()" @click="this.championFilter = ''" type="text" v-model="this.championFilter" spellcheck="false">
                     <span v-show="!this.championFilter.length" class="keyboard-shortcut">
                        Press <kbd>s</kbd> to search
                     </span>
                  </div>
                  <div class="toggle" style="margin-left: auto;">
                     <button @click="this.toggleAll()">Toggle All</button>
                     <!-- <span :class="{ 'toggled': this.toggleState }">
                        Toggle All
                     </span>
                     <svg @click="this.toggleAll()" fill="none">
                        <rect x="0.5" y="0.5" rx="12"/>
                        <circle :class="{ 'toggle-all': this.toggleState }" ref="svgCircle" cx="13" cy="50%" r="9" rx="12"/>
                     </svg> -->
                  </div>
                  <Tooltip :align="'right'" :tip="'championsTable'"/>
               </div>
               <div class="table-headers">
                  <div class="lhs">
                     <div @click="this.sort(i)" v-for="(h, i) in lhsHeaders" :key="i">
                        {{ h }}
                        <hr v-show="this.sortFilter === i" :class="{ 'descending': this.descending }">
                     </div>
                  </div>
                  <div class="rhs">
                     <div @click="this.sort(i+2)" v-for="(h, i) in rhsHeaders" :key="i">
                        {{ h }}
                        <hr v-show="this.sortFilter === i+2" :class="{ 'descending': this.descending }">
                     </div>
                  </div>
               </div>
               <hr>
            </div>
            <div class="champions">
               <Champion
                  :data="c" v-for="c in sortedChampions"
                  :patch="this.patch"
                  :key="c.championId" />
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>

.summoner-ready-main {
   display: flex;
   flex-direction: column;
   margin: 0 auto;
   width: 1100px;
   color: var(--color-font);
}

.header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   margin-top: 5vh;
   padding-top: 4vh;
   padding-bottom: 6vh;
   border-top: 1px solid var(--cell-border);
   /* background: radial-gradient(ellipse at top, var(--cell-panel), var(--cell-panel-rgb) 25%); */
}

.header-lhs {
   display: flex;
}

.header-summoner-icon {
   width: 100px;
   height: 100px;
   overflow: hidden;
   border-radius: 100%;
   border: 1px solid var(--cell-border);
}

.header-summoner-icon img {
   width: 100%;
}

.header-lhs-one {
   padding-left: 1.5rem;
}

.buttons {
   display: flex;
   gap: 8px;
   padding-top: 10px;
}

.buttons button {
   padding: 0.5rem 1rem;
   cursor: pointer;
   border-radius: 3px;
   /* height: 30px; */
   border: 1px solid var(--cell-border);
   background: var(--cold-blue);
   color: var(--color-font);
   font-size: 0.8rem;
   transition: 150ms ease-in-out;
}

.buttons button:hover {
   border: 1px solid var(--light-08);
   /* background: var(--ice-blue); */
   color: var(--color-font-focus);
}

.buttons button:last-child:hover {
   background: var(--danger);
   color: var(--color-font-focus);
}

.buttons div:hover {
   background: var(--cold-blue-focus);
} 

.summoner-name {
   display: inline-block;
   font-size: 2.8rem;
   margin: 0;
   font-family: var(--header-font);
}

.summoner-name .tagLine {
   display: inline-block;
   margin: 0;
   padding-left: 0.7rem;
   font-family: var(--font-main);
   font-size: 1rem;
   color: var(--color-font-faded);
}

.gradient-bg {
   background: radial-gradient(ellipse at top, rgba(var(--color-background-rgb), 0.4), rgba(var(--color-background-rgb), 1) 73%), no-repeat -10% 25%/100% url('../../assets/summoner_assets/backdrop.webp');
   position: absolute;
   z-index: -5;
   margin-top: 5vh;
   width: inherit;
   height: 400px;
}

.body {
   display: flex;
   justify-content: space-between;
   padding-bottom: 10vh;
}

.section-header {
   border-bottom: 1px solid var(--cell-border);
   display: flex;
   align-items: center;
   justify-content: space-between;
}

.lhs-body {
   /* width: 260px; */
   flex: 0 0 260px;
}

.rhs-body {
   flex: 0 0 800px;
}

.champions-panel-header .table-headers {
   /* background: rgba(255, 255, 255, 0.05); */
   display: flex;
   font-size: 0.8rem;
   align-items: center;
   justify-content: space-between;
   height: 30px;
   /* margin-bottom: 4px; */
   /* border-bottom: 1px solid var(--cell-border); */
   /* border-top: 1px solid var(--cell-border); */
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
}


.champions-panel-header hr {
   height: 1px;
   margin: 0;
   border: none;
   background-color: var(--cell-border);
   outline: none;
   transition: transform .1s ease-in-out; 
}

.table-headers hr {
   margin-top: -4px;
}

.descending {
   transform: translateY(8px);
}

.champions {
   margin-top: 5px;
}
.utility {
   display: flex;
   align-items: center;
   margin-bottom: 15px;
}

.utility div:first-child {
   position: relative;
}

.utility .keyboard-shortcut {
   position: absolute;
   z-index: 0;
   left: 8px;
   top: 6px;
   font-size: 0.8rem;
   padding: 0;
   color: var(--color-font-faded);
   pointer-events: none;
}

.keyboard-shortcut kbd {
   display: inline-flex;
   border: 1px solid var(--cell-border);
   border-radius: 3px;
   font-family: var(--font-main);
   justify-content: center;
   line-height: 0.3rem;
   padding: 6px 4px;
}

.utility input {
   background: var(--off-blue);
   border: 1px solid var(--cell-border);
   color: var(--color-font);
   padding: .4rem .45rem;
   border-radius: 3px;
   transition: .2s;
}

.utility input:focus {
   outline: none;
   background: var(--cold-blue-focus);
   /* background: #141820; */
}

.utility button {
   padding: 0 1rem;
   margin: 0;
   cursor: pointer;
   border-radius: 3px;
   border: 0;
   margin-right: 10px;
   height: 30px;
   border: 1px solid var(--cell-border);
   background: var(--off-blue);
   color: var(--color-font);
   font-size: 0.75rem;
   transition: background 150ms ease-in-out;
}

.utility button:hover {
   background: var(--cold-blue-focus);
}

.lhs div, .rhs div {
   cursor: pointer;
   line-height: 30px;
}

div.ascending {
   border-bottom: 2px solid var(--cell-border);
   /* background: linear-gradient(to bottom, var(--alpha-01), 50%, transparent 100%); */
   /* background: radial-gradient(ellipse at bottom, tomato 0, transparent 40%); */
}

div.descending {
   line-height: 50px;
}

.table-headers .lhs, .table-headers .rhs {
   /* color: var(--color-font-faded); */
   display: flex;
   font-weight: 600;
   gap: 5px;
   justify-content: flex-end;
   height: 100%;
}

.table-headers .rhs div {
   /* background: tomato; */
   width: 70px;
   /* padding: 8px 0; */
   /* height: 30px; */
}

.table-headers .lhs div:first-child {
   margin-left: 29px;
   width: 160px;
}

.table-headers .lhs div:nth-child(2) {
   width: 50px;
}

.table-headers .rhs div:nth-child(1) {
   width: 65px; /* KP */
}

.table-headers .rhs div:nth-child(2) {
   width: 40px; /* KP */
}

.table-headers .rhs div:nth-child(4) {
   width: 60px; /* Taken */
   /* margin-right: 20px; */
}

.table-headers .rhs div:nth-child(6) {
   width: 55px; /* Healed */
}

.table-headers .rhs div:nth-child(7) {
   width: 75px; /* Ally Healing */
}

.table-headers .rhs div:nth-child(8) {
   margin-left: 5px;
   width: 40px; /* Gold */
}

.section-header h2 {
   font-family: 'Thestral';
   font-size: 1.6rem;
   margin: 0;
}

svg {
   width: 45px;
   height: 26px;
   overflow: hidden;
   cursor: pointer;
   -webkit-touch-callout: none;
   /* iOS Safari */
   -webkit-user-select: none;
   /* Safari */
   -khtml-user-select: none;
   /* Konqueror HTML */
   -moz-user-select: none;
   /* Old versions of Firefox */
   -ms-user-select: none;
   /* Internet Explorer/Edge */
   user-select: none;
   /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

rect {
   width: calc(100% - 1px);
   height: calc(100% - 1px);
   stroke: var(--light-10);
}

circle {
   fill: var(--alpha-07);
   transition: 0.2s cubic-bezier(.25, .52, .64, .84);
}

circle.toggle-all {
   transform: translateX(42%);
   /* fill: var(--light-01); */
   fill: var(--color-font);
}

.toggle {
   display: flex;
   align-items: center;
}

.toggle span {
   font-size: 0.8rem;
   color: var(--color-font-faded);
   padding-right: 5px;
   transition: color 0.3s cubic-bezier(.25, .52, .64, .84);
}

span.toggled {
   color: var(--color-font);
}
</style>