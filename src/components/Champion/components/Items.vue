<script>
export default {
   data() {
      return {
         itemSlots: [[],[],[],[],[],[]]
      }
   },

   created() {
      this.populateItemSlots()
   },

   methods: {
      populateItemSlots() {
         for (const [k, v] of Object.entries(this.champion.builds)) {
            const items = k.split('_')
            for (const i in items) {
               this.itemSlots[i].push(items[i])
            }
         }
         console.log(this.itemSlots)
      },
      itemImage(Id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${Id}.png`
      },
      
      toggleItemBin(Id) {
         const idx = this.itemBin.indexOf(Id)
            (idx === -1) ? this.itemBin.push(Id) : this.itemBin.splice(idx, 1)
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
               <!-- <div class="tab">
                  Highest winrate
               </div>
               <div class="tab">
                  Most popular
               </div> -->
            </div>
            <!-- <div class="tldr-toggle">
               <div class="tab">Duplicate Items</div>
            </div> -->
         </div>

      </div>
   </div>

   <div class="item-wrapper">

      <div class="item-bin">
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
   .item-bin {
      padding: 1rem 0;
      border-radius: 15px;
      background: var(--tint100);
      justify-content: center;
      width: 100%;
   }

   .item-bin img {
      width: 40px;
   }
</style>