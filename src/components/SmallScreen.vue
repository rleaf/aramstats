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
      padding: 0.5rem 1rem;
      line-height: 1.5;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      background-color: var(--light-13);
      color: var(--color-font);
   }
</style>