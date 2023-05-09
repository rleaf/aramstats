<script>
import Match from './Match.vue'

export default {
   components: {
      Match,
   },

   data() {
      return {
         championIcon: new URL(`../assets/champion_icons/${this.champion.championName.toLowerCase()}.png`, import.meta.url).href,
         expand: false,
      }
   },

   computed: {
      background() {
         const img = new URL(`../assets/champion_splash/${this.champion.championName.toLowerCase()}.webp`, import.meta.url).href
         return `background: linear-gradient(to right, rgba(var(--tint100RGB), 0.8), rgba(var(--tint100RGB), 0.85) 10%, rgba(var(--tint100RGB), 1.0) 60%), no-repeat -110% 20%/80% url('${img}')`
      },
      winrate() {
         return Math.round((this.champion.wins / this.champion.totalGames) * 100)
      },

      size() {
         return `(${this.champion.wins}/${this.champion.totalGames})`
      },

      kda() {
         if (!this.champion.averageKills) return '-'
         return `${this.champion.averageKills}/${this.champion.averageDeaths}/${this.champion.averageAssists}`
      },
   },

   props: {
      champion: Object
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
            <h2>{{ this.champion.championName }}</h2>
            <div class="lhs-stats">
               <img :src="this.championIcon" :alt="this.champion.championName">
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
                     {{ kda}}
                  </div>
                  <div class="sub">
                     {{ this.champion.averageKillParticipation }}% KP
                  </div>
               </div>
            </div>
         </div>
         <div class="multi-kills">
            <div class="triple">{{ this.champion.totalTripleKills }}</div>
            <div class="quadra">{{ this.champion.totalQuadraKills }}</div>
            <div class="penta">{{ this.champion.totalPentaKills }}</div>
         </div>
         <div class="secondary-stats">
            <div>
               <div class="title">
                  Damage
               </div>
               <div class="secondary-body">
                  {{ this.champion.averageTotalDamageDealt }}, {{ this.champion.averageDamageShare || '-' }}%
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averageDamagePerMinute }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Healing
               </div>
               <div class="secondary-body">
                  {{ this.champion.averageTotalHeal }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averageHealPerMinute || '-' }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Ally Heals
               </div>
               <div class="secondary-body">
                  {{ this.champion.averageHealingOnTeammates }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averageAllyHealPerMinute }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Taken
               </div>
               <div class="secondary-body">
                  {{ this.champion.averageTotalDamageTaken }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averageDamageTakenPerMinute || '-'  }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Mitigated
               </div>
               <div class="secondary-body">
                  {{ this.champion.averageTotalSelfMitigated || '-'  }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averageSelfMitigatedPerMinute || '-'  }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Gold
               </div>
               <div class="secondary-body">
                  {{ this.champion.averageGoldEarned }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.averageGoldPerMinute }}/m
               </div>
            </div>
         </div>
      </div>
      <div class="match" v-show="this.expand">
         <Match v-for="match in this.champion.matches"
            :key="match.matchId"
            :match="match"/>
      </div>
   </div>
</template>

<style scoped>
   .champion-main {
      width: 100%;
      background-color: var(--tint100);
      margin: 20px 0;
      height: 120px;
      border-radius: 15px;
      display: flex;
      align-items: center;
   }

   .dropdown {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: none;
      border: none;
      transition: 0.25s;
      border-radius: 15px 0 0 15px;
      margin-right: 5px;
      cursor: pointer;
   }

   button.dropdown:hover {
      background: var(--hoverButton);
   }

   .expand {
      transform: rotate(180deg);
   }

   .lhs {
      display: flex;
      justify-content: center;
      /* gap: 10px; */
      flex-direction: column;
      width: max-content;
   }

   .lhs h2 {
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
      min-width: 200px;
      gap: 15px;
   }

   .body {
      font-size: 1.5rem;
      font-weight: bold;
      line-height: 1;
   }

   .title {
      display: block;
      color: var(--tint400);
      font-size: 0.9rem;
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

   .secondary-stats {
      display: flex;
      width: 100%;
      justify-content: space-around;
   }

   .secondary-stats div {
      width: max-content;
   }

   .secondary-body {
      line-height: 1.5;
   }

   .secondary-sub {
      color: var(--tint400);
      font-size: 0.8rem;
      line-height: 0.9;
   }
</style>