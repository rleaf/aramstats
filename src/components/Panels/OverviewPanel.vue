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
         totalKP: 0,
         totalKDA: [0, 0, 0], // [kills, deaths, assists]
         totalMultikills: [0, 0, 0], // [trip, quad, pen]
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
      this.iterate()
      this.classProfiler()
   },

   methods: {
      iterate() {
         for (const champ of this.data) {
            this.totalMatches += champ.totalGames
            this.totalWins += champ.wins

            this.totalKDA[0] += champ.averageKills
            this.totalKDA[1] += champ.averageDeaths
            this.totalKDA[2] += champ.averageAssists

            this.totalKP += champ.averageKillParticipation

            this.totalMultikills[0] += champ.totalTripleKills
            this.totalMultikills[1] += champ.totalQuadraKills
            this.totalMultikills[2] += champ.totalPentaKills
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
      },

      kdr() {
         return `${Math.round(((this.totalKDA[0] + this.totalKDA[2]) / this.totalKDA[1]) * 100) / 100}`
      },

      kp() {
         return `${Math.round(this.totalKP / this.data.length)}`
      },
   }
}
</script>

<template>
   <div class="overview-main">
      <div class="tile-grid">
         
         <div class="tile i1">
            <p>Winrate</p>
            <div class="wr-percent">
               {{ Math.round((this.totalWins / this.totalMatches) * 1000) / 10 }}%
            </div>
         </div>
         <div class="tile i2">
            <p>Win / Loss</p>
            <div class="wr-percent">
               {{ this.totalWins }} / {{ this.totalMatches }}
            </div>
         </div>
         <div class="tile i3">
            <p>Kill Participation</p>
            <div class="wr-percent">
               {{ kp }}%
            </div>
         </div>
         <div class="tile i4">
            <p>KDA Ratio</p>
            <div class="wr-percent">
               {{ kdr }}
            </div>
         </div>
         <div class="tile footer">
            <div>
               <p>Triples</p>
               <div class="wr-percent">
                  {{ this.totalMultikills[0] }}
               </div>
            </div>
            <div>
               <p>Quads</p>
               <div class="wr-percent">
                  {{ this.totalMultikills[1] }}
               </div>
            </div>
            <div>
               <p>Pentas</p>
               <div class="wr-percent">
                  {{ this.totalMultikills[2] }}
               </div>
            </div>
         </div>
         
      </div>
      <StackedBarplot :data="this.classProfile"/>

   </div>
</template>

<style scoped>
   .tile p {
      margin: 0;
   }
   h3 {
      margin: 0;
   }
   .tile {
      background: var(--champion-search-bar);
      padding: 10px;
      margin: 10px;
      border-radius: 10px;;
   }
   .wr-frac {
      color: var(--color-font-fade);
      padding-left: 10px;
      font-size: 0.9rem;
   }

   .wr-percent {
      font-weight: bold;
      font-size: 20px;
      /* color: var(--header-stats); */
   }
   .i1 {
      grid-area: i1;
   }
   .i2 {
      grid-area: i2;
   }
   .i3 {
      grid-area: i3;
   }
   .i4 {
      grid-area: i4;
   }

   .footer {
      grid-area: footer;
      display: flex;
      justify-content: space-around;
   }

   .tile-grid {
      display: grid;
      grid-template-areas: 
      'i1 i2'
      'i3 i4'
      'footer footer';
      /* align-items: center; */
      height: 310px;
      border-radius: 10px;
      background: var(--profile-panel);
      color: var(--color-font);
   }

   .overview-main {
      display: flex;
      height: 310px;
      flex-direction: row;
      border-radius: 5px;
   }
</style>