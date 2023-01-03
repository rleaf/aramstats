<script>
export default {
   data() {
      return {

      }
   },

   props: {
      user: String,
      errorStatus: Number
   }
}
</script>

<template>
   <div class="dne-main">
      <div v-if="this.errorStatus == 404">
         <h2>
            Summoner <i>{{ this.user }}</i> does not exist.
         </h2>
         <p>
            :(
         </p>
      </div>
      <div v-if="this.errorStatus == 403">
         <h2>
            API key expired :(
         </h2>
         <p>
            @owl#4626 in aram academy discord and I'll refresh.
         </p>
         <br>
         <img src="https://i.redd.it/6p956lq5yiq81.jpg" alt="">
      </div>
   </div>
</template>

<style scoped>
.dne-main {
   display: flex;
   width: 100%;
   justify-content: center;
   margin-top: 20vh;
   text-align: center;
}

h2 {
   font-weight: normal;
   color: var(--color-font);
}

p {
   color: var(--color-font);
   width: 500px;
   line-height: 1.5;
}
</style>