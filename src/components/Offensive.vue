<script>
import Histogram from './Histogram.vue'
import ChampSearch from './ChampSearch.vue'

export default {
   components: {
      Histogram,
      ChampSearch
   },
   data() {
      return {
         championFilter: null,
      }
   },

   props: {
      data: null
   }
}
</script>

<template>
   <ChampSearch :data="this.data" @championFocus="champion => championFilter = champion" />
   <Histogram :data="this.data" :championFilter="this.championFilter" />
</template>

<style scoped>

</style>