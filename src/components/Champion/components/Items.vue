<script>
import { championStore } from '@/stores/championConfig'

export default {
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
         if (!this.item || !(this.item in this.champion.items[i])) return '0'
         return (this.champion.items[i][this.item].games / this.champion.games * 100).toFixed(1) + '%'
      },
      
      slotWinrate(i) {
         if (!this.item || !(this.item in this.champion.items[i])) return '0'
         return this.winrate(this.champion.items[i][this.item].games, this.champion.items[i][this.item].wins)
      }
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
         <img @click="this.config.modals.items = true" class="settings" src="@/assets/ellipses.svg" alt="">
      </div>
      <div class="section">
         <div class="synopsis">
            <div class="synopsis-header">
               <div class="image-wrapper">
                  <img :src="this.itemImage(this.item)" alt="">
               </div>
               {{ getItemName }}
            </div>
            <div class="popularity">
               <h4>Popularity</h4>
               <svg>
                  <g v-for="i in 6" :key="i">
                     <text class="text" x="5%" :y="`${(i - 1) * 17 + 10}%`">{{ this.slotPopularity(i) }}</text>
                     <rect class="backdrop" x="0" :y="`${(i - 1) * 17}%`" width="100%" height="32"></rect>
                     <rect class="value" x="0" :y="`${(i - 1) * 17}%`" :width="this.slotPopularity(i)" height="32"></rect>
                  </g>
               </svg>
            </div>
            <div class="winrate">
               <h4>Winrate</h4>
               <svg>
                  <g v-for="i in 6" :key="i">
                     <text class="text" x="5%" :y="`${(i - 1) * 17 + 10}%`">{{ this.slotWinrate(i) }}</text>
                     <rect class="backdrop" x="0" :y="`${(i - 1) * 17}%`" width="100%" height="32"></rect>
                     <rect class="value" x="0" :y="`${(i - 1) * 17}%`" :width="this.slotWinrate(i)" height="32"></rect>
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
                  <!-- <h3>{{ i }}</h3> -->
                  <div class="element" v-for="([k, v], j) of Object.entries(this.champion.items[i])" :key="j">
                     <img :src="this.itemImage(k)" @click="this.setItem(k)" alt="">
                     <div>
                        <div class="winrate">{{ this.winrate(v.games, v.wins) }}</div>
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

.synopsis .popularity, .synopsis .winrate {
   padding-top: 40px;
}
h4 {
   margin: 0;
   font-weight: normal;
   font-size: 0.9rem;
   padding-bottom: 1rem;
   color: var(--color-font);
}

svg {
   width: 160px;
   height: 220px;
}

text.text {
   fill: var(--color-font);
   font-size: 0.9rem;
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
   background: var(--alpha-01);
}
.image-wrapper img {
   width: 42px;
   height: 42px;
   border: 1px solid var(--cell-border);
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
   text-align: center;
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
}

.column img:hover {
   background: tomato;
}
.element {
   margin-bottom: 10px;
}
</style>