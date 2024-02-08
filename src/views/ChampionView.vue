<script>
import Loading from '../components/Loading.vue'
import ChampionError from '../components/Champion/ChampionError.vue'
import ChampionReady from '../components/Champion/ChampionReady.vue'
import axios from 'axios'

export default {
   components: {
      Loading,
      ChampionError,
      ChampionReady,
   },

   data() {
      return {
         champion: null,
         loading: false,
         patch: null,
         renderKey: 0,
      }
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
      }
   },

   computed: {
      // Needs to be a computed property for nav search reactivity
      lookup() {
         this.loading = true // Loading flag
         const url = `/api/champion/${this.$route.params.champion}`
         axios.get(url).then((res) => {
            this.renderKey++ // Re-render via keys
            this.loading = false 
            this.champion = res.data // Pass data
         }).catch((e) => {
            console.log('err', e)
            this.loading = false
         })
         return true // Inject reactivity into DOM
      },
   }
}


</script>

<template>
   <Loading v-if="this.loading"/>
   <ChampionReady
   v-if="lookup && this.patch && !this.loading"
   :champion="this.champion"
   :patch="this.patch"
   :key="this.renderKey"/>
   <ChampionError v-if="!this.champion || !this.patch"/>
</template>