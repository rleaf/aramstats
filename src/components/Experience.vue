<script>
import Experience from '@/experience/Experience'

export default {
   data() {
      return {
         experience: null,
      }
   },
   
   mounted() {
      this.experience = new Experience(document.querySelector('.webgl'), false)
   },
   
   unmounted() {
      this.experience.world.map.dispose()
   }
}


</script>

<template>
   <canvas class="webgl"></canvas>
   
</template>

<style scoped>

.webgl {
   position: fixed;
   top: 0;
   left: 0;
   z-index: -50;
}

</style>