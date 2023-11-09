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
   <h2>Runes & Skills</h2>
   <div class="runes-skills-body">
      pancakes
   </div>
</template>

<style scoped>
   h2 {   
      color: var(--light400);
      font-size: 1.1rem;
      display: inline-block;
      font-style: italic;
      font-weight: 400;
      /* width: 113px; */
      margin: 1rem 0;
      text-align: center;
   }
</style>