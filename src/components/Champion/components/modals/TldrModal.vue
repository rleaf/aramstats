<script>
import { championStore } from '@/stores/championStore'

export default {
   data() {
      return {
         config: championStore(),
         showModal: false,
      }
   },
   
   created() {
      this.checkStorage()
      this.closeModal()
   },

   methods: {
      checkStorage() {
         if (!localStorage.getItem('localStorage')) return

         this.config.localStorage = localStorage.getItem('localStorage') === 'true'
         this.config.visibleCore = localStorage.getItem('visibleCore') === 'true'
         this.config.winrateSort = localStorage.getItem('winrateSort') === 'true'
         this.config.winrateThreshold = Number(localStorage.getItem('winrateThreshold'))
      },

      closeModal() {
         this.showModal = false
         
         if (this.config.localStorage) {
            localStorage.setItem('localStorage', this.config.localStorage)
            localStorage.setItem('winrateSort', this.config.winrateSort)
            localStorage.setItem('winrateThreshold', this.config.winrateThreshold)
         } else {
            localStorage.removeItem('localStorage')
            localStorage.removeItem('winrateSort')
            localStorage.removeItem('winrateThreshold')
         }
      }
   }
}
</script>

<template>
   <img @click="this.showModal = true" class="settings" src="@/assets/svg/ellipses.svg" alt="">
   <div v-if="this.showModal" class="modal-main">
      <div class="modal">
         <div class="head">
            <h1>Tldr</h1>
            The Tldr section shows what you want to see when you're in champ select. The data shown here is particular to the selected core build and may look different from the sections below.
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Local Storage</h2>
               <svg @click="this.config.localStorage = !this.config.localStorage" fill="none">
                  <rect x="0.5" y="0.5" rx="13"/>
                  <circle :class="{ 'storage-active': this.config.localStorage }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg>
            </div>
            <p>
               Save Tldr settings to local storage? Data auto-purges when toggled off.
            </p>
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Sort by winrate</h2>
               <svg @click="this.config.winrateSort = !this.config.winrateSort" fill="none">
                  <rect x="0.5" y="0.5" rx="13"/>
                  <circle :class="{ 'storage-active': this.config.winrateSort }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg>
            </div>
            <p>
               Data defaults to ordering by popularity. Instead, sort information by highest winrate. Note that there may be low/no observations for certain data.
            </p>
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Winrate threshold</h2>
               <div class="options">
                  <div :class="{ 'active-option': this.config.winrateThreshold == 0.05 }" @click="this.config.winrateThreshold = 0.05">5%</div>
                  <div :class="{ 'active-option': this.config.winrateThreshold == 0.08 }" @click="this.config.winrateThreshold = 0.08">8%</div>
                  <div :class="{ 'active-option': this.config.winrateThreshold == 0.1 }" @click="this.config.winrateThreshold = 0.1">10%</div>
               </div>
            </div>
            <p>
               Set the lower bound of observed data when sorting by winrate. This is to exclude games with too little sample size.
            </p>
         </div>
      </div>
      <div class="modal-back" @click ="this.closeModal()" />
   </div>
</template>

<style scoped>
@import url('./styles.css');
</style>