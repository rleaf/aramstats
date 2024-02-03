<script>
import RunesModal from './RunesModal.vue'
import _runes from '@/constants/runes'
import _flex from '@/constants/flex'
import { championStore } from '@/stores/championConfig'

export default {
   components: {
      RunesModal
   },
   data() {
      return {
         config: championStore(),
         runes: _runes,
         flex: _flex
      }
   },
   
   created() {
      
   },
   
   methods: {
      runeImage(id) {
         return new URL(`../../../assets/runes/${id}.png`, import.meta.url).href
      },
      flexRuneImage(id) {
         return new URL(`../../../assets/runes/flex/${id}.png`, import.meta.url).href
      },
      primaryRuneWinrate(id) {
         if (this.champion.runes.primary[id]) {
            return (this.champion.runes.primary[id].wins / this.champion.runes.primary[id].games * 100).toFixed(1) + '%'
         } else {
            return 0
         }
      },

      primaryRuneGames(id) {
         return (this.champion.runes.primary[id]) ? this.champion.runes.primary[id].games : 0
      },

      secondaryRuneWinrate(id) {
         if (this.champion.runes.secondary[id]) {
            return (this.champion.runes.secondary[id].wins / this.champion.runes.secondary[id].games * 100).toFixed(1) + '%'
         } else {
            return 0
         }
      },

      secondaryRuneGames(id) {
         return (this.champion.runes.secondary[id]) ? this.champion.runes.secondary[id].games : 0
      },

      flexRuneWinrate(id, i) {
         const table = ['offense', 'flex', 'defense']
         if (this.champion.runes.tertiary[table[i]][id]) {
            return (this.champion.runes.tertiary[table[i]][id].wins / this.champion.runes.tertiary[table[i]][id].games * 100).toFixed(1) + '%'
         } else {
            return 0
         }
      },

      flexRuneGames(id, i) {
         const table = ['offense', 'flex', 'defense']
         return (this.champion.runes.tertiary[table[i]][id]) ? this.champion.runes.tertiary[table[i]][id].games : 0
      },

      heatmap(id, i, tree, flex) {
         if (!this.config.runes.heatmap) return

         const tertiaryTable = ['offense', 'flex', 'defense']
         const colorTable = {
            '8000': '231, 216, 145',
            '8100': '231, 145, 145',
            '8200': '145, 147, 231',
            '8300': '145, 189, 231',
            '8400': '145, 231, 149',
            'flex': '192, 192, 192',
         }
         const rune = (typeof flex === 'number') ? this.champion.runes[i][tertiaryTable[flex]][id] : this.champion.runes[i][id]
         let colorValue = colorTable[tree]

         

         if (this.config.runes.heatmap === 1) {
            // Popularity
            if (!rune) return '0'
            const runeGames = rune.games
            return `rgba(${colorValue}, ${runeGames / this.champion.games / 4})`
         }

         if (this.config.runes.heatmap === 2) {
            // Winrate
            if (!rune) return '0'
            const games = rune.games
            const wins = rune.wins
            const val = (wins / games)
            return `rgba(${colorValue}, ${val / 4})`
         }
      }
   },

   computed: {
      clarity() {
         if (this.config.runes.heatmap && this.config.runes.clarity) return true
      }
   },

   props: {
      champion: null,
      patch: null
   }
}
</script>

<template>
   <div class="runes-main">
      <RunesModal v-show="this.config.modals.runes" />
      <div class="section-header">
         Runes
         <img @click="this.config.modals.runes = true" class="settings" src="@/assets/ellipses.svg" alt="">
      </div>
      <div class="section">
         <div class="main-runes" :class="{ 'active-heatmap': clarity }">

            <div class="tree" v-for="[tree, i] of Object.entries(this.runes)" :key="tree">
               <div class="rune-wrapper">
                  <!-- <img class="tree-image" :src="this.runeImage(tree)" alt=""> -->
                  <div class="winrate"></div>
                  <div class="games"></div>
               </div>
               <div class="primary">
                  <div :class="{'keystone' : j2 === 0}" class="row" v-for="(j, j2) in i" :key="j2">
                     <div :style="{ 'background': this.heatmap(k, 'primary', tree) }" class="rune-wrapper" v-for="k in j" :key="k">
                        <img :class="{ 'inactive': !this.champion.runes.primary[k] || this.champion.runes.primary[k].games === 0 }" :src="this.runeImage(k)" alt="">
                        <div class="winrate">{{ this.primaryRuneWinrate(k) }}</div>
                        <div class="games">{{ this.primaryRuneGames(k) }}</div>
                     </div>
                  </div>
               </div>
               <div class="secondary">
                  <div class="row" v-for="(j, j2) in i.slice(1)" :key="j2">
                     <div :style="{'background' : this.heatmap(k, 'secondary', tree) }" class="rune-wrapper" v-for="k in j" :key="k">
                        <img :class="{ 'inactive': !this.champion.runes.secondary[k] || this.champion.runes.secondary[k].games === 0 }" :src="this.runeImage(k)" alt="">
                        <div class="winrate">{{ this.secondaryRuneWinrate(k) }}</div>
                        <div class="games">{{ this.secondaryRuneGames(k) }}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="flex" :class="{ 'active-heatmap': clarity }">
            <div class="row" v-for="(i, i2) in this.flex" :key="i2">
               <div :style="{ 'background': this.heatmap(j, 'tertiary', 'flex', i2) }" class="rune-wrapper" v-for="(j, j2) in i" :key="j2">
                  <img :src="this.flexRuneImage(j)" alt="">
                  <div class="winrate">{{ this.flexRuneWinrate(j, i2) }}</div>
                  <div class="games">{{ this.flexRuneGames(j, i2) }}</div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
@import url(./styles.css);

.section {
   color: var(--color-font);
}

.main-runes {
   display: flex;
   padding-top: 10px;
   justify-content: space-around;
   padding-bottom: 50px;
}

.flex {
   display: flex;
   flex-direction: column;
   align-items: center;
}

.flex img {
   background: var(--alpha-01);
   border-radius: 100%;
}

.tree, .primary, .secondary {
   display: flex;
   flex-direction: column;
   align-items: center;
}

.primary {
   padding-bottom: 30px;
}


img.tree-image {
   margin-bottom: 18px;
}
.main-runes img {
   width: 33px;
}

.active-heatmap {
   filter: saturate(0.1);
}

.rune-wrapper {
   display: inline-block;
   text-align: center;
   margin: 1px;
   padding: 2px 1px;
   width: 45px;
   border-radius: 3px;
   transition: 0.25s ease-in-out;
}

.inactive {
   filter: saturate(0);
}

.winrate {
   color: var(--color-font);
   font-size: 0.8rem;
}

.games {
   color: var(--color-font-faded);
   font-size: 0.75rem;
}

.keystone img {
   width: 45px;
}
</style>