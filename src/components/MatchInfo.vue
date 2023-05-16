<script>
import axios from 'axios'

export default {
   data() {
      return {
         players: Array,
         unit: 'totalDamageDealtToChampions',
         maxValue: 0,
      }
   },

   created() {
      this.getMatchData()
   },

   methods: {
      async getMatchData() {
         const url = `/api/matchInfo/${this.$route.params.region}/${this.matchId}`

         try {
            this.data = (await axios.get(url)).data
            this.players = this.data.info.participants
            this.getCeilingValue()
            console.log(this.players)
         } catch (e) {
            console.log(e)
         }
         
      },

      getCeilingValue() {
         let temp = this.players.map(x => x[this.unit])
         this.maxValue = Math.max(...temp)
         console.log('temp', temp)
      },

      button() {
         console.log('click')
      },

      kda(player) {
         return `${player.kills}/${player.deaths}/${player.assists}`
      },

      barValue(value) {
         const percent = (value / this.maxValue)
         return `width: ${60 * percent}px` // multiply percent by width of div
      },

      primaryRune(player) {
         return new URL(`../assets/runes/${player.perks.styles[0].selections[0].perk}.png`, import.meta.url).href
      },
   
      secondaryRune(player) {
         return new URL(`../assets/runes/${player.perks.styles[1].style}.png`, import.meta.url).href
      }
   },

   computed: {
   },
 
   props: {
      matchId: String
   }
}

</script>

<template>
   <div class="match-info-main">
      <!-- "soon".tm -->
      <div class="match-info-header">
         <h2>
            {{ this.matchId }}
         </h2>
         <button @click="button">
            toad
         </button>
      </div>
      <div class="player-container">
         <div class="player" v-for="(player, i) in this.players" :key="i">
            <div class="name">
               {{ player.summonerName }}
            </div>
            <div class="spells-runes">
               <img :src="primaryRune(player)" class="spells">
               <img :src="secondaryRune(player)" class="spells">
               <img :src="primaryRune(player)" class="runes">
               <img :src="secondaryRune(player)" class="runes">
            </div>
            <div class="kda">
               {{ kda(player) }}
            </div>
            <div class="value">
               {{ player[this.unit] }}
               <div class="bar">
                  <div class="value" :style="barValue(player.totalDamageDealtToChampions)"></div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
   .match-info-main {
      width: 745px;
      border-radius: 15px;
      background: var(--tint100);
      margin: 10px 0 20px auto;
   }

   .match-info-header {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      border-bottom: 1px solid var(--tint200);
   }

   h2 {
      margin: 0;
      font-size: 1.3rem;
      opacity: 0.5;
      font-style: italic;
   }

   .match-info-header button {
      background: none;
      border: none;
      color: var(--color-font);
      border: 1px solid var(--tint200);
      border-radius: 7px;
      padding: 6px 10px;
      font-weight: bold;
   }

   .player-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 30px;
      grid-template-rows: repeat(5, 1fr);
      padding: 5px 10px;
   }

   .player {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
   }

   .name {
      font-size: 0.9rem;
      font-weight: lighter;
      width: 120px;
      margin: 0;
   }

   .spells-runes {
      display: grid;
      grid-template-areas: 
         '1 2'
         '1 2';
   }

   .spells-runes .runes {
      grid-area: 1;
   }

   .spells-runes .runes {
      grid-area: 2;
   }

   .spells-runes img {
      width: 30px;
   }

   .kda {
      font-size: 0.75rem;
      color: var(--tint400);
   }


   .bar {
      width: 60px;
      height: 7px;
      /* margin-left: auto; */
      /* margin-right: 15%; */
      background: var(--tint200);
   }

   .value {
      color: var(--tint400);
      text-align: center;
      font-size: 0.75rem;
   }
   
   .bar .value {
      margin-top: 3px;
      background-color: var(--bar2);
      /* background: linear-gradient(to right, var(--bar2), var(--tint400)); */
      height: inherit;
      /* width: 15px; */
      z-index: 5;
   }

</style>