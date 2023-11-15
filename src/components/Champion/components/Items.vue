<script>
export default {
   data() {
      return {
         itemTab: 0,
         slotFocus: null,
         activeSelection: [0, 0, 0, 0, 0, 0],
         itemSlots: [{},{},{},{},{},{}]
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
         // console.log(this.itemSlots)
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
   },

   computed: {

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
            <!-- <div class="tldr-toggle">
               <div class="tab">Duplicate Items</div>
            </div> -->
         </div>

      </div>
   </div>

   <div class="item-wrapper">

      <div v-if="this.itemTab === 0" class="builds section">
         <div class="meta-info">
            toad
         </div>
         <div class="builder">
            <div class="slot" v-for="i in 6" :key="i">
               <!-- {{ i-1 }} -->
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
         <img :src="itemImage(i)" @click="this.toggleItemBin(i)" rel="preload" v-for="i in Object.keys(this.champion.items)">
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
      background: var(--tint100);
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      padding: 0.5rem 1.5rem 0.5rem 0.5rem;
      gap: 0.5rem;
      transition: 0.25s;
   }
   h2 {   
      color: var(--light400);
      font-size: 1.1rem;
      display: inline-block;
      font-style: italic;
      font-weight: 400;
      width: 115px;
      margin: 0;
      /* margin-top: 0; */
      text-align: center;
   }

   .item-wrapper {
      padding: 1rem 0;
      border-radius: 15px;
      background: var(--tint100);
      width: 100%;
      margin-bottom: 100px;
   }
   .meta-info {
      margin: 0 auto;
      text-align: center;
      background: var(--tint200);
      border-radius: 8px;
      width: 80%;
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
      background: var(--hoverButton);
      display: block;
      width: 42px;
      height: 42px;
      transition: 0.25s;
   }

   .master-img {
      width: 40px;
      border: 1px solid  var(--tint400);
      cursor: pointer;
   }
   .tab-sub h4 {
      display: block;
      color: var(--tint500);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .tab-sub h3 {
      display: block;
      color: var(--tint400);
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
   }

   .carousel-item:hover {
      background: var(--hoverButton);
   }
   .carousel-item img {
      width: 34px;
      height: 34px;
      border: 1px solid  var(--tint400);
   }
   .carousel::-webkit-scrollbar {
      width: 4px;
   }

   .carousel::-webkit-scrollbar-track {
      border-radius: 5px;
   }

   .carousel::-webkit-scrollbar-thumb {
      background: var(--tint200);
      border-radius: 5px;
      
   }
   .carousel::-webkit-scrollbar-thumb:hover {
      background: var(--tint300);
      transition: 0.25s;
   }

   
   .slot-focus {
      border: 1px solid  var(--tint400);
   }
   .builds {
      display: flex;
      flex-direction: column;
      height: 400px;
   }
   .tab-focus {
      border: 1px solid var(--tint400);
   }

   .tab:hover {
      background: var(--hoverButton);
   }
</style>