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
         store: superStore(),
         patchData: null,
         items: null,
         renderKey: 0,
      }
   },

   created() {
      this.store.initRunes()
      this.store.initSpells()
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
            this.store.initChampion(champions.imageName[this.champion._id])
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
      v-else-if="lookup && this.store.patches && !this.loading && this.champion"
      :champion="this.champion"
      :key="this.renderKey"/>
   <ChampionError v-else/>
</template>