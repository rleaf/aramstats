<script>
import Champion from '../Champion.vue'
import championNameBook from '../../constants/championNames'
import champions from '../../constants/champions'

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
         ],
         championLazyLoad: new Array(this.championData.length).fill(0),
         observer: null
      }
   },

   mounted() {
      this.lazyLoadImages() 
   },

   updated() {
      this.lazyLoadImages()
   },

   methods: {
      lazyLoad(idx) {
         return (this.championLazyLoad[idx] === 1) ?
            true : false
      },

      lazyLoadImages() {
         this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
               if (entry.isIntersecting) {
                  this.championLazyLoad[entry.target.componentIndex] = 1
                  this.observer.unobserve(entry.target)
               }
            })
         })

         const children = Array.from(this.$refs.champion.children)

         for (const [i, child] of children.entries()) {
            child.componentIndex = i
            this.observer.observe(child)
         }
      }
   },

   computed: {
      sortedChamps() {
         const table = {
            'Champion': 'name',
            'Total Games': 'games',
            'Wins': 'wins',
            'Damage': 'averages.totalDamageDealt',
            'DPM': 'averages.damagePerMinute',
            'Healing': 'averages.totalHeal',
            'HPM': 'averages.healingPerMinute',
            'Ally Healing': 'averages.healingOnTeammates',
            'Ally HPM': 'averages.allyHealPerMinute',
            'Damage Taken': 'averages.totalDamageTaken',
            'DTPM': 'averages.damageTakenPerMinute',
            'Damage Mitigated': 'averages.totalSelfMitigated',
            'DMPM': 'averages.selfMitigatedPerMinute',
            'Gold': 'averages.goldEarned',
            'GPM': 'averages.goldPerMinute',
            'Kill Participation': 'averages.killParticipation',
            'Damage Share': 'averages.damageShare',
            'Triple kills': 'multikills.triple',
            'Quadra kills': 'multikills.quadra',
            'Penta kills': 'multikills.penta',
         }
         const filtered = this.championData.filter(champion => {
            return (champion.name in champions.table) ?
               champions.table[champion.name].toLowerCase().includes(this.search.toLowerCase()) :
               champion.name.toLowerCase().includes(this.search.toLowerCase())
         })

         if (this.sortBy === 'Champion') {
            return (this.order) ?
               filtered.sort((a, b) => a.name.localeCompare(b.name)) :
               filtered.sort((a, b) => b.name.localeCompare(a.name))
         }

         const access = (path, object) => {
            return path.split('.').reduce((o, i) => o[i], object)
         }

         // console.log('toads', this.$refs)
         // setTimeout(() => {
         //    console.log('toads', this.$refs)
            
         // }, 1000);
         // this.lazyLoadImages()

         return (this.order) ?
            filtered.sort((a, b) => access(table[this.sortBy], b) - access(table[this.sortBy], a)) :
            filtered.sort((a, b) => access(table[this.sortBy], a) - access(table[this.sortBy], b))
      }
   },

   props: {
      championData: Object,
      currentPatch: '',
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
      <div class="champion-container" ref="champion">
         <Champion v-for="(champ, i) in sortedChamps"
            :lazy="lazyLoad(i)"
            :key="champ.name"
            :champion="champ"
            :currentPatch="this.currentPatch"/>
      </div>

   </div>
</template>

<style scoped>

.header {
   display: flex;
   width: 100%;
   align-items: center;
   margin-top: 20px; 
   margin-bottom: 10px; 
}

.sort {
   font-size: 0.9rem;
}

.sort-button {
   font-size: 0.95rem;
   background: transparent;
   padding: 0.5rem 0.75rem;
   border-radius: 10px;
   border: none;
   margin-left: 10px;
   color: var(--color-font);
   background: var(--cold-blue);
   transition: 0.2s;
}
.sort-button:hover {
   cursor: pointer;
   background: var(--cold-blue-focus);
   color: var(--color-font-focus)
}

.sort-button:focus {
   background: var(--cold-blue-focus);
   color: var(--color-font-focus);
}

.order-button {
   background: none;
   border: none;
   color: var(--color-font);
   cursor: pointer;
   padding: 0.5rem 1rem;
   border-radius: 10px;
   margin-left: 1rem;
   background: var(--cold-blue);
   transition: 0.2s;
}

button.order-button:hover {
   background: var(--cold-blue-focus);
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
   background-color: rgba(var(--cold-blue), 0.2);
   border-radius: 12px;
   box-shadow: 1px 1px 5px var(--alpha-14);
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
   font-size: 0.85rem;
   padding: 0.2rem 0;
   transition: 0.25s;
   color: var(--color-font);
   cursor: pointer;
}

.sort-value:hover {
   color: var(--color-font-focus);
}

.search {
   margin-left: auto;
}

.search input {
   background: var(--cold-blue);
   border: 1px solid var(--light-12);
   color: var(--color-font);
   padding: 0.5rem 0.75rem;
   border-radius: 15px;
   font-size: 0.95rem;
   font-style: italic;
   transition: 0.2s;
}

.search input:focus {
   border: 1px solid var(--light-05);
   background: var(--cold-blue-focus);
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
   background: var(--alpha-06);
   border-radius: 3px;
}

.champion-container::-webkit-scrollbar-thumb {
   background-color: var(--alpha-06);
   border-radius: 3px;
}
.champion-container::-webkit-scrollbar-thumb:hover {
   background-color: var(--light-12);
}

.search input:focus {
   outline: none;
}
</style>