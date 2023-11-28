<script>
import axios from 'axios'

export default {
   data() {
      return {
         players: Array,
         teams: [],
         book: {
            'Damage': 'totalDamageDealtToChampions',
            'True Damage': 'trueDamageDealtToChampions',
            'Turret Damage': 'damageDealtToTurrets',
            'Gold Spent': 'goldSpent',
            'Magic Damage': 'magicDamageDealtToChampions',
            'Physical Damage': 'physicalDamageDealtToChampions',
            'Damage Taken': 'totalDamageTaken',
            'Damage Mitigated': 'damageSelfMitigated',
            'Healed': 'totalHeal',
            'Ally Healed': 'totalHealsOnTeammates',
            'Time Spent Dead': 'totalTimeSpentDead',
            'Longest Time Living': 'longestTimeSpentLiving',
            'Time CCing Others': 'timeCCingOthers',
         },
         unit: 0,
         maxValue: 0,
         spells: null,
         unitDrop: false,
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
            
            this.populateTeams()
            this.getCeilingValue()

            // console.log(this.players)
         } catch (e) {
            console.log(e)
         }
         
      },

      populateTeams() {
         const x = this.players.slice(0, 5)
         this.teams.push(x)

         const y = this.players.slice(5, 10)
         this.teams.push(y)

      },

      getCeilingValue() {
         let temp = this.players.map(x => x[this.book[Object.keys(this.book)[this.unit]]])
         this.maxValue = Math.max(...temp)
      },

      button() {
         this.unitDrop =! this.unitDrop
      },

      kda(player) {
         return `${player.kills}/${player.deaths}/${player.assists}`
      },

      barValue(value) {
         this.getCeilingValue()
         const percent = (value / this.maxValue)
         return `width: ${60 * percent}px` // multiply percent by width of div
      },

      primaryRune(player) {
         return new URL(`../assets/runes/${player.perks.styles[0].selections[0].perk}.png`, import.meta.url).href
      },
   
      secondaryRune(player) {
         return new URL(`../assets/runes/${player.perks.styles[1].style}.png`, import.meta.url).href
      },

      getSpell(id) {
         return new URL(`../assets/spells/${id}.webp`, import.meta.url).href
      },

      champImg(champ) {
         // return new URL(`../assets/champion_icons/${champ.toLowerCase()}.png`, import.meta.url).href
         return `https://ddragon.leagueoflegends.com/cdn/${this.currentPatch}/img/champion/${champ}.png`
      },

      itemImg(player, i) {
         if (player[`item${i}`]) return `https://ddragon.leagueoflegends.com/cdn/${this.currentPatch}/img/item/${player[`item${i}`]}.png`
      }
   },

   computed: {
      arrow() {
         return (this.unitDrop) ? `transform: rotate(180deg);` : ``
      },
   },
 
   props: {
      matchId: String,
      currentPatch: ''
   }
}

</script>

<template>
   <div class="match-info-main">
      <div class="match-info-header">
         <h2>
            {{ this.matchId }}
         </h2>
         <div class="unit-dropdown">
            <button @click="button">
               {{ Object.keys(this.book)[this.unit] }}
               <img src="../assets/arrow3.svg" alt="" :style="arrow" />
            </button>
            <div class="unit-drop" v-if="this.unitDrop">
               <div class="unit" v-for="([k, v], i) of Object.entries(this.book)" :key="unit"
                  @click="() => {
                     this.unit = i
                     this.unitDrop = false
                  }">
                  {{ k }}
               </div>
            </div>
            <div class="unit-modal" v-show="this.unitDrop" @click="this.unitDrop = false"></div>
         </div>
      </div>
      <div class="teams-container">
         <div class="team-100">
            <div class="player" v-for="(player, i) in this.teams[0]" :key="i">
               <div class="lhs">
                  <img :src="champImg(player.championName)" class="champ-img">
                  <div class="runes-spells">
                     <div class="spells">
                        <img :src="getSpell(player.summoner1Id)" class="spells">
                        <img :src="getSpell(player.summoner2Id)" class="spells">
                     </div>
                     <div class="runes">
                        <img :src="primaryRune(player)" class="primary">
                        <img :src="secondaryRune(player)" class="secondary">
                     </div>
                  </div>
                  <div class="main">
                     {{ player.summonerName }}
                     <div class="items">
                        <img :src="itemImg(player, i)" alt="" v-for="(_, i) in 6">
                     </div>
                  </div>
               </div>
               <div class="kda">
                  {{ kda(player) }}
               </div>
               <div class="value">
                  {{ player[this.book[Object.keys(this.book)[this.unit]]] }}
                  <div class="bar">
                     <div class="value" :style="barValue(player[this.book[Object.keys(this.book)[this.unit]]])"></div>
                  </div>
               </div>
            </div>
         </div>
         <div class="team-200">
            <div class="player" v-for="(player, i) in this.teams[1]" :key="i">
               <div class="lhs">
                  <img :src="champImg(player.championName)" class="champ-img">
                  <div class="runes-spells">
                     <div class="spells">
                        <img :src="getSpell(player.summoner1Id)" class="spells">
                        <img :src="getSpell(player.summoner2Id)" class="spells">
                     </div>
                     <div class="runes">
                        <img :src="primaryRune(player)" class="primary">
                        <img :src="secondaryRune(player)" class="secondary">
                     </div>
                  </div>
                  <div class="main">
                     {{ player.summonerName }}
                     <div class="items">
                        <img :src="itemImg(player, i)" alt="" v-for="(_, i) in 6">
                     </div>
                  </div>
               </div>
               <div class="kda">
                  {{ kda(player) }}
               </div>
               <div class="value">
                  {{ player[this.book[Object.keys(this.book)[this.unit]]] }}
                  <div class="bar">
                     <div class="value" :style="barValue(player[this.book[Object.keys(this.book)[this.unit]]])"></div>
                  </div>
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
      background: var(--cell-panel);
      margin: 10px 0 20px auto;
   }

   .match-info-header {
      width: inherit;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--light-12);
   }

   h2 {
      display: inline-block;
      margin: 0;
      font-weight: normal;
      font-size: 1rem;
      opacity: 0.5;
      margin-left: 1rem;
      font-style: italic;
   }

   .temp {
      font-size: 0.8rem;
      margin: 0;
      max-width: 300px;
      margin-left: 20px;
   }

   .unit-dropdown {
      margin-left: auto;
      position: relative;
      height: 100%;
   }

   .unit-dropdown button {
      cursor: pointer;
      background: none;
      border: none;
      color: var(--color-font);
      border-radius: 7px;
      padding: 6px 10px;
      font-weight: bold;
      background: var(--alpha-02);
      margin-right: 10px;
      transition: 0.2s;
   }

   .unit-dropdown button:hover, .unit-dropdown button:focus {
      background: var(--alpha-04);
      color: var(--color-font-focus);
   }

   .unit-drop {
      position: absolute;
      width: max-content;
      top: 35px;
      right: 0;
      backdrop-filter: blur(13px) saturate(120%);
      -webkit-backdrop-filter: blur(13px) saturate(120%);
      background-color: rgba(var(--cold-blue), 0.2);
      box-shadow: 1px 1px 5px var(--alpha-14);
      border-radius: 5px;
      z-index: 5;
      margin-right: 10px;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none;
   }

   .unit {
      cursor: pointer;
      padding: 5px 10px;
      font-size: 0.85rem;
      border-radius: 5px;
   }
   .unit:hover {
      background-color: var(--alpha-06);
      color: var(--color-font-focus);
   }

   .unit-modal {
      position: fixed;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
   }

   .teams-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 30px;
      padding: 5px 10px;
   }

   .player {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
   }

   .lhs {
      display: flex;
      align-items: center;
      height: 100%;
      gap: 8px;
   }

   .champ-img {
      height: 35px;
   }

   .main {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 0.9rem;
      width: 130px;
      margin: 0;
      line-height: 0.9rem;
   }

   .main .items {
      display: flex;
      gap: 2px;
      margin-top: 2px;
   }
   
   .items img {
      width: 20px;
      border-radius: 3px;
      background-color: var(--alpha-03);
   }
   
   .runes-spells {
      display: flex;
      align-items: center;
      height: 100%;
   }

   .spells {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
   }

   .spells img {
      height: 17px;
      border-radius: 3px;
   }

   .runes {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
   }

   .primary {
      width: 20px;
      filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 1)) saturate(0.8);
   }

   .secondary {
      filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 1)) saturate(1.25);
      width: 14px;
   }

   .kda {
      font-size: 0.8rem;
      color: var(--color-font-faded);
   }


   .bar {
      width: 60px;
      height: 7px;
      background: var(--alpha-04);
   }

   .value {
      color: var(--color-font-faded);
      text-align: center;
      font-size: 0.75rem;
      transition: 0.25s ease-in-out;
   }
   
   .bar .value {
      margin-top: 3px;
      background-color: var(--ice-blue);
      height: inherit;
      z-index: 5;
   }

</style>