<script>
/* 
   Temporarily called pancakes while I think of a better name.

   Component houses two tabs. One tab is for a match history, similar to waht you'd
   see on op.gg and the other tab displays summoner frequency. See if there are any
   familiar faces.
*/
import axios from 'axios'


export default {
   data() {
      return {
         tab: 0,
      }
   },

   created() {
      // match history GET located in UserView.vue
   },

   methods: {
      async getHistory() {
         // const url = `/api/history/${}/${}`
      }

   },

   computed: {

   }
}
</script>

<template>
   <div class="pancakes-main">
      <!-- 🥞 -->
      <div class="pancakes-tabs">
         <div class="match-history-tab"
         @click="this.tab = 0">
            Match History
         </div>
         <div class="summoner-history-tab"
         @click="this.tab = 1">
            Summoner History
         </div>
      </div>
      <div class="match-history" v-show="this.tab === 0">
         pancakes
      </div>
      <div class="summoner-history" v-show="this.tab === 1">
         waffles
      </div>
   </div>
</template>

<style scoped>

.pancakes-tabs {
   display: flex;
   flex-direction: row;
   font-size: 0.9rem;
   color: var(--color-font);
   justify-content: center;
   gap: 20px;
   margin-bottom: 1rem;
}

.pancakes-main {
   display: flex;
   flex-direction: column;
   justify-content: center;
   background: var(--tint100);
   border-radius: 15px;
}

.match-history, .summoner-history {
   width: 100%;
   /* display: flex;
   justify-content: center; */
}
</style>