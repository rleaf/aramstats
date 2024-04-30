<script>
import Match from './Match.vue'
import Wip from './Wip.vue'
import championNameBook from '../../../constants/championNames'

export default {
   components: {
      Match,
   },

   data() {
      return {
         championIcon: `https://ddragon.leagueoflegends.com/cdn/${this.currentPatch}/img/champion/${this.champion.name}.png`,
         expand: false,
      }
   },

   created() {
      // fix this sometime by using champions
      if (this.champion.name == 'FiddleSticks') this.champion.name = 'Fiddlesticks'
   },

   methods: {
      getChampionName(name) {
         return (name in championNameBook) ? championNameBook[name] : name
      }
   },

   computed: {
      background() {
         // const img = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.champion.name}_0.jpg`
         const img = new URL(`../assets/champion_splash/${this.champion.name.toLowerCase()}.webp`, import.meta.url).href
         if (this.lazy) {
            return `linear-gradient(to right, rgba(var(--cell-panel-rgb), 0.8), rgba(var(--cell-panel-rgb), 0.85) 10%, var(--cell-panel) 60%), no-repeat -110% 20%/80% url('${img}')`
         }
      },
      winrate() {
         return Math.round((this.champion.wins / this.champion.games) * 100)
      },

      size() {
         return `${this.champion.wins}/${this.champion.games}`
      },

      kda() {
         return `${this.champion.avg.k}/${this.champion.avg.d}/${this.champion.avg.a}`
      },

      sortMatches() {
         return this.champion.matches.sort((a, b) => b.gc - a.gc)
      }
   },

   props: {
      champion: Object,
      currentPatch: null,
      lazy: Boolean
   }
}  
</script>

<template>
   <div>
      <div class="champion-main" :style="{ background: background}">
         <button class="dropdown" @click="this.expand =! this.expand">
            <img src="../assets/svg/arrow2.svg" alt="" :class="{ expand: this.expand }">
         </button>
         <div class="lhs">
            <h2>{{ getChampionName(this.champion.name) }}</h2>
            <div class="lhs-stats">
               <img v-if="lazy" :src="this.championIcon" :alt="this.champion.name">
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
                     {{ this.champion.avg.kp }}% KP
                  </div>
               </div>
            </div>
         </div>
         <div class="multi-kills">
            <div class="triple">{{ this.champion.mk.t }}</div>
            <div class="quadra">{{ this.champion.mk.q }}</div>
            <div class="penta">{{ this.champion.mk.p }}</div>
         </div>
         <div class="rhs-stats">
            <div>
               <div class="title">
                  Damage
               </div>
               <div class="secondary-body">
                  {{ this.champion.avg.tdd }}, {{ this.champion.avg.ds }}%
               </div>
               <div class="secondary-sub">
                  {{ this.champion.avg.dpm }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Healing
               </div>
               <div class="secondary-body">
                  {{ this.champion.avg.th }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.avg.hpm }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Ally Healing
               </div>
               <div class="secondary-body">
                  {{ this.champion.avg.ah }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.avg.ahpm }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Damage Taken
               </div>
               <div class="secondary-body">
                  {{ this.champion.avg.tdt }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.avg.dtpm  }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Damage Mitigated
               </div>
               <div class="secondary-body">
                  {{ this.champion.avg.tsm  }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.avg.smpm  }}/m
               </div>
            </div>
            <div>
               <div class="title">
                  Gold
               </div>
               <div class="secondary-body">
                  {{ this.champion.avg.ge }}
               </div>
               <div class="secondary-sub">
                  {{ this.champion.avg.gpm }}/m
               </div>
            </div>
         </div>
      </div>
      <div class="match" v-if="this.expand">
         <Match v-if="currentPatch" v-for="match in sortMatches"
            :key="match.matchId"
            :match="match"
            :currentPatch="this.currentPatch"/>
      </div>
   </div>
</template>

<style scoped>
   .champion-main {
      width: 100%;
      background-color: var(--cell-panel);
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
      cursor: pointer;
   }

   .dropdown img {
      transition: filter 0.25s;
   }

   button.dropdown:hover {
      background: var(--alpha-05);
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
      margin: 0 10px;
      flex-direction: column;
      width: max-content;
   }

   .lhs h2 {
      font-size: 1.1rem;
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
      font-size: 1.2rem;
      font-weight: normal;
   }
   
   .title {
      display: block;
      color: var(--color-font-faded);
      font-size: 0.8rem;
      line-height: 0.9;
      font-weight: normal;
   }

   .sub {
      display: block;
      color: var(--color-font-faded);
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
      background-image: url('../assets/svg/triple_small.svg');
   }

   .quadra {
      background-image: url('../assets/svg/diamond_small.svg');
   }

   .penta {
      background-image: url('../assets/svg/penta_small.svg');
   }

   .rhs-stats {
      display: grid;
      height: 100%;
      align-items: center;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      column-gap: 30px;
      margin-left: 10px;
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
      line-height: 1.4;
      font-size: 0.9rem;
   }

   .secondary-sub {
      color: var(--color-font-faded);
      font-size: 0.75rem;
      line-height: 0.9;
   }
</style>