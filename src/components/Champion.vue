<script>
import TableLite from "vue3-table-lite";

export default {
   components: {
     'table-light': TableLite 
   },
   data() {
      return {
         championIcon: `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${this.champion.championName}.png`,
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

   created() {
      // console.log(this.champion, 'weeeeee')
   },
   mounted() {
      // for (let i = 1; i < this.champion.length; i++) {
         //    this.table.rows.push(this.champion[i])
         // }
         // if (this.champion.championName == 'TahmKench') {
         //    this.champion.championName = 'Tahm Kench'
         // }
         
   },

   props: {
      champion: Object
   }
}
</script>

<template>
   <div class="row-container">
      <div class="container">
         <!-- <div class="champ-img cell">
         </div> -->
         <img :src=championIcon alt="">
         <div class="champ-name cell">
            {{ this.champion.championName }}
         </div>
         <div class="total-games cell">
            {{ this.champion.totalGames }}
         </div>
         <div class="wins cell">
            {{ this.champion.wins }}
         </div>
         <div class="average-dmg cell">
            {{ this.champion.averageTotalDamageDealt }}
         </div>
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
         <div class="triple-kills cell">
            {{ this.champion.totalTripleKills }}
         </div>
         <div class="quadra-kills cell">
            {{ this.champion.totalQuadraKills }}
         </div>
         <div class="penta-kills cell">
            {{ this.champion.totalPentaKills }}
         </div>
      </div>



      <!-- <table-light
         :is-loading="this.table.isLoading"
         :columns="this.table.columns"
         :rows="this.table.rows"
         :sortable="this.table.sortable"
      ></table-light> -->
   </div>
</template>

<style scoped>

.row-container {
   width: 100%;
   /* height: 200px; */
   background-color: #363636;
}

.container {
   display: flex;
   /* gap: 30px; */
   /* justify-content: left; */
   align-items: center;
   height: 40px;
   margin-bottom: 2px;
   /* line-height: 40px; */
   background-color: #36375a;
   color: var(--light2);
}

img {
   height: 36px;
   /* padding-top: 4px; */
   padding-left: 2px;
   padding-right: 8px;
}

.cell {
   width: 109px;
}

</style>