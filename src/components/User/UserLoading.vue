<script>

export default {
   data() {
      return {

      }
   },

   props: {
      response: null,
   }
}
</script>

<template>
   <div class="loading-main">
      <div class="null" v-if="!this.response">
         <div>
            <p>
               Searching for summoner...
            </p>
            {{ this.response }}
         </div>
      </div>
      <div class="null" v-else-if="this.response.parse.status === 'In queue...'">
         <div>
            <p>
               Summoner is in queue. <br><router-link :to="{ name: 'user', params: { region: 'na', gameName: 'Night Owl', tagLine: 'NA1' } }" target="_blank">Here</router-link>
               is what you can expect to see.
            </p>
            <p>
               Position: {{ this.response.parse.position }}
            </p>
         </div>
      </div>
      <div class="active" v-else-if="this.response.parse.status == 'Parsing summoner...'">
         <div>
            <p>
               Parsing summoner...
            </p>
            <p>
               This will take a bit when parsing a new summoner (~5-20 min depending on loada and games played). <router-link :to="{ name: 'user', params: { region: 'na', gameName: 'Night Owl', tagLine: 'NA1' } }" target="_blank">Here</router-link>
               is what you can expect to see.
            </p>
            <div class="queue">
               <p>
                  {{ this.response.parse.current }} / {{ this.response.parse.total }} matches completed
               </p>
               <p class="sub">
                  I update every 20 seconds (or refresh browser).
               </p>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.loading-main {
   display: flex;
   width: 100%;
   justify-content: center;
   margin-top: 20vh;
   text-align: center;
}

h2 {
   /* font-family: var(--header-font); */
   font-weight: normal;
   font-size: 1rem;
   color: var(--color-font);
}

p {
   color: var(--color-font);
   width: 700px;
   font-size: 0.9rem;
}

.queue p {
   font-weight: 500;
}

p.sub {
   font-size: 0.9rem;
   font-weight: normal;
   font-style: italic;
   color: var(--color-font-faded);
}

a {
   color: var(--color-font);
}

a.purge:hover {
   color: #ec3838;
   border-color: #ec3838;
}

</style>