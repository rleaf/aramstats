<script>
import ChampionLoading from '../components/Champion/ChampionLoading.vue'
import ChampionError from '../components/Champion/ChampionError.vue'
import ChampionReady from '../components/Champion/ChampionReady.vue'

import champions from '../constants/champions'
import axios from 'axios'

export default {
   components: {
      ChampionLoading,
      ChampionError,
      ChampionReady
   },

   data() {
      return {
         status: null
      }
   },

   created() {
      this.lookup()
   },

   mounted() {
      this.getCurrentPatch()
   },

   methods: {
      async getCurrentPatch() {
         const url = 'https://ddragon.leagueoflegends.com/api/versions.json'

         try {
            this.patch = (await axios.get(url)).data[0]
         } catch (e) {
            console.log(e, 'getCurrentPatch')
         }
      },

      lookup() {
         const url = `/api/champions/${this.$route.params.champion}`

         // if (this.$route.params.champion in champions.names) {
         //    do some error handling here so don't waste api call to backend
         //    if champion param is some arbitrary string
         // }

         axios.get(url).then((res) => {
            this.champion = res.data
            this.status = 1
         }).catch((e) => {
            console.log('err', e)
            this.status = 2
         })
      }
   }
}


</script>

<template>
   <ChampionLoading
      v-if="!this.status"/>
   <ChampionReady
      v-if="this.status === 1"
      :champion="this.champion"
      :patch="this.patch"/>
   <ChampionError
      v-if="this.status === 2"/>
</template>