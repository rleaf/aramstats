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
         // classProfile: [
         //    { class: 'Controller', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
         //    { class: 'Fighter', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
         //    { class: 'Mage', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
         //    { class: 'Marksman', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
         //    { class: 'Slayer', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
         //    { class: 'Tank', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0},
         //    { class: 'Specialist', Enchanter: 0, Catcher: 0, Juggernaut: 0, Diver: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0, Marksman: 0, Assassin: 0, Skirmisher: 0, Vanguard: 0, Warden: 0, Specialist: 0}
         // ],
         classProfile: [
            { class: 'Controller', Total: 0, Enchanter: 0, Catcher: 0},
            { class: 'Fighter', Total: 0, Juggernaut: 0, Diver: 0},
            { class: 'Mage', Total: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0},
            { class: 'Marksman', Total: 0, Marksman: 0},
            { class: 'Slayer', Total: 0, Assassin: 0, Skirmisher: 0},
            { class: 'Tank', Total: 0, Vanguard: 0, Warden: 0},
            { class: 'Specialist', Total: 0, Specialist: 0}
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
         for (const champ of this.data) {
            this.totalMatches += champ.totalGames
            this.totalWins += champ.wins
         }
      },

      classProfiler() {

         // Iterate through champions
         for(const champion of this.data) {
            let gameCount = champion.matches.length
            let championClass = classBook[champion.championName.toLowerCase()]

            // Iterate through subclasses
            for(const subClass of championClass) {
               let classIndex = this.classIndexTable[subClass]
               this.classProfile[classIndex][subClass] += (gameCount / this.totalMatches) * 100 // % based off total games 
            }

            // Calculate class.Total %
            for(const mainClass of this.classProfile) {
               mainClass.Total = Object.values(mainClass).slice(2).reduce((a, b) => a + b)
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
      <div class="overview-stats">
         <div class="percent-frac">
            <div class="wr-percent">
               {{ Math.round((this.totalWins / this.totalMatches) * 1000) / 10 }}%
            </div>
            <div class="wr-frac">
               ({{ this.totalWins }}/{{ this.totalMatches }}) WR
            </div>
         </div>
      </div>
      <StackedBarplot :data="classData"/>

   </div>
</template>

<style scoped>
.percent-frac {
      display: flex;
      align-items: center;
      padding-top: 15px;
   }
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

   .overview-stats {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 305px;
      border-radius: 10px;
      background: var(--profile-panel);
   }
   .overview-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 30px;
      border-bottom: 1px solid var(--color-font);
      height: 51px;
   }

   .overview-main {
      display: flex;
      height: 310px;
      flex-direction: row;
      border-radius: 5px;
   }
</style>