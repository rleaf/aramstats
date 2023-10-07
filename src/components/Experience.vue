<script>
import Experience from '../assets/Experience/Experience'

export default {
   data() {
      return {
         experience: null,
      }
   },
   
   mounted() {
      this.experience = new Experience(document.querySelector('.webgl'), false)
   },  
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
   z-index: 7;
}

</style>