<script>
export default {
   components: {

   },
   data() {
      return {
         totalMatches: 0,
         totalWins: 0
      }
   },

   created() {
      this.data.slice(1).forEach((champ) => {
         this.totalMatches += champ.totalGames
         this.totalWins += champ.wins
      })
   },

   // mounted() {
   //    console.log(this.data)

   // },


   props: {
      data: null
   }
}
</script>

<template>
   <div class="overview-main">
      <div class="overview-header">
         <div class="wr-percent">
            {{ Math.round((this.totalWins / this.totalMatches) * 1000) / 10 }}%
         </div>
         <div class="wr-frac">
            ({{ this.totalWins }}/{{ this.totalMatches }}) WR
         </div>

      </div>
      <div class="summoner-stats">
         <div class="summ-wr">
         </div>
      </div>
      <!-- <div class="summoner-stats">
         stats
      </div> -->

   </div>
</template>

<style scoped>
.wr-frac {
      color: var(--color-font-fade);
      padding-left: 10px;
      font-size: 0.9rem;
   }

   .wr-percent {
      font-weight: bold;
      font-size: 1.5rem;
      color: var(--header-stats);
   }

   .overview-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 30px;
      border-bottom: 1px solid var(--color-font);
      height: 51px;
   }

   .summ-wr {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      padding-top: 50px;
      border-right: 2px solid var(--color-background);
      /* height: 100%; */
      width: 240px;
   }
   .summoner-stats {
      height: 100%;
   }
   .overview-main {
      /* display: flex;
      flex-direction: row; */
      background: var(--profile-panel);
      height: 350px;
      border-radius: 5px;
   }

   .wip {
      text-align: center;
      padding-top: 150px;
      color: var(--color-font);
   }
</style>