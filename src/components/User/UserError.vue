<script>
export default {
   data() {
      return {
         errorMessage: {
            404: ''
         }
      }
   },

   props: {
      user: {},
      response: null
   }
}
</script>

<template>
   <div class="dne-main">
      <div class="new-user" v-if="this.response === 'Summoner is not parsed.'">
         <p>
            Hello, it seems this summoner has never been parsed.
         </p>
         <p>
            This process can take some time, upwards of 20 minutes, and examines all viable games in the match history.
            <router-link :to="{ name: 'user', params: { region: 'na', gameName: 'Night Owl', tagLine: 'NA1' } }" target="_blank">Here</router-link> is what you can expect to see when the account finishes.
         </p>
         <div @click="$emit('initParse')" class="button">Parse Summoner</div>
      </div>
      <div v-if="this.response === 'Summoner does not exist.'">
         <h2>
            <i>{{ decodeURI(this.user.name) }}#{{ decodeURI(this.user.tagLine) }} ({{ this.user.region }})</i> does not exist.
         </h2>
         <br>
         <img src="https://i.redd.it/6p956lq5yiq81.jpg" alt="">
      </div>
      <div v-if="this.response === 403">
         <h2>
            API key expired :(
         </h2>
         <p>
            @owl#4626 in aram academy discord and I'll refresh.
         </p>
      </div>
      <div v-if="this.response === 504">
         <h2>
            Riot API servers are probably down.
         </h2>
         <!-- <p>
            Check server status <a href="https://developer.riotgames.com/api-status/" target="_blank">here</a>
         </p> -->
      </div>
      <div v-if="this.response === 500">
         <h2>
            Aramstats database is down.
         </h2>
         <p>
            Ping me on Discord (<code>@ryli.</code>)  so I can look into it. This is probably not intentional.
         </p>
         <img src="https://i.redd.it/k8obvr07gfb91.png" alt="">
      </div>
   </div>
</template>

<style scoped>

.button {
   width: 200px;
   margin: 0 auto;
   margin-top: 50px;
   cursor: pointer;
   border-radius: 3px;
   border: 1px solid var(--cell-border);
   background: var(--off-blue);
   font-size: 0.9rem;
   padding: 0.35rem 0.75rem;
   color: var(--color-font);
   font-weight: 600;
   transition: 150ms ease-in-out;
}

.button:hover {
   background: var(--cold-blue-focus);
}

code {
   background: var(--dark500);
   padding: 0.1rem 0.15rem;
   border-radius: 5px;
}
.dne-main {
   display: flex;
   width: 100%;
   justify-content: center;
   margin-top: 20vh;
   text-align: center;
}

img {
   max-height: 60vh;
}

h2 {
   font-weight: normal;
   color: var(--color-font);
   font-size: 1.2rem;
}

p {
   color: var(--color-font);
   width: 500px;
   font-size: 0.9rem;
   line-height: 1.5;
}

p > a {
   color: var(--color-font);
}
</style>