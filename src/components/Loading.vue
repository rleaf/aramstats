<script>
// import { superStore } from '@/stores/superStore'

export default {
   data() {
      return {
         // config: superStore()
      }
   },
   
   mounted() {
      // this.config.loading = true
   },

   unmounted() {
      // this.config.loading = false
   }
}


</script>

<template>
   <div class="champion-loading-main">
      Loading data...
      <!-- <img src="https://i.redd.it/ibmenrw30k781.png"> -->
   </div>
</template>

<style scoped>

.champion-loading-main {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   margin-top: 20vh;
   color: var(--color-font);
   width: 100%;
   text-align: center;

}

.champion-loading-main img {
   width: 400px;
}
</style>