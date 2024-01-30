<script>
import { championStore } from '@/stores/championConfig'
import Tooltip from './Tooltip.vue'

export default {
   components: {
      Tooltip
   },
   data() {
      return {
         config: championStore(),
         item: null,
      }
   },

   created() {
      // console.log(this.itemData)
   },
   
   methods: {
      setItem(id) {
         this.item = id
      },

      itemImage(id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${id}.png`
      },

      winrate(total, win) {
         return (win / total * 100).toFixed(1) + '%'
      },

      slotPopularity(i) {
         // Normalize data between 0 and 1?
         if (!this.item || !(this.item in this.champion.items[i])) return '0'
         return (this.champion.items[i][this.item].games / this.champion.games * 100).toFixed(1) + '%'
      },
      
      slotWinrate(i) {
         if (!this.item || !(this.item in this.champion.items[i])) return '0'
         return this.winrate(this.champion.items[i][this.item].games, this.champion.items[i][this.item].wins)
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
   <div class="items-main">
      <div class="section-header">
         Items
         <!-- <img @click="this.config.modals.items = true" class="settings" src="@/assets/ellipses.svg" alt=""> -->
      </div>
      <div class="section">
         <div class="synopsis">
            <div class="synopsis-header">
               <div class="image-wrapper">
                  <img v-if="this.item" :src="this.itemImage(this.item)" @click="this.item = null" alt="">
               </div>
               <div v-if="this.item">{{ getItemName }}</div>
               <div class="placeholder" v-else>Click an item</div>
            </div>
            <div class="popularity">
               <div>
                  <h4>Popularity</h4>
                  <Tooltip :tip="'popularity'" />
               </div>
               <svg>
                  <g v-for="i in 6" :key="i">
                     <text class="slot" x="1%" :y="`${(i - 1) * 17 + 10}%`">{{ i }}</text>
                     <text class="text" x="18%" :y="`${(i - 1) * 17 + 10}%`">{{ this.slotPopularity(i) }}</text>
                     <rect class="backdrop" x="13%" :y="`${(i - 1) * 17}%`" width="100%" height="32"></rect>
                     <rect class="value" x="13%" :y="`${(i - 1) * 17}%`" :width="this.slotPopularity(i)" height="32"></rect>
                  </g>
               </svg>
            </div>
            <div class="winrate">
               <div>
                  <h4>Winrate</h4>
                  <Tooltip :tip="'winrate'"/>
               </div>
               <svg>
                  <g v-for="i in 6" :key="i">
                     <text class="slot" x="1%" :y="`${(i - 1) * 17 + 10}%`">{{ i }}</text>
                     <text class="text" x="18%" :y="`${(i - 1) * 17 + 10}%`">{{ this.slotWinrate(i) }}</text>
                     <rect class="backdrop" x="13%" :y="`${(i - 1) * 17}%`" width="100%" height="32"></rect>
                     <rect class="value" x="13%" :y="`${(i - 1) * 17}%`" :width="this.slotWinrate(i)" height="32"></rect>
                  </g>
               </svg>
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
                        <div :class="{ 'font-fade': this.item != k && this.item }" class="winrate">{{ this.winrate(v.games, v.wins) }}</div>
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
}
.synopsis {
   border-right: 1px solid var(--cell-border);
   width: 320px;
}

.synopsis-header {
   display: flex;
   align-items: center;
   padding: 30px 0;
   /* padding-bottom: 50px; */
   gap: 20px;
   font-weight: bold;
}

.placeholder {
   font-size: 0.75rem;
   font-weight: normal;
   font-style: italic;
   color: var(--color-font-faded);
}

.synopsis .popularity, .synopsis .winrate {
   padding-top: 40px;
}

.popularity div, .winrate div {
   display: flex;
   gap: 20px;
}
h4 {
   margin: 0;
   font-weight: normal;
   font-size: 0.9rem;
   margin-bottom: 1rem;
   color: var(--color-font);
}

svg {
   width: 160px;
   height: 220px;
}

text.text {
   fill: var(--color-font);
   font-size: 0.8rem;
}
text.slot {
   fill: var(--color-font);
   font-size: 0.75rem;
}
rect.backdrop {
   fill: var(--cell-backdrop);
   /* transform: rotate(180deg) scaleX(-1); */
   transform-origin: center center;
}
rect.value {
   fill: var(--alpha-09);
   /* transform: rotate(180deg) scaleX(-1); */
   transform-origin: center center;
   transition: width 0.5s;
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
   /* border: 1px solid var(--cell-border); */
}

.table {
   width: 100%;
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
   /* border: 1px solid var(--light-03); */
}

.font-fade {
   color: var(--color-font-faded);
}


</style>