<script>
// import { championStore } from '@/stores/fchampionStore'
import Tooltip from '@/components/Tooltip.vue'

export default {
   components: {
      Tooltip
   },
   data() {
      return {
         // config: championStore(),
         item: null,
         wins: 0,
         total: 0,
         mean: 0,
         popularity: 0,
         slotPopularity: [0, 0, 0, 0, 0, 0],
         popularityFocus: null,
         slotWinrate: [0, 0, 0, 0, 0, 0],
      }
   },

   methods: {
      setItem(id) {
         this.setLabels(id)

         for (const [k , v] of Object.entries(this.champion.items)) {
            if (v[this.item]) {
               this.wins += v[this.item].wins
               this.slotPopularity[k-1] = (v[this.item].games / this.total)
               this.slotWinrate[k-1] = (v[this.item].wins / v[this.item].games)
            }
         }
         this.popularity = (this.total / this.champion.games * 100).toFixed(1) + '%' 
      },

      setLabels(o) {
         if (o) {
            this.item = o
            this.total = this.itemSum()
         } else {
            this.item = null
            this.total = 0
         }

         this.wins = 0
         this.mean = 0
         this.popularity = 0
         this.slotPopularity = [0, 0, 0, 0, 0, 0]
         this.slotWinrate = [0, 0, 0, 0, 0, 0]
      },

      itemSum() {
         let lobster = 0
         for (const o in this.champion.items) {
            if (this.champion.items[o][this.item]) {
               lobster += this.champion.items[o][this.item].games
            }
         }
         return lobster
      },

      itemImage(id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${id}.png`
      },

      winrate(total, win) {
         return (win / total * 100)
      },

   },

   computed: {
      getItemName() {
         if (this.itemData && this.item) {
            return this.itemData[this.item].name
         }
      }

   },

   props: {
      champion: null,
      patch: null,
      itemData: null,
   }
}
</script>

<template>
   <div class="items-main" id="items">
      <div class="section-header">
         <h1>Items</h1>
         <!-- <img @click="this.config.modals.items = true" class="settings" src="@/assets/ellipses.svg" alt=""> -->
      </div>
      <div class="section">
         <div class="synopsis">
            <div class="synopsis-header">
               <div class="image-wrapper">
                  <img v-if="this.item" :src="this.itemImage(this.item)" @click="this.setLabels()" alt="">
               </div>
               <div v-if="this.item">{{ getItemName }}</div>
               <div class="placeholder" v-else>Click an item</div>
            </div>
            <div class="synopsis-body">

               <div>
                  <div class="chart-header">
                     <h4>Popularity</h4>
                     <Tooltip :align="'left'" :tip="'popularity'" />
                  </div>
                  <svg>
                     <g v-for="(k, i) in 6" :key="i">
                        <text :x="`${i * 37 + 18}`" y="95%">{{ (this.slotPopularity[i] * 100).toFixed(1) + '%'}}</text>
                        <rect @mouseenter="this.popularityFocus = k" :class="{ 'rect-focus': this.popularityFocus === k }" class="backdrop" :x="`${i * 37 + 5}`" y="20%" rx="2" width="24" height="80%"></rect>
                        <rect @mouseenter="this.popularityFocus = k" class="value" :x="`${i * 37 + 5}`" y="20%" rx="2" width="24" :height="this.slotPopularity[i] * 80"></rect>
                     </g>
                  </svg>
                  <div class="details">
                     <div>Item Popularity: <span class="value">{{ (this.item) ? this.popularity : '-' }}</span></div>
                     <div>Slot Frequency: <span class="value"> {{ (this.popularityFocus && this.item) ? this.champion.items[this.popularityFocus][this.item].games : '-' }} </span></div>
                     <div>Total Frequency: <span class="value">{{ this.total || '-' }}</span></div>
                  </div>
               </div>
               <div>
                  <div class="chart-header">
                     <h4>Winrate</h4>
                     <Tooltip :align="'left'" :tip="'winrate'" />
                  </div>
                  <svg>
                     <g v-for="(_, i) in 6" :key="i">
                        <text :x="`${i * 37 + 18}`" y="95%">{{ (this.slotWinrate[i] * 100).toFixed(0) + '%'}}</text>
                        <rect class="backdrop" :x="`${i * 37 + 5}`" y="20%" rx="2" width="24" height="80%"></rect>
                        <rect class="value" :x="`${i * 37 + 5}`" y="20%" rx="2" width="24" :height="this.slotWinrate[i] * 80"></rect>
                     </g>
                  </svg>
                  <div class="details">
                     <div>Item winrate: <span class="value">{{ (this.item) ? ((this.wins / this.total) * 100).toFixed(1) + '%' : '-'  }}</span></div>
                  </div>
               </div>
            </div>
         </div>
         <div class="table">
            <div class="headers">
               <h3 v-for="i in 6" :key="i">{{ i }}</h3>
            </div>
            <div class="table-data">
               <div class="column" :class="{ 'column-bg': (i + 1) % 2 === 0 }" v-for="i in 6" :key="i">
                  <div class="element" v-for="([k, v], j) of Object.entries(this.champion.items[i]).sort((a, b) => b[1].games - a[1].games)" :key="j">
                     <img :class="{'item-fade' : this.item != k && this.item }" :src="this.itemImage(k)" @click="this.setItem(k)" alt="">
                     <div>
                        <div :class="{ 'font-fade': this.item != k && this.item }" class="winrate">{{ this.winrate(v.games, v.wins).toFixed(1) + '%' }}</div>
                        <div class="games">{{ v.games }}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
@import url(./styles.css);

.section {
   color: var(--color-font);
   height: 80vh;
   display: flex;
   justify-content: space-between;
}
.synopsis {
   border-right: 1px solid var(--cell-border);
   width: 270px;
   padding-left: 20px;
}

.synopsis-header {
   display: flex;
   align-items: center;
   margin-top: 30px;
   margin-bottom: 50px;
   gap: 20px;
   font-weight: bold;
}

.synopsis-body {
   display: flex;
   flex-direction: column;
}

.synopsis-body > div {
   margin-bottom: 30px;
   width: 220px;
}

.placeholder {
   font-size: 0.75rem;
   font-weight: normal;
   font-style: italic;
   color: var(--color-font-faded);
}
.chart-header {
   display: flex;
   gap: 10px;
   align-items: center;
}

h4 {
   display: inline-block;
   margin: 0;
   font-weight: normal;
   font-size: 0.9rem;
   color: var(--color-font);
}

svg {
   width: inherit;
   height: 100px;
   margin-top: 10px;
   margin-bottom: 5px;
}

text {
   fill: var(--color-font);
   font-size: 0.7rem;
   text-anchor: middle;
}
text.slot {
   fill: var(--color-font);
   font-size: 0.75rem;
}

.synopsis-body > div:first-child rect {
   cursor : pointer;
}

rect.backdrop {
   fill: var(--cell-backdrop);
   transform: rotate(180deg) scaleX(-1);
   transform-origin: center center;
   transition: 0.15s ease-in-out; 
}
rect.value {
   fill: var(--alpha-12);
   transform: rotate(180deg) scaleX(-1);
   transform-origin: center center;
   transition: height 0.5s;
}

rect.rect-focus {
   fill: var(--light-15);
}

.details {
   font-size: 0.8rem;
   width: 180px;
   color: var(--color-font-faded);
}

.details > div {
   display: flex;
   justify-content: space-between;
   margin-bottom: 0.25rem;
   margin-left: 5px;
}

.details .value {
   min-width: 50px;
   color: var(--color-font);
}

.image-wrapper {
   width: 42px;
   height: 42px;
   border: 1px solid var(--cell-border);
   background: var(--alpha-01);
}
.image-wrapper img {
   width: inherit;
   height: inherit;
   cursor: pointer;
}

.table {
   width: 780px;
   display: flex;
   flex-direction: column;
}
.table-data {
   width: 100%;
   height: calc(80vh - 2.5rem);
   display: flex;
   justify-content: space-around;
}


.headers {
   width: 100%;
   display: flex;
   justify-content: space-around;
}

.headers h3 {
   margin: 0;
   font-weight: normal;
   color: var(--color-font-faded);
   font-size: 1rem;
   margin-bottom: 1.5rem;
}

.column {
   padding: 20px;
   border-radius: 5px;
   overflow-y: scroll;
}

.column::-webkit-scrollbar {
   width: 4px;
}

.column::-webkit-scrollbar-track {
   border-radius: 5px;
   padding-right: 15px;
}

.column::-webkit-scrollbar-thumb {
   background: var(--alpha-06);
   border-radius: 5px;
   
}
.column::-webkit-scrollbar-thumb:hover {
   background: var(--light-12);
   transition: 0.25s;
}

.winrate {
   color: var(--color-font);
   font-size: 0.8rem;
   transition: 0.25s ease-in-out;
}
.element {
   margin-bottom: 10px;
   text-align: center;
   -webkit-touch-callout: none; /* iOS Safari */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Old versions of Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}
.games {
   color: var(--color-font-faded);
   font-size: 0.75rem;
}
.column-bg {
   background: var(--alpha-01);
}

.column img {
   display: block;
   margin: 0 auto;
   margin-bottom: 3px;
   width: 34px;
   cursor: pointer;
   border: 1px solid var(--cell-border);
   transition: 0.25s ease-in-out;
}

img.item-fade {
   filter: saturate(0);
   opacity: 0.3;
}

.font-fade {
   color: var(--color-font-faded);
}


</style>