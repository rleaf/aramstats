<script>
import Match from './Match.vue'

export default {
   components: {
      Match,
   },
   data() {
      return {
         championIcon: `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${this.champion.championName}.png`,
         fid: `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/Fiddlesticks.png`,
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
      }
   },

   props: {
      champion: Object
   },
}
</script>

<template>
   <div class="row-container" @click="toggle()">
      <div class="row-stats">
         <img :src="(this.champion.championName == 'FiddleSticks') ? this.fid : championIcon" alt="">
         <div class="champ-name cell">
            {{ trueChampionName }}
         </div>
         <div class="total-games cell">
            {{ this.champion.totalGames }}
         </div>
         <div class="wins cell">
            {{ this.champion.wins }}
         </div>
         <div class="avg-dmg cell">
            {{ this.champion.averageTotalDamageDealt }}
            <div class="sub-cell">
               {{ this.champion.averageDamagePerMinute }} DPM
            </div>
         </div>
         <div class="avg-healing cell">
            {{ this.champion.averageTotalHeal || '-' }}
         </div>
         <div class="avg-healing cell">
            {{ this.champion.averageHealingOnTeammates }}
         </div>
         <div class="avg-dmg-taken cell">
            {{ this.champion.averageTotalDamageTaken }}
         </div>
         <div class="avg-mitigated-dmg cell">
            {{ this.champion.averageTotalSelfMitigated || '-' }}
         </div>
         <div class="avg-kda cell">
            {{ this.champion.averageKDA }}
         </div>
         <div class="avg-gold cell">
            {{ this.champion.averageGoldEarned }}
            <div class="sub-cell">
               {{ this.champion.averageGoldPerMinute }} GPM
            </div>
         </div>
         <div class="tqp-wrapper cell">
            <div class="tqp-1">
               {{ this.champion.totalTripleKills }}
            </div>
            <div class="tqp-1">
               {{ this.champion.totalQuadraKills }}
            </div>
            <div class="tqp-1">
               {{ this.champion.totalPentaKills }}
            </div>
         </div>
      </div>
         <div class="matches" v-show="this.expand">
            <Match v-for="match in this.champion.matches"
            :key="match.matchId"
            :match="match"
            :class="winOrLoss(match)"/>
         </div>
   </div>
</template>

<style scoped>
@import url('../assets/stats.css');

.sub-cell {
   font-size: 0.7rem;
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

.row-stats {
   display: flex;
   align-items: center;
   height: 40px;
   color: var(--color-font);
}

img {
   height: 36px;
   padding-left: 2px;
   padding-right: 8px;
}


</style>