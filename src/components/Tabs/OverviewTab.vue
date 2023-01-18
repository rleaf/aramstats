<script>
import StackedBarplot from '../StackedBarplot.vue'
import { classBook } from '../../assets/aram_champ_classes'

export default {
   components: {
      StackedBarplot
   },
   data() {
      return {
         totalMatches: 0,
         totalWins: 0,
         classProfile: [
            { class: 'Controller', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
            { class: 'Fighter', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
            { class: 'Mage', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
            { class: 'Marksman', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
            { class: 'Slayer', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
            { class: 'Tank', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
            { class: 'Specialist', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0}
         ],

         classIndexTable: {
            Enchanter: 0,
            Catcher: 0,
            Juggernaut: 1,
            Diver: 1,
            Mage: 2,
            Burst: 2,
            Battlemage: 2,
            Artillery: 2,
            Marksman: 3,
            Assassin: 4,
            Skirmisher: 4,
            Vanguard: 5,
            Warden: 5,
            Specialist: 6
         }
      }
   },

   created(){ 
      this.winrate()
      this.classProfiler()
   },

   methods: {
      winrate() {
         this.data.slice(1).forEach((champ) => {
            this.totalMatches += champ.totalGames
            this.totalWins += champ.wins
         })
      },

      classProfiler() {

         // Iterate through champions
         for(const champion of this.data) {
            let gameCount = champion.matches.length
            let x = classBook[champion.championName.toLowerCase()]

            // Iterate through subclasses
            for(const subclass of x) {
               let classIndex = this.classIndexTable[subclass]
               this.classProfile[classIndex][subclass] += (gameCount / this.totalMatches) * 100 // % based off total games 
               // this.classProfile[classIndex][subclass] += gameCount // games for that class
            }  
         }
            
      }
   },

   props: {
      data: null
   },

   computed: {
      classData() {
         return this.classProfile
      }
   }
}
</script>

<template>
   <div class="overview-main">
      <div class="overview-header">
         <div class="wr-percent">
            {{ Math.round((this.totalWins / this.totalMatches) * 1000) / 10 }}%
         </div>
         <div class="wr-frac">
            ({{ this.totalWins }}/{{ this.totalMatches }}) WR
         </div>
         
         
      </div>
      <div class="overview-body">
         <StackedBarplot :data="classData"/>
         <!-- <div style="color: var(--color-font); padding-left: 20px;">wip</div> -->
            
      </div>
      <!-- <div class="overview-body">
         stats
      </div> -->

   </div>
</template>

<style scoped>
.wr-frac {
      color: var(--color-font-fade);
      padding-left: 10px;
      font-size: 0.9rem;
   }

   .wr-percent {
      font-weight: bold;
      font-size: 1.5rem;
      color: var(--header-stats);
   }

   .overview-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 30px;
      border-bottom: 1px solid var(--color-font);
      height: 51px;
   }

   /* .summ-wr {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      padding-top: 50px;
      width: 240px;
   } */
   .overview-body {
      display: flex;
      height: 298px;
      flex-direction: row;
      /* justify-content: space-evenly; */
   }
   .overview-main {
      /* display: flex;
      flex-direction: row; */
      background: var(--profile-panel);
      height: 350px;
      border-radius: 5px;
   }

   .wip {
      text-align: center;
      padding-top: 150px;
      color: var(--color-font);
   }
</style>