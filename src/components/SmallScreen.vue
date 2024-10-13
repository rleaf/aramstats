<script>
export default {
   data() {
      return {
         width: window.innerWidth
      }
   },

   mounted() {
      window.addEventListener('resize', this.fire)
   },

   beforeUnmount() {
      window.removeEventListener('resize', this.fire)
   },

   methods: {
      fire() {
         this.width = window.innerWidth
      }
   }
}
</script>

<template>
   <div v-if="this.width < 1130" class="screen-width-main">
      Sorry, Aramstats is currently not designed for smaller screen sizes.
      
   </div>
</template>

<style scoped>
   .screen-width-main {
      position: absolute; 
      width: 100%;
      padding: 0.5rem 0;
      display: flex;
      justify-content: center;
      font-size: 0.9rem;
      background-color: var(--tertiary-container);
      color: var(--color-font);
      z-index: 5;
   }
</style>