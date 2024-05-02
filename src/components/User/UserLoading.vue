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
      <div v-if="this.response.parse.status === 'In queue...'">
         <p>Summoner is in queue.</p>
         <p v-if="this.response.parse.position === 1">You are next.</p>
         <p v-else-if="this.response.parse.position - 1 === 1">There is 1 summoner ahead of you.</p>
         <p v-else>There are {{ this.response.parse.position - 1 }} summoners ahead of you.</p>
      </div>
      <div v-else-if="this.response.parse.status == 'Parsing summoner...'">
         <p>Parsing summoner...</p>
         <p class="queue">{{ this.response.parse.current }} / {{ this.response.parse.total }} matches completed</p>
      </div>
      <p class="sub">
         I update every 30 seconds. A single summoner can take, ballpark, upwards of 20 min to complete. Feel free to close this window & check back later.
         <router-link :to="{ name: 'user', params: { region: 'na', gameName: 'Night Owl', tagLine: 'NA1' } }" target="_blank">Here</router-link>
         is what you can expect to see.
      </p>
   </div>
</template>

<style scoped>
.loading-main {
   display: flex;
   flex-direction: column;
   width: 100%;
   align-items: center;
   margin-top: 15vh;
   text-align: center;
}

p {
   color: var(--color-font);
   width: 500px;
   font-size: 0.9rem;
}

p.queue {
   font-weight: 500;
}

p.sub {
   font-size: 0.8rem;
   line-height: 1.5;
   font-weight: normal;
   color: var(--color-font-faded);
}

a {
   color: var(--color-font-faded);
   transition: color 200ms ease-in-out;
}

a:hover {
   color: var(--color-font);
}

</style>