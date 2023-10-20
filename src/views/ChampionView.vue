<script>
import ChampionLoading from '../components/Champion/ChampionLoading.vue'
import ChampionError from '../components/Champion/ChampionError.vue'
import ChampionReady from '../components/Champion/ChampionReady.vue'
import axios from 'axios'

export default {
   data() {
      return {

      }
   },

   created() {
      console.log(this.$route.params.champion, 'toad')
      this.lookup()
   },

   mounted() {

   },

   methods: {
      lookup() {
         
      }
   }
}


</script>

<template>
   <div class="champion-main">

   </div>
</template>

<style scoped>

</style>