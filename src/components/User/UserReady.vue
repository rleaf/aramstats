<script>
import axios from 'axios'
import RadarChart from '../RadarChart.vue'
import Tooltip from '@/components/Tooltip.vue'
import Champion from '../Champion.vue'

export default {
   components: {
      RadarChart,
      Tooltip,
      Champion
   },

   data() {
      return {
         championFilter: '',
         championPool: []
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
         if (this.championFilter.length) this.championFilter = ''
         this.$refs.championSearch.focus()
      },

      toggleAll() {
         // Add all champions to championPool
      }
   },
   
   computed: {
      profileIcon() {
         // clogs 403 initially because getpatch hasn't run. once responds w/ patch will update reactively.
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/profileicon/${this.data.profileIcon}.png`      },
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
                  <div class="update">Update</div>
                  <div class="delete">Delete</div>
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
            <div class="timeline">Timeline</div>
            <div class="champions-panel-header">
               <div class="utility">
                  <div>
                     <!-- <input ref="championSearch" :placeholder="this.testo" @keydown.enter="this.championSearchFocus()" type="text" v-model="this.championFilter"> -->
                     <input ref="championSearch" @click="this.championFilter = ''" @keydown.enter="this.championSearchFocus()" type="text" v-model="this.championFilter">
                     <span v-show="!this.championFilter.length" class="keyboard-shortcut">
                        Press <kbd>s</kbd> to filter
                     </span>
                  </div>
                  <button @click="this.toggleAll()">Toggle All</button>
               </div>
               <div class="table-headers">
                  <div class="lhs">
                     <div>Champion</div>
                     <div>Winrate (W/L)</div>
                  </div>
                  <div class="rhs">
                     <div>K/D/A</div>
                     <div>KP</div>
                     <div>Damage</div>
                     <div>Taken</div>
                     <div>Mitigated</div>
                     <div>Healed</div>
                     <div>Ally Healing</div>
                     <div>Gold</div>
                  </div>
               </div>
            </div>
            <div class="champions">
               <Champion :data="c" v-for="c in this.data.championData" :patch="this.patch" :key="c.championId" />
            </div>
            <!-- <div class="champions-panel">
            </div> -->
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
   padding-bottom: 4vh;
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
   gap: 10px;
   padding-top: 10px;
}

.buttons div {
   padding: 0.3rem 0.8rem;
   /* background: var(--cell-panel); */
   background: tomato;
   border-radius: 5px;
   font-size: 0.9rem;
   cursor: pointer;
   transition: 0.15s ease-in-out;
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
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
   display: flex;
   font-size: 0.8rem;
   align-items: center;
   justify-content: space-between;
   height: 35px;
   margin-bottom: 5px;
   border-bottom: 1px solid var(--cell-border);
   /* border-top: 1px solid var(--cell-border); */
}

.utility {
   display: flex;
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
   background: var(--color-background);
   border: 1px solid var(--cell-border);
   color: var(--color-font);
   padding: .45rem .45rem;
   border-radius: 4px;
   transition: .2s;
}

.utility input:focus {
   outline: none;
}

.utility button {
   padding: 0 0.25rem;
   margin: 0;
   cursor: pointer;
   border-radius: 5px;
   border: 0;
   margin-left: 10px;
   background: tomato;
   color: var(--color-font);
   font-size: 0.8rem;
}

.table-headers .lhs, .table-headers .rhs  {
   display: flex;
   font-weight: 600;
}

.table-headers .lhs {
   gap: 5px;
   justify-content: flex-end;
}
.table-headers .lhs {
   gap: 5px;
   justify-content: flex-end;
}

.table-headers .rhs {
   gap: 5px;
   justify-content: flex-end;
}

.table-headers .rhs div {
   width: 70px;
}

.table-headers .lhs div:first-child {
   margin-left: 29px;
   width: 120px;
}

.table-headers .rhs div:nth-child(1) {
   width: 65px; /* KP */
}

.table-headers .rhs div:nth-child(2) {
   width: 40px; /* KP */
}

.table-headers .rhs div:nth-child(4) {
   width: 60px; /* Taken */
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


</style>