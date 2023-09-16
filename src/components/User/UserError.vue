<script>
export default {
   data() {
      return {

      }
   },

   props: {
      user: {},
      error: null
   }
}
</script>

<template>
   <div class="dne-main">
      <div v-if="this.error === 404">
         <h2>
            Summoner <i>{{ this.user.name }} ({{ this.user.region }})</i> does not exist.
         </h2>
         <br>
         <img src="https://i.redd.it/6p956lq5yiq81.jpg" alt="">
      </div>
      <div v-if="this.error === 403">
         <h2>
            API key expired :(
         </h2>
         <p>
            @owl#4626 in aram academy discord and I'll refresh.
         </p>
      </div>
      <div v-if="this.error === 504">
         <h2>
            Riot API servers are probably down.
         </h2>
         <p>
            Check server status <a href="https://developer.riotgames.com/api-status/" target="_blank">here</a>
         </p>
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

p > a {
   color: var(--color-font);
}
</style>