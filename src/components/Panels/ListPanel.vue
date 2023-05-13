<script>
import Champion from '../Champion.vue'

export default {
   components: {
      Champion
   },

   data() {
      return {
         sortBy: 'Total Games',
         sortFocus: false,
         order: true,
         search: '',
         sortTable: [
            { Main: ['Total Games', 'Champion', 'Wins'] },
            { Damage: ['Damage', 'DPM', 'Damage Share'] },
            { Heal: ['Healing', 'HPM', 'Ally Healing', 'Ally HPM'] },
            { Tank: ['Damage Taken', 'DTPM', 'Damage Mitigated', 'DMPM'] },
            { Multikill: ['Triple Kills', 'Quadra kills', 'Penta kills'] },
            { Misc: ['Kill Participation', 'Gold', 'GPM'] },
         ]
      }
   },

   computed: {
      sortedChamps() {
         const table = {
            'Champion': 'championName',
            'Total Games': 'totalGames',
            'Wins': 'wins',
            'Damage': 'averageTotalDamageDealt',
            'DPM': 'averageDamagePerMinute',
            'Healing': 'averageTotalHeal',
            'HPM': 'averageHealPerMinute',
            'Ally Healing': 'averageHealingOnTeammates',
            'Ally HPM': 'averageAllyHealPerMinute',
            'Damage Taken': 'averageTotalDamageTaken',
            'DTPM': 'averageDamageTakenPerMinute',
            'Damage Mitigated': 'averageTotalSelfMitigated',
            'DMPM': 'averageSelfMitigatedPerMinute',
            'Gold': 'averageGoldEarned',
            'GPM': 'averageGoldPerMinute',
            'Kill Participation': 'averageKillParticipation',
            'Damage Share': 'averageDamageShare',
            'Triple kills': 'totalTripleKills',
            'Quadra kills': 'totalQuadraKills',
            'Penta kills': 'totalPentaKills',
         }

         const filtered = this.info.filter(x => x.championName.toLowerCase().includes(this.search.toLowerCase()))

         if (this.sortBy === 'Champion') {
            return (this.order) ?
               filtered.sort((a, b) => a.championName.localeCompare(b.championName)) :
               filtered.sort((a, b) => b.championName.localeCompare(a.championName))
         }

         const value = table[this.sortBy]

         return (this.order) ?
            filtered.sort((a, b) => b[value] - a[value]) :
            filtered.sort((a, b) => a[value] - b[value])
      },
   },

   props: {
      info: Object
   }
   
}
</script>

<template>
   <div class="champions-list-main">
      <div class="header">
         
         <div class="sort">
            Sort by:
            <button class="sort-button" @click="this.sortFocus = true" @blur="this.sortFocus = false">
               {{ this.sortBy }}
            </button>
            
            <div class="sort-dropdown" v-show="this.sortFocus">
               <div v-for="(i, index) in this.sortTable" :key="index">
                  <div class="sort-key">
                     {{ Object.keys(i).toString() }}
                  </div>
                  <div class="sort-value" v-for="value in Object.values(i)[0]" :key="value" @mousedown="this.sortBy = value">
                     {{ value }}
                  </div>
               </div>
            </div>
         </div>

         <button class="order-button" @click="this.order =! this.order">
            <img src="../../assets/arrow2.svg" alt="" :class="{ up: !this.order}">
         </button>

         <div class="search">
            <input type="text" placeholder="Search Champion" v-model="this.search">
         </div>
      </div>
      <div class="champion-container">
         <Champion v-for="(champ, i) in sortedChamps" 
         :key="champ.championName"
         :champion="champ"
         />
      </div>

   </div>
</template>

<style scoped>

.header {
   display: flex;
   width: 100%;
   height: 50px;
   align-items: center;
   margin: 10px 0; 
}

.sort {
   font-size: 1.2rem;
   font-weight: bold;
}

.sort-button {
   margin-left: 5px;
   background: transparent;
   padding: 0.5rem 1rem;
   border-radius: 15px;
   border: none;
   font-size: 1rem;
   color: var(--color-font);
}
.sort-button:hover {
   cursor: pointer;
   background: var(--hoverButton);
}

.sort-button:focus {
   background: var(--hoverButton);
}

.order-button {
   background: none;
   border: none;
   color: var(--color-font);
   cursor: pointer;
   padding: 0.5rem 1rem;
   border-radius: 15px;
   margin-left: 1rem;
}

button.order-button:hover {
   background: var(--hoverButton);
}

.order-button img {
   width: 15px;
}

.up {
   transform: rotate(180deg);
}

.sort-dropdown {
   position: absolute;
   display: flex;
   justify-content: space-between;
   border-radius: 15px;
   padding: 1rem 1.5rem;
   backdrop-filter: blur(13px) saturate(120%);
   -webkit-backdrop-filter: blur(13px) saturate(120%);
   background-color: rgba(38, 41, 51, 0.2);
   border-radius: 12px;
   box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.65);
   width: 650px;
   font-size: 1rem;
   margin-top: 5px;
   z-index: 5;
}

.sort-key {
   margin-bottom: 0.75rem;
   font-size: 1rem;
}

.sort-value {
   font-weight: normal;
   font-size: 0.9rem;
   padding: 0.1rem 0;
   transition: 0.25s;
   color: var(--light300);
   cursor: pointer;
}

.sort-value:hover {
   color: white;
}

.search {
   margin-left: auto;
}

.search input {
   background: none;
   border: 1px solid var(--tint100);
   color: var(--color-font);
   padding: 0.5rem 1rem;
   border-radius: 15px;
   font-size: 1rem;
   font-style: italic;
}

.champion-container {
   overflow-y: scroll;
   width: 780px;
   height: 80vh; 
   padding-right: 5px;
   margin-bottom: 5vh;

}

.champion-container::-webkit-scrollbar {
   width: 12px;
   background: var(--hoverButton);
   border-radius: 3px;
}

.champion-container::-webkit-scrollbar-thumb {
   background-color: var(--hoverButton);
   border-radius: 3px;
}

.search input:focus {
   outline: none;
}
</style>