<script>
import { championStore } from '@/stores/championStore'

export default {
   data() {
      return {
         config: championStore(),
         showModal: false,
      }
   },


}
</script>

<template>
   <img @click="this.showModal = true" class="settings" src="@/assets/svg/ellipses.svg" alt="">
   <div v-if="this.showModal" class="modal-main">
      <div class="modal">
         <div class="head">
            <h1>Runes</h1>
            The Runes section displays individual rune observations & winrate.
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Heatmap</h2>
               <div class="options">
                  <div :class="{ 'active-option': this.config.runes.heatmap == 0 }" @click="this.config.runes.heatmap = 0">Off</div>
                  <div :class="{ 'active-option': this.config.runes.heatmap == 1 }" @click="this.config.runes.heatmap = 1">Popularity</div>
                  <div :class="{ 'active-option': this.config.runes.heatmap == 2 }" @click="this.config.runes.heatmap = 2">Winrate</div>
               </div>
            </div>
            <p>
               Toggle heatmap to help visually discern rune data.
            </p>
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Desaturate colors</h2>
               <svg @click="this.config.runes.clarity = !this.config.runes.clarity" fill="none">
                  <rect x="0.5" y="0.5" rx="13" :class="{ 'active': this.config.runes.clarity }"/>
                  <circle :class="{ 'storage-active': this.config.runes.clarity }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg>
            </div>
            <p>
               To help with visual clarity.
            </p>
         </div>
      </div>
      <div class="modal-back" @click ="this.showModal = false" />
   </div>
</template>

<style scoped>
@import url('./styles.css');
</style>