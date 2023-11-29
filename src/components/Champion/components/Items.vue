<script>
import champions from '../../../constants/champions'

export default {
   data() {
      return {
         itemTab: 0,
         slotFocus: null,
         activeSelection: [0, 0, 0, 0, 0, 0],
         mouseo: null,
         itemSlots: [{},{},{},{},{},{}],
         idTable: champions.imageName
      }
   },

   created() {
      this.populateItemSlots()
   },

   methods: {
      populateItemSlots() {
         this.itemSlots = [{}, {}, {}, {}, {}, {}]

         for (const [k, v] of Object.entries(this.champion.builds)) {
            const items = k.split('_')

            let continueFlag = false
            for (const u in this.activeSelection) {
               if (this.activeSelection[u] != items[u] && this.activeSelection[u] != 0) {
                  continueFlag = true
                  break
               }
            }
            if (continueFlag) continue
            for (const i in items) {
               if (!this.itemSlots[i][items[i]]) {
                  this.itemSlots[i][items[i]] = [v.games, v.wins]
               } else {
                  this.itemSlots[i][items[i]][0] += v.games
                  this.itemSlots[i][items[i]][1] += v.wins
               }
            }
         }
      },
      deselectSlot(i) {
         this.activeSelection[i - 1] = 0
         this.populateItemSlots()
      },
      recomputeItemSlots(i, id) {
         this.activeSelection[i - 1] = id
         this.populateItemSlots()
      },
      itemSlotSort(i) {
         const x = Object.entries(this.itemSlots[i]).sort((a, b) => b[1][0] - a[1][0])
         return x
      },
      itemImage(Id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${Id}.png`
      },
      toggleItemBin(Id) {
         const idx = this.itemBin.indexOf(Id)
            (idx === -1) ? this.itemBin.push(Id) : this.itemBin.splice(idx, 1)
      },
      winrate(total, win) {
         return `${Math.round(win / total * 1000) / 10}%`
      },
      slotWinrate(total) {
         if (total) {
            return `${Math.round(total.wins / total.games * 1000) / 10}%`
         } else {
            return 0
         }
      },
      slotGames(i, l) {
         return (i[1].position[l - 1]) ? i[1].position[l - 1].games: 0
      },
      svgPositionHeight(i, pos) {
         // https://stats.stackexchange.com/questions/70801/how-to-normalize-data-to-0-1-range
         const games = Object.values(pos).map(x => x.games)
         const max = Math.max(...games)
         if (max === 0 || !pos[i]) return 0

         const val = pos[i].games / max

         // console.log(i, games, val)
         return val * 90
      },
      champIcon(name) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/${name}.png`
      },
   },
   
   computed: {
      iterItems() {
         return Object.entries(this.champion.items).sort((a, b) => b[1].games - a[1].games)
      },
      itemPositionSort() {
         return
      },
      friendlyEncounters() {
         Object.entries(i[1].friends).sort((a, b) =>a[1] - b[1])
         return
      }

   },

   props: {
      mythicData: null,
      champion: null,
      patch: null,
      parameters: null,
      items: null
   }
}
</script>

<template>
   <div class="section-top">
      <h2>Items</h2>
      <div class="section-top-right-wrapper">

         <div class="section-top-right">
            <div class="section-top-tabs">
               <div class="tab" :class="{'tab-focus' : this.itemTab === 0 }" @click="this.itemTab = 0">
                  Builds
               </div>
               <div class="tab" :class="{'tab-focus' : this.itemTab === 1 }" @click="this.itemTab = 1">
                  Individual Items
               </div>
            </div>
         </div>

      </div>
   </div>

   <div class="item-wrapper">

      <div v-if="this.itemTab === 0" class="builds section">
         <div class="builder">
            <div class="slot" v-for="i in 6" :key="i">
               <div class="placeholder" v-if="this.activeSelection[i-1] === 0" @click=""></div>
               <img class="master-img" v-else @click="this.deselectSlot(i)" :src="this.itemImage(this.activeSelection[i-1])" alt="">
               <div class="carousel">
                  <div class="carousel-item" @click="this.recomputeItemSlots(i, item[0])" v-for="(item, j) in this.itemSlotSort(i-1)" :key="j">
                     <img :src="this.itemImage(item[0])" alt="">
                     <div class="tab-sub">
                        <h4> {{ winrate(item[1][0], item[1][1]) }} </h4>
                        <h3> ({{ item[1][0] }}) </h3>
                     </div>
                  </div>

               </div>
            </div>
         </div>
      </div>

      <div v-if="this.itemTab === 1" class="items section">
         <div class="items-rows" v-for="(i, k) in iterItems" :key="k">
            <div class="item-header">
               <img :src="itemImage(i[0])" rel="preload" >
               <h1>
                  {{ this.items[i[0]].name }}
               </h1>

               <div class="tab-sub">
                  <h4> {{ winrate(i[1].games, i[1].wins) }} </h4>
                  <h3> ({{ i[1].games }}) </h3>
               </div>
            </div>
            <div class="item-body">
               <div>
                  <div class="stat-header">
                     <h3>Slot popularity</h3>
                  </div>
                  <svg>
                     <g  v-for="j in 6" :key="j">
                        <text class="slot" :x="`${(j - 1) * 16.5 + 7}%`" y="11" text-anchor="middle">{{ j }}</text>
                        <rect class="backdrop" :x="`${(j-1) * 16.5}%`" y="40" width="34" :height="90" />
                        <rect class="value" :x="`${(j-1) * 16.5}%`" y="40" width="34" :height="this.svgPositionHeight(j-1,  i[1].position)" />
   
                        <text class="winrate" :x="`${(j - 1) * 16.5 + 8}%`" y="125" text-anchor="middle">
                           {{ (i[1].position[j - 1]) ? winrate(i[1].position[j - 1].games, i[1].position[j - 1].wins) : '-' }}
                        </text>
                        <text class="games" :x="`${(j-1) * 16.5 + 7}%`" y="140" text-anchor="middle">
                           ({{ (i[1].position[j-1]) ? i[1].position[j-1].games : 0 }})
                        </text>
                     </g>
                  </svg>
               </div>
               <div class="encounters">
                  <div class="friendly">
                     <div class="stat-header">
                        <h3>Friendly encounters</h3>
                     </div>
                     <div class="cell" v-for="i in Object.entries(i[1].friends).sort((a, b) => b[1] - a[1]).slice(0, 20)" :key="i">
                        <img :src="this.champIcon(this.idTable[i[0]])" alt="">
                        <div class="tab-sub">
                           <h3> ({{ i[1] }}) </h3>
                        </div>
                     </div>
                  </div>
                  <div class="enemy" >
                     <div class="stat-header">
                        <h3>Enemy encounters</h3>
                     </div>
                     <div class="cell" v-for="i in Object.entries(i[1].enemies).sort((a, b) => b[1] - a[1]).slice(0, 20)" :key="i">
                        <img :src="this.champIcon(this.idTable[i[0]])" alt="">
                        <div class="tab-sub">
                           <h3> ({{ i[1] }}) </h3>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

   </div>
</template>

<style scoped>
   
   .section-top {
      height: 42px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 3px;
   }
   .section-top-right-wrapper {
      display: inline-block;
      width: calc(100% - 120px);
   }

   .section-top-right {
      display: flex;
      justify-content: space-between;
      align-items: center;
   }
   .section-top-tabs, .item-tabs {
      display: flex;
      flex-direction: row;
      gap: 10px;
   }
   .section-top-tabs .tab, .item-tabs .tab {
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
   }

   .tab {
      display: flex;
      align-items: center;
      background: var(--cold-blue);
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      padding: 0.5rem 1.5rem 0.5rem 0.5rem;
      gap: 0.5rem;
      transition: 0.25s;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
   }
   h2 {   
      color: var(--color-font);
      font-size: 1.1rem;
      display: inline-block;
      font-style: italic;
      font-weight: 400;
      width: 115px;
      margin: 0;
      text-align: center;
   }

   .item-wrapper {
      padding: 1rem 0;
      border-radius: 15px;
      background: var(--cell-panel);
      width: 100%;
      margin-bottom: 100px;
   }

   .builder {
      display: flex;
      justify-content: space-evenly;
      height: 95%;
   }

   .slot {
      display: flex;
      width: 123px;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
   }
   .placeholder {
      background: var(--cell-backdrop);
      display: block;
      width: 42px;
      height: 42px;
      transition: 0.25s;
   }

   .tab-sub h4 {
      display: block;
      color: var(--color-font);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .tab-sub h3 {
      display: block;
      color: var(--color-font-faded);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   .carousel {
      display: flex;
      flex-direction: column;
      gap: 5px;
      overflow-y: scroll;
      height: 80%;
      margin-left: 10px;
   }
   .carousel-item {
      display: flex;
      gap: 10px;
      padding: 0.35rem .5rem;
      margin-right: 10px;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      border-radius: 9px;
      transition: 0.1s;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
   }

   .carousel-item:hover {
      background: var(--alpha-05);
   }
   .carousel-item img {
      width: 34px;
      height: 34px;
      border: 1px solid  var(--cell-border);
   }

   .carousel::-webkit-scrollbar {
      width: 4px;
   }

   .carousel::-webkit-scrollbar-track {
      border-radius: 5px;
   }

   .carousel::-webkit-scrollbar-thumb {
      background: var(--alpha-06);
      border-radius: 5px;
      
   }
   .carousel::-webkit-scrollbar-thumb:hover {
      background: var(--light-12);
      transition: 0.25s;
   }

   
   .slot-focus {
      border: 1px solid  var(--tint400);
   }

   .builds {
      display: flex;
      flex-direction: column;
      height: 700px;
   }
   .tab-focus {
      border: 1px solid var(--cell-border);
      background: var(--cold-blue-focus);
      color: var(--color-font-focus);
   }

   .tab:hover {
      background: var(--cold-blue-focus);
   }
   .items {
      display: flex;
      flex-direction: column;
      gap: 10px;
   }

   .items img {
      margin-left: 10px;
      width: 36px;
      border: 1px solid  var(--cell-border);
   }
   img.master-img {
      width: 40px;
      border: 1px solid  var(--cell-border);
      cursor: pointer;
      margin: 0;
   }

   .items .header {
      display: flex;
      height: 30px;
      font-size: 0.9rem;
      border-bottom: 1px solid var(--cell-border);
   }

   .items-rows {
      font-size: 0.9rem;
      align-items: center;
   }

   .item-header {
      display: flex;
      align-items: center;
      gap: 20px;
   }

   .item-body {
      display: flex;
      gap: 40px;
      align-items: center;
      justify-content: space-around;
   }

   .stat-header {
      margin-bottom: 0.8rem;
      padding-bottom: 0.3rem;
      border-bottom: 1px solid var(--cell-border);
   }

   .item-body h3 {
      font-size: 0.9rem;
      font-weight: normal;
      margin-bottom: 0;
   }
   .encounters {
      display: flex;
      flex-direction: column;
      gap: 25px;
   }

   .encounters .cell {
      display: inline-block;
   }

   .cell img {
      width: 42px;
      margin: 0 7px;
   }

   .friendly, .enemy {
      overflow-x: scroll;
      white-space: nowrap;
      padding-bottom: 5px;
      width: 600px;
   }

   .friendly::-webkit-scrollbar, .enemy::-webkit-scrollbar{
      height: 8px;
   }

   .friendly::-webkit-scrollbar-track, .enemy::-webkit-scrollbar-track{
      border-radius: 5px;
   }

   .friendly::-webkit-scrollbar-thumb, .enemy::-webkit-scrollbar-thumb{
      background: var(--alpha-06);
      border-radius: 5px;
      
   }
   .friendly::-webkit-scrollbar-thumb:hover, .enemy::-webkit-scrollbar-thumb:hover{
      background: var(--light-12);
      transition: 0.25s;
   }

   .items-rows h1 {
      display: inline-block;
      font-weight: normal;
      font-size: 0.95rem;
      margin: 0;
   }


   .items-rows svg {
      width: 250px;
      height: 150px;
   }

   text.slot {
      fill: var(--color-font);
      font-size: 13px;
   }

   text.winrate {
      fill: var(--color-font);
      font-size: 12px;
   }
   
   text.games {
      fill: var(--color-font-faded);
      font-size: 12px;
   }
   
   rect.value {
      fill: var(--alpha-09);
      transform: rotate(180deg) scaleX(-1);
      transform-origin: center center;
      transition: height 0.5s;
   }
   
   rect.backdrop {
      fill: var(--cell-backdrop);
      transform: rotate(180deg) scaleX(-1);
      transform-origin: center center;
   }
</style>