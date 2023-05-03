<script>
import StackedBarplot from '../StackedBarplotN.vue'
import { classBook } from '../../assets/aram_champ_classes'

export default {
   components: {
      StackedBarplot
   },

   data() {
      return {
         classProfile: [
            { class: 'Controller', Total: 0, Enchanter: 0, Catcher: 0 },
            { class: 'Fighter', Total: 0, Juggernaut: 0, Diver: 0 },
            { class: 'Mage', Total: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0 },
            { class: 'Marksman', Total: 0, Marksman: 0 },
            { class: 'Slayer', Total: 0, Assassin: 0, Skirmisher: 0 },
            { class: 'Tank', Total: 0, Vanguard: 0, Warden: 0 },
            { class: 'Specialist', Total: 0, Specialist: 0 }
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

   created() {
      // console.log(this.championData)
      this.classProfiler()
   },

   methods: {
      classProfiler() {
         // Iterate through champions
         for (const champion of this.championData) {
            let gameCount = champion.matches.length
            let championClass = classBook[champion.championName.toLowerCase()]

            // Iterate through subclasses
            for (const subClass of championClass) {
               let classIndex = this.classIndexTable[subClass]
               this.classProfile[classIndex][subClass] += (gameCount / this.totalMatches) * 100 // % based off total games 
            }

            // Calculate class.Total %
            for (const mainClass of this.classProfile) {
               mainClass.Total = Object.values(mainClass).slice(2).reduce((a, b) => a + b)
            }
         }
         
      }
   },

   props: {
      championData: null,
      challengeData: null,
      totalMatches: null
   }
}
</script>

<template>
   <div class="summoner-main">
      <div class="class-distribution">
         <StackedBarplot :data="this.classProfile"/>
      </div>
      <div class="challenges">

      </div>
   </div>
</template>

<style scoped>

</style>