<script>
import names from '@/constants/champions.js'
import Match from './Match.vue'

export default {
   components: {
      Match
   },
   data() {
      return {
         iconTable: names.urlName,
         humanTable: names.humanName,
         matchToggle: false,
         classTransition: {
            'max-height': `${this.data.matches.length * 39}px;` 
         },
         matchHeight: `${this.data.matches.length * 39}px`
      }
   },

   mounted() {
      console.log(this.data.matches)
   },

   methods: {
      toggleMatches() {
         console.log('toad')
      },

      beforeEnter(el) {
         console.log('toad')
         el.style.maxHeight = `${this.data.matches.length * 39}px`
      },

      beforeLeave(el) {
         el.style.maxHeight = `${this.data.matches.length * 39}px`
      },


   },

   computed: {
      championIcon() {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/${this.iconTable[this.data.championId]}.png`
      },

      winrate() {
         return Math.round((this.data.wins / this.data.games) * 100)
      }
   },

   props: {
      data: Object,
      patch: String
   }
}
</script>

<template>
   <div class="champion-main">
      
      <div class="lhs">
         <img class="dropdown" src="@/assets/svg/arrow3.svg" @click="this.matchToggle = !this.matchToggle" :class="{ 'show-matches': this.matchToggle}">
         <div class="name-wrapper">
            <div class="icon-wrapper">
               <img class="icon" :src="championIcon" alt="">
            </div>
            {{ this.humanTable[this.data.championId] }}
         </div>
         <div class="winrate">
            {{ winrate }}% ({{ this.data.wins }}/{{ this.data.games }})
         </div>

      </div>

      <div class="rhs">
         <div class="kda">
            {{ this.data.avg.k }}/{{ this.data.avg.d }}/{{ this.data.avg.a }}
         </div>
         <div class="kp">
            {{ this.data.avg.kp }}%
         </div>
   
         <!-- Damage -->
         <div class="primary-stat">
            {{ this.data.avg.tdd }}
            <div class="per-minute-sub">
               {{ this.data.avg.dpm }}
            </div>
         </div>
   
         <!-- Taken -->
         <div class="primary-stat">
            {{ this.data.avg.tdt }}
            <div class="per-minute-sub">
               {{ this.data.avg.dtpm }}
            </div>
         </div>
   
         <!-- Mitigated -->
         <div class="primary-stat">
            {{ this.data.avg.tsm }}
            <div class="per-minute-sub">
               {{ this.data.avg.smpm }}
            </div>
         </div>
   
         <!-- Healing -->
         <div class="primary-stat">
            {{ this.data.avg.th }}
            <div class="per-minute-sub">
               {{ this.data.avg.hpm }}
            </div>
         </div>
   
         <!-- Ally Healing -->
         <div class="primary-stat">
            {{ this.data.avg.ah }}
            <div class="per-minute-sub">
               {{ this.data.avg.ahpm }}
            </div>        
         </div>
   
         <!-- Gold Earned -->
         <div class="primary-stat">
            {{ this.data.avg.gpm }}
            <div class="per-minute-sub">
               {{ this.data.avg.dpm }}
            </div>
         </div>
      </div>

   </div>
   <Transition
      leave-from-class="testo"
      enter-to-class="testo">
   <!-- <Transition> -->
      <div v-show="this.matchToggle">
            <Match v-for="(m, i) in this.data.matches" :key="i" :data="m" />
      </div>
   </Transition>
   <!-- <div class="matches-main-wrapper">
   </div> -->
</template>

<style scoped>
   /* .matches-main-wrapper {
      overflow: hidden;
      background: blue;
      min-height: 0;
      transition: 0.3s ease-in-out;
   }

   .matches-main-wrapper > div {
      max-height: 1000px;
      overflow: hidden;
      transition: 0.3s ease-in-out;
   } */
   .testo {
      max-height: 41px;
   }
   .v-enter-active,
   .v-leave-active {
      overflow: hidden;
      transition: all 0.3s ease-in-out;
   }

   .v-enter-from,
   .v-leave-to {
      opacity: 0;      
      max-height: 0;
   }

   /* .v-leave-from,
   .v-enter-to {
      max-height: v-bind('data.matches.length * 41 + "px"');
   } */
   
   .testo {
      max-height: v-bind('data.matches.length * 41 + "px"');
      /* max-height: 41px; */
   }

   .icon-wrapper {
      height: 34px;
      width: 34px;
      /* overflow: hidden; */
      border: 1px solid var(--cell-border);
   }

   img.icon {
      width: 100%;
      transform: scale(1.1);
   }
   .champion-main {
      font-size: 0.8rem;
      display: flex;
      justify-content: space-between;
      margin-bottom: 1px;
      height: 38px;
      width: 100%;
      cursor: pointer;
      padding: 2px 0;
      border-radius: 3px;
      transition: 0.1s ease-in-out
   }

   .champion-main:hover {
      background: var(--cell-panel);
   }

   .name-wrapper {
      display: flex;
      align-items: center;
   }

   .per-minute-sub {
      font-size: 0.72rem;
      color: var(--color-font-faded);
      font-style: italic;
   }
   
   .rhs, .lhs {
      display: flex;
      gap: 5px;
      align-items: center;
   }

   .name-wrapper {
      width: 120px;
   }

   .icon-wrapper {
      margin-right: 8px;
      z-index: 5;
   }

   .rhs {
      justify-content: flex-end;
   }
   
   .rhs div {
      width: 70px;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
   }

   .rhs div:nth-child(1) {
      width: 65px; /* KP */
   }

   .rhs div:nth-child(2) {
      width: 40px; /* KP */
   }
   
   .rhs div:nth-child(4) {
      width: 60px; /* KP */
   }

   .rhs div:nth-child(6) {
      width: 55px; /* Healed */
   }

   .rhs div:nth-child(7) {
      width: 75px; /* Ally Healing */
   }

   .rhs div:nth-child(8) {
      margin-left: 5px;
      width: 40px; /* Gold */
   }

   .dropdown {
      margin-left: 7px;
      margin-right: 5px;
      padding: 10px 0;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
   }
   
   .show-matches {
      transform: rotate(180deg);
   }
</style>