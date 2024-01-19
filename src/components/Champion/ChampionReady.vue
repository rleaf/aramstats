<script>
import axios from 'axios'
import champions from '../../constants/champions'

import Tldr from './components/Tldr.vue'
import Items from './components/Items.vue'
import Runes from './components/Runes.vue'
import StartingSpells from './components/StartingSpells.vue'

export default {
   components: {
      Tldr,
      Items,
      Runes,
      StartingSpells
   },
   data() {
      return {
         title: '',
         abilities: [],
         name: champions.humanName[this.champion._id],
         backName: champions.imageName[this.champion._id]
      }

   },

   created() {
      console.log(this.champion)
      this.getChampData()
   },

   methods: {
      getChampData() {
         const url = `https://ddragon.leagueoflegends.com/cdn/${this.patch}/data/en_US/champion/${this.backName}.json`
         axios.get(url).then(res => {
            const tomato = res.data.data[this.backName]
            this.title = tomato.title

            this.abilities.push(tomato.passive.image.full)
            for (const spell of tomato.spells) {
               this.abilities.push(spell.image.full)
            }
         })
      },

      getAbilityImages(name, idx) {
         return (idx === 0) ? `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/passive/${name}` :
            `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/spell/${name}`
      },

      abilityLetter(idx) {
         switch (idx) {
            case 0:
               return 'P'
            case 1:
               return 'Q'
            case 2:
               return 'W'
            case 3:
               return 'E'
            case 4:
               return 'R'
         }
      },
   },

   computed: {
      champIcon() {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/${this.backName}.png`
      },

      background() {
         const img = new URL(`../../assets/champion_splash/${this.backName.toLowerCase()}.webp`, import.meta.url).href
         return `radial-gradient(ellipse at top, rgba(var(--color-background-rgb), 0.8), rgba(var(--color-background-rgb), 1) 73%), no-repeat -10% 25%/100% url('${img}')`
         // return `linear-gradient(to right, rgba(var(--cell-panel-rgb), 1.0), rgba(var(--cell-panel-rgb), 0.9) 10%, rgba(var(--cell-panel-rgb), .8) 60%, rgba(var(--cell-panel-rgb), .7) 90%), no-repeat -20% 15%/100% url('${img}')`
      },

      championWinrate() {
         return `${Math.round((this.champion.wins / this.champion.games) * 1000) / 10}%`
      },
   },
   
   props: {
      champion: null,
      patch: null
   }
}
</script>

<template>
   <div class="champion-ready-main">
      <div class="gradient-bg" :style="{ background: background }"></div>
      <div class="header">
         <div class="header-lhs">
            <div class="header-lhs-image">
               <img :src="champIcon" alt="">
            </div>
            <div class="header-lhs-one">
               <div class="name">{{ this.name }}</div>
               <div class="title">{{ this.title }}</div>
               <div class="champion-abilities">
                  <div v-for="(img, i) in this.abilities" :key="i">
                     <img :src="getAbilityImages(img, i)" rel="preload">
                     <div class="spell-letter">
                        {{ abilityLetter(i) }}
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="header-rhs">
            <div>
               <h2>Rank</h2>
               {{ this.champion.rank }}
            </div>
            <div>
               <h2>Pickrate</h2>
               {{ this.champion.pickRate }}%
            </div>
            <div>
               <h2>Winrate</h2>
               {{ championWinrate }}
               <h2>{{ this.champion.games }} games</h2>
            </div>
         </div>
      </div>

      <div class="champion-body">
          <Tldr :champion="this.champion" :patch="this.patch" />
          <Items :champion="this.champion" />
          <Runes :champion="this.champion" />
          <StartingSpells :champion="this.champion" />
      </div>
   </div>
</template>

<style scoped>
.gradient-bg {
   position: absolute;
   z-index: -5;
   margin-top: 5vh;
   width: inherit;
   height: 400px;
}
.champion-ready-main {
   display: flex;
   flex-direction: column;
   margin: 0 auto;
   width: 1100px;
}

.header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   color: var(--color-font);
   margin-top: 5vh;
   padding-top: 5vh;
   padding-bottom: 100px;
   border-top: 1px solid var(--cell-border);
   background: radial-gradient(ellipse at top, var(--cell-panel), var(--cell-panel-rgb) 25%);
}

.header-rhs {
   display: flex;
   gap: 80px;
}

.header-rhs h2 {
   margin: 0;
   color: var(--color-font-faded);
   font-size: 0.9rem;
   font-weight: normal;
}

.header-rhs div {
   color: var(--color-font);
   font-size: 1.5rem;
   font-weight: bold;
}

.header-lhs {
   display: flex;
}

.header-lhs-one {
   padding-left: 1.5rem;
}

.name {
   display: inline-block;
   font-size: 2.8rem;
   margin: 0;
   font-family: var(--header-font);
}

.title {
   display: inline-block;
   margin: 0;
   padding-left: 0.7rem;
   /* font-style: italic; */
   color: var(--color-font-faded);
}

.champion-abilities {
   padding-top: 5px;
   height: 38px;
}
.champion-abilities img {
   width: 36px;
   border: 1px solid var(--cell-border);
}

.champion-abilities > div {
   display: inline-block;
}

.champion-abilities div:not(:first-child) {
   margin-left: 10px;
}

.spell-letter {
   position: relative;
   top: -21px;
   left: -9px;
   font-size: 0.85rem;
   background: var(--color-background);
   font-weight: normal;
   text-align: center;
   width: 0.9rem;
}

.header-lhs-image {
   width: 100px;
   height: 100px;   
   overflow: hidden;
   border: 1px solid var(--cell-border);
}

.header-lhs-image img {
   width: 100%;
   /* object-fit: cover; */
   transform: scale(1.2);
}
</style>