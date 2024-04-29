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
            <h2>
               Searching for summoner...
            </h2>
            {{ this.response }}
         </div>
      </div>
      <div class="null" v-else-if="this.response.parse.status === 'In queue...'">
         <div>
            <h2>
               Summoner is in queue.
            </h2>
            <p>
               Position in queue: {{ this.response.position }}
            </p>
            <p>
               Length of queue: {{ this.response.length }}
            </p>
         </div>
      </div>
      <div class="active" v-else-if="this.response.parse.status == 'Parsing summoner...'">
         <div>
            <h2>
               Parsing summoner...
            </h2>
            <p>
               This will take a bit when parsing a new summoner (~5-20 min depending on load).
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
   font-weight: normal;
   font-size: 1rem;
   color: var(--color-font);
}

p {
   color: var(--color-font);
   width: 700px;
   font-size: 0.95rem;
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
   transition: 0.1s;
   font-size: 1rem;
   color: var(--color-font);
   border: 1px solid var(--color-font);
   border-radius: 5px;
   cursor: pointer;
   padding: 4px 9px;
}

a.purge:hover {
   color: #ec3838;
   border-color: #ec3838;
}

</style>