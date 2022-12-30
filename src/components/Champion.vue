<script>
import TableLite from "vue3-table-lite";
import Match from './Match.vue'

export default {
   components: {
      Match,
     'table-light': TableLite 
   },
   data() {
      return {
         championIcon: `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${this.champion.championName}.png`,
         fid: `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/Fiddlesticks.png`,
         expand: false,
         // table: {
         //    isLoading: false,
         //    columns: [
         //       {
         //          label: "Champion",
         //          field: "championName",
         //          sortable: true,
         //          isKey: true,
         //       },
         //       {
         //          label: "Total Games",
         //          field: "totalGames",
         //          sortable: true,
         //       },
         //       {
         //          label: "Wins",
         //          field: "wins",
         //          sortable: true,
         //       },
         //       {
         //          label: "Avg Damage",
         //          field: "averageTotalDamageDealt",
         //          sortable: true,
         //       },
         //       {
         //          label: "Avg Healing",
         //          field: "averageHealingOnTeammates",
         //          sortable: true,
         //       },
         //       {
         //          label: "Avg DT",
         //          field: "averageTotalDamageTaken",
         //          sortable: true,
         //       },
         //       {
         //          label: "Avg KDA",
         //          field: "averageKDA",
         //          sortable: true,
         //       },
         //       {
         //          label: "Avg Gold",
         //          field: "averageGoldEarned",
         //          sortable: true,
         //       },
         //       {
         //          label: "Triple Kills",
         //          field: "totalTripleKills",
         //          sortable: true,
         //       },
         //       {
         //          label: "Quadra Kills",
         //          field: "totalQuadraKills",
         //          sortable: true,
         //       },
         //       {
         //          label: "Penta Kills",
         //          field: "totalPentaKills",
         //          sortable: true,
         //       },
               
         //    ],
         //    rows: [

         //    ],
         //    totalRecordCount: 0,
         //    sortable: {
         //       order: "id",
         //       sort: "asc",
         //    },
         // }
      }
   },

   mounted() {
      // for (let i = 1; i < this.champion.length; i++) {
         //    this.table.rows.push(this.champion[i])
         // }
         // if (this.champion.championName == 'TahmKench') {
         //    this.champion.championName = 'Tahm Kench'
         // }
         
   },

   methods: {
      toggle() {
         this.expand = !this.expand
      },

      winOrLoss(x) {
         return (x.win) ? 'win': 'loss'
      }
   },

   props: {
      champion: Object
   }
}
</script>

<template>
   <div class="row-container" @click="toggle()">
      <div class="row-stats">
         <img :src="(this.champion.championName == 'FiddleSticks') ? this.fid : championIcon" alt="">
         <div class="champ-name cell">
            {{  this.champion.championName }}
         </div>
         <div class="total-games cell">
            {{ this.champion.totalGames }}
         </div>
         <div class="wins cell">
            {{ this.champion.wins }}
         </div>
         <div class="avg-dmg cell">
            {{ this.champion.averageTotalDamageDealt }}
            <div class="avg-dpm">
               {{ this.champion.averageDamagePerMinute }} DPM
            </div>
         </div>
         <!-- <div class="avg-dpm cell">
            {{ this.champion.averageDamagePerMinute }}
         </div> -->
         <div class="avg-healing cell">
            {{ this.champion.averageHealingOnTeammates }}
         </div>
         <div class="avg-dmg-taken cell">
            {{ this.champion.averageTotalDamageTaken }}
         </div>
         <div class="avg-kda cell">
            {{ this.champion.averageKDA }}
         </div>
         <div class="avg-gold cell">
            {{ this.champion.averageGoldEarned }}
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
         <div class="quadra-kills cell">
         </div>
         <div class="penta-kills cell">
         </div>
      </div>
      <!-- <Transition name="slide">
      </Transition> -->
      <div class="matches" v-show="this.expand">
         <Match v-for="match in this.champion.matches"
         :key="match.matchId"
         :match="match"
         :class="winOrLoss(match)"/>
      </div>
   </div>
</template>

<style scoped>
.avg-dpm {
   font-size: 0.7rem;
   font-style: oblique;
   color: var(--light3);
}
.tqp-1 {
   display: inline-block;
   width: 40px;
   /* padding-right: 20px; */
}
.matches {
   border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.row-container {
   max-width: 1200px;
   margin-bottom: 2px;
   /* background-color: rgba(0, 0, 0, 0.6); */
}

.style-0 {
   background-color: rgba(0, 0, 0, 0.65);
}

.style-1 {
   background-color: rgba(0, 0, 0, 0.45);
}

.row-stats {
   display: flex;
   align-items: center;
   height: 40px;
   /* background-color: #36375a; */
   color: var(--light2);
}

img {
   height: 36px;
   /* padding-top: 4px; */
   padding-left: 2px;
   padding-right: 8px;
}

.cell {
   /* width: 109px; */
   /* width: 200px; */
   flex: 0 0 120px;
}
</style>