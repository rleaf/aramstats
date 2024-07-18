<script>
import Loading from '../components/Loading.vue'
import ChampionError from '../components/Champion/ChampionError.vue'
import ChampionReady from '../components/Champion/ChampionReady.vue'
import champions from '../constants/champions'
import { superStore } from '../stores/superStore'
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
         cdnData: null,
         loading: false,
         patches: superStore().patches,
         patchData: null,
         items: null,
         renderKey: 0,
      }
   },

   mounted() {
      // this.getChampionData()
   },

   methods: {
      async getChampionData() {
         const url = `https://ddragon.leagueoflegends.com/cdn/${this.patches[0]}/data/en_US/champion/${champions.imageName[this.champion._id]}.json`

         try {
            this.cdnData = (await axios.get(url)).data.data
         } catch (e) {
            if (e instanceof Error) console.log(e)
         }
      }
   },

   computed: {
      // Needs to be a computed property for nav search reactivity
      async lookup() {
         this.patchData = new URLSearchParams(window.location.search).get('patch')
         this.loading = true     // Loading flag

         try {
            const url = `/api/champion/${this.$route.params.champion}`
            this.champion = (await axios.get(url, {params: { patch: this.patchData } })).data
            this.renderKey++     // Re-render via keys
         } catch (e) {
            if (e instanceof Error) console.log(e)
         } finally {
            // this.getChampionData()
            this.loading = false
            return true          // Inject reactivity into DOM
         }
      }
   }
}


</script>

<template>
   <Loading v-if="this.loading && !this.champion"/>
   <ChampionReady
      v-else-if="lookup && this.patches && !this.loading && this.champion"
      :champion="this.champion"
      :key="this.renderKey"/>
   <ChampionError v-else/>
</template>