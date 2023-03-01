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

   methods: {
      toggle() {
         this.expand = !this.expand
      },

      winOrLoss(x) {
         return (x.win) ? 'win': 'loss'
      }
   },

   computed: {
      trueChampionName() {
         return (this.champion.trueChampionName) ? this.champion.trueChampionName : this.champion.championName
      },
      winPercent() {
         return Math.round((this.champion.wins / this.champion.totalGames) * 100)
      },
      computeKDA() {
         const stringValues = this.champion.averageKDA.split('/')
         const numberValues = []

         stringValues.forEach((x) => numberValues.push(parseInt(x)))

         return Math.round((numberValues[0] + numberValues[2]) / numberValues[1] * 100) / 100
      },
      arrow() {
         return new URL(`../assets/arrow.svg`, import.meta.url).href
      }
   },

   props: {
      champion: Object
   },
}
</script>

<template>
   <div class="row-container">
      <div class="stats">
         <div class="left-stats">
            <div class="tab" @click="toggle()">
               <img :src="arrow" :class="{flip: this.expand}" alt="">
            </div>
            <img class="champion-image" :src="this.championIcon" alt="">
            <div class="champ-name cell">
               {{ trueChampionName }}
            </div>
            <div class="games cell">
               <p class="main">
                  {{ winPercent }}% <span class="unit">winrate</span>
               </p>
               {{ this.champion.wins }} / {{ this.champion.totalGames }} <span class="unit">wins / total</span>
            </div>
            <div class="avg-kda cell">
               <p class="main">
                  {{ this.champion.averageKDA }} <span class="unit">KDA</span>
               </p>
               {{ computeKDA }}, {{ this.champion.averageKillParticipation || '-' }}% <span class="unit">KP</span>
            </div>
            <div class="tqp-wrapper cell">
               <div class="tqp-1">
                  <span class="unit">Triple</span> {{ this.champion.totalTripleKills }} 
               </div>
               <div class="tqp-1">
                  <span class="unit">Quadra</span> {{ this.champion.totalQuadraKills }}
               </div>
               <div class="tqp-1">
                  <span class="unit">Penta</span> {{ this.champion.totalPentaKills }}
               </div>
            </div>
         </div>
         <div class="right-stats">
            <div class="avg-dmg cell">
               <p>Damage</p>
               {{ this.champion.averageTotalDamageDealt }}, {{ this.champion.averageDamageShare || '-' }}% <span class="unit">DS</span>
               <div class="per-minute">
                  {{ this.champion.averageDamagePerMinute }} <span class="unit">/ m</span>
               </div>
            </div>
            <div class="avg-healing cell">
               <p>Healing</p>
               {{ this.champion.averageTotalHeal || '-' }}
               <div class="per-minute">
                  {{ this.champion.averageHealPerMinute || '-'}} <span class="unit">/ m</span>
               </div>
            </div>
            <div class="avg-ally-healing cell">
               <p>Ally Healing</p>
               {{ this.champion.averageHealingOnTeammates }}
               <div class="per-minute">
                  {{ this.champion.averageAllyHealPerMinute }} <span class="unit">/ m</span>
               </div>
            </div>
            <div class="avg-dmg-taken cell">
               <p>Damage Taken</p>
               {{ this.champion.averageTotalDamageTaken }}
               <div class="per-minute">
                  {{ this.champion.averageDamageTakenPerMinute || '-' }} <span class="unit">/ m</span>
               </div>
            </div>
            <div class="avg-mitigated-dmg cell">
               <p>Damage Mitigated</p>
               {{ this.champion.averageTotalSelfMitigated || '-' }}
               <div class="per-minute">
                  {{ this.champion.averageSelfMitigatedPerMinute || '-' }} <span class="unit">/ m</span>
               </div>
            </div>
            <div class="avg-gold cell">
               <p>Gold</p>
               {{ this.champion.averageGoldEarned }}
               <div class="per-minute">
                  {{ this.champion.averageGoldPerMinute }} <span class="unit">/ m</span>
               </div>
            </div>
         </div>
      </div>
      <div class="matches" v-show="this.expand">
         <Match v-for="match in this.champion.matches"
         :key="match.matchId"
         :match="match" />
         <!-- :class="winOrLoss(match)"/> -->
      </div>
      <!-- <Transition name="slide">
      </Transition> -->
   </div>
</template>

<style scoped>
@import url('../assets/stats.css');

/* .slide-enter-from {
   transform: translateY(-100%) scaleY(0);
}
.slide-leave-to {
   transform: translateY(-100%);
   transform: scaleY(0);
} */



.per-minute {
   font-size: 12px;
   font-style: oblique;
   color: var(--color-font);
}

.matches {
   border-top: 1px solid var(--border-top);
}

.row-container {
   max-width: 1200px;
   margin-bottom: 2px;
}

.style-0 {
   background-color: var(--champion-0);
}

.style-1 {
   background-color: var(--champion-1);
}

.stats {
   display: flex;
   justify-content: space-between;
   flex-direction: row;
   color: var(--color-font);
}

.right-stats {
   display: flex;
   /* gap: 30px; */
   flex-direction: row;
   align-items: center;
   height: 70px;
}

.right-stats p {
   color: var(--light900);
   font-size: 13px;
   margin: 0;
}

.avg-dmg {
   width: 120px; 
}

.avg-healing {
   width: 75px;
}

.avg-ally-healing {
   width: 90px;
}

.avg-dmg-taken {
   width: 110px;
}

.avg-mitigated-dmg {
   width: 130px;
}

.avg-gold {
   width: 70px;
}

.left-stats {
   display: flex;
   /* gap: 20px; */
   /* width: 525px; */
   /* justify-content: space-between; */
   flex-direction: row;
   height: 70px;
   align-items: center;
}

.tab {
   transition: 0.25s;
   width: 22px;
   height: inherit;
   background-color: var(--blue600t_test);
   /* background: linear-gradient(180deg, var(--blue600t_test), var(--blue300t)); */
}

.tab:hover {
   cursor: pointer;
   background: var(--blue300t);
}

.tab img {
   position: relative;
   top: 70%;
   left: 50%;
   transform: translateX(-50%);
   filter: invert(10%) sepia(14%) saturate(1667%) hue-rotate(182deg) brightness(98%) contrast(97%);
   margin: 0;
   width: 15px;
   height: 15px;
}

img.flip {
   transform: translateX(-50%) rotate(180deg);
}

img.champion-image {
   height: 55px;
   margin: 0 9px;
}

.champ-name {
   width: 130px;
   text-align: left;
   font-size: 18px;
   font-weight: 500;
}

.games {
   width: 140px;
   font-size: 14px;
}

.main {
   font-size: 18px;
   font-weight: 500;
   margin: 0;
   color: var(--color-font);
}

.unit {
   font-size: 13px;
   color: var(--light900);
}

.avg-kda {
   width: 120px;
   font-size: 13px;
}

.tqp-wrapper {
   display: flex;
   width: 56px;
   font-size: 13px;
   flex-direction: column;
}

</style>