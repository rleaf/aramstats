<script>
import Experience from '../assets/Experience/Experience'

export default {
   data() {
      return {
         experience: null,
      }
   },
   
   watch: {
      // $route (to, from) {
      //    if (to.name === 'home') {
      //       // this.render = true
      //    } else {
      //       this.experience = null
      //       this.render = false
      //    }
      // }
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
   z-index: 50;
}

</style>