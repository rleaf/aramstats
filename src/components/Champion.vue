<script>
import Match from './Match.vue'

export default {
   components: {
      Match,
   },

   data() {
      return {
         championIcon: new URL(`../assets/champion_icons/${this.champion.name.toLowerCase()}.png`, import.meta.url).href,
         expand: false,
      }
   },

   computed: {
      championName() {
         return (this.champion.trueChampionName) ? this.champion.trueChampionName : this.champion.name
      },

      background() {
         const img = new URL(`../assets/champion_splash/${this.champion.name.toLowerCase()}.webp`, import.meta.url).href
         return `background: linear-gradient(to right, rgba(var(--tint100RGB), 0.8), rgba(var(--tint100RGB), 0.85) 10%, rgba(var(--tint100RGB), 1.0) 60%), no-repeat -110% 20%/80% url('${img}')`
      },
      winrate() {
         return Math.round((this.champion.wins / this.champion.games) * 100)
      },

      size() {
         return `${this.champion.wins}/${this.champion.games}`
      },

      kda() {
         return `${this.champion.averages.kills}/${this.champion.averages.deaths}/${this.champion.averages.assists}`
      },
   },

   props: {
      champion: Object,
      currentPatch: ''
   }
}
</script>

<template>
   <div>

      <div class="champion-main" :style="background">
         <button class="dropdown" @click="this.expand =! this.expand">
            <img src="../assets/arrow2.svg" alt="" :class="{ expand: this.expand }">
         </button>
         <div class="lhs">
            <h2>{{ championName }}</h2>
            <div class="lhs-stats">
               <img :src="this.championIcon" :alt="this.champion.name">
               <div class="champ-winrate">
                  <div class="title">
                     Winrate
                  </div>
                  <div class="body">
                     {{ winrate }}%
                  </div>
                  <div class="sub">
                     {{ size }}
                  </div>
               </div>
               <div class="champ-kda">
                  <div class="title">
                     KDA
                  </div>
                  <div class="body">
                     {{ kda }}
                  </div>
                  <div class="sub">
                     {{ this.champion.averages.killParticipation }}% KP
                  </div>
               </div>
            </div>
         </div>
         <div class="multi-kills">
            <div class="triple">{{ this.champion.multikills.triple }}</div>
            <div class="quadra">{{ this.champion.multikills.quadra }}</div>
            <div class="penta">{{ this.champion.multikills.penta }}</div>
         </div>
         <div class="rhs-stats">
            <div>
               <div class="title">
                  Damage
               </div>
               <div class="secondary-body">
                  {{ this.champion.averages.totalDamageDealt }}, {{ this.champion.averages.damageShare || '-' }}%
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averages.damagePerMinute }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Healing
               </div>
               <div class="secondary-body">
                  {{ this.champion.averages.totalHeal }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averages.healingPerMinute || '-' }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Ally Healing
               </div>
               <div class="secondary-body">
                  {{ this.champion.averages.healingOnTeammates }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averages.allyHealPerMinute }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Damage Taken
               </div>
               <div class="secondary-body">
                  {{ this.champion.averages.totalDamageTaken }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averages.damageTakenPerMinute || '-'  }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Damage Mitigated
               </div>
               <div class="secondary-body">
                  {{ this.champion.averages.totalSelfMitigated || '-'  }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averages.selfMitigatedPerMinute || '-'  }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Gold
               </div>
               <div class="secondary-body">
                  {{ this.champion.averages.goldEarned }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averages.goldPerMinute }}/m
               </div>
            </div>
         </div>
      </div>
      <div class="match" v-show="this.expand">
         <Match v-if="currentPatch" v-for="match in this.champion.matches"
            :key="match.matchId"
            :match="match"
            :currentPatch="this.currentPatch"
            />
      </div>
   </div>
</template>

<style scoped>
   .champion-main {
      width: 100%;
      background-color: var(--tint100);
      margin-bottom: 20px;
      height: 120px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
   }

   .dropdown {
      height: 100%;
      width: 30px;
      background: none;
      border: none;
      transition: 0.25s;
      border-radius: 15px 0 0 15px;
      /* margin-right: 5px; */
      cursor: pointer;
   }

   .dropdown img {
      transition: filter 0.25s;
   }

   button.dropdown:hover {
      background: var(--hoverButton);
   }

   button.dropdown:hover img {
      filter: brightness(0) invert(1);
   }

   .expand {
      transform: rotate(180deg);
   }

   .lhs {
      display: flex;
      justify-content: center;
      /* gap: 10px; */
      margin: 0 10px;
      flex-direction: column;
      width: max-content;
   }

   .lhs h2 {
      /* text-align: center; */
      font-size: 1.25rem;
      margin-top: -5px;
      margin-bottom: 10px;
   }
   .lhs img {
      width: 65px;
      height: 65px;
      border-radius: 3px;
   }

   .lhs-stats {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 240px;
      gap: 25px;
   }

   .body {
      font-size: 1.5rem;
      font-weight: lighter;
      /* line-height: 1.2; */
   }
   
   .title {
      display: block;
      color: var(--tint400);
      font-size: 0.8rem;
      line-height: 0.9;
      font-weight: normal;
   }

   .sub {
      display: block;
      color: var(--tint400);
      font-size: 0.9rem;
      font-weight: normal;
   }

   .multi-kills div{
      padding: 5px 15px;
      margin: 0 10px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 60%;
      text-align: center;
   }

   .triple {
      background-image: url('../assets/triple_small.svg');
   }

   .quadra {
      background-image: url('../assets/diamond_small.svg');
   }

   .penta {
      background-image: url('../assets/penta_small.svg');
   }

   /*  */

   .rhs-stats {
      display: grid;
      height: 100%;
      align-items: center;
      /* width: 100%; */
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      column-gap: 30px;
      margin-left: 10px;
   }

   /* .rhs-stats div {
      width: 30px;
   } */

   /*  */

   .secondary-stats {
      display: flex;
      width: 100%;
      justify-content: space-around;
   }

   .secondary-stats div {
      width: max-content;
   }

   .secondary-body {
      line-height: 1.4;
      font-weight: lighter;
   }

   .secondary-sub {
      color: var(--tint400);
      font-size: 0.75rem;
      line-height: 0.9;
   }
</style>