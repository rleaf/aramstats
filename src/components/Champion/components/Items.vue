<script>
export default {
   data() {
      return {

      }
   },

   created() {

   },

   methods: {
      itemImage(Id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${Id}.png`
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
   <h2>Items</h2>
   <div class="item-bin">
      <img :src="itemImage(i)" @click="this.toggleItemBin(i)" rel="preload" v-for="i in Object.keys(this.champion.items)">
   </div>
</template>

<style scoped>
   h2 {   
      color: var(--light400);
      font-size: 1.1rem;
      display: inline-block;
      font-style: italic;
      font-weight: 400;
      width: 113px;
      margin: 1rem 0;
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