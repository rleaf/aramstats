<script>
import TldrModal from './modals/TldrModal.vue'
import UXTooltip from '@/components/UXTooltip.vue'
import { championStore } from '@/stores/championStore'
import { superStore } from '@/stores/superStore'
import _runes from '@/constants/runes'
import _flex from '@/constants/flex'

export default {
   components: {
      TldrModal,
      UXTooltip,
   },
   data() {
      return {
         organizedCore: [],
         coreFocus: 0,
         store: superStore(),
         config: championStore(),
         runes: _runes,
         flex: _flex,
         maxWinrate: 0,
         minWinrate: 2
      }
   },

   created() {
      this.sortCore()
      // console.log('organs', this.organizedCore)
   },

   methods: {
      sortCore() {
         for (const c in this.champion.core) {
            this.champion.core[c].core = c
            this.champion.core[c].winrate = this.champion.core[c].wins / this.champion.core[c].games
            if (this.champion.core[c].winrate > this.maxWinrate) this.maxWinrate = this.champion.core[c].winrate
            if (this.champion.core[c].winrate < this.minWinrate) this.minWinrate = this.champion.core[c].winrate
            this.organizedCore.push(this.champion.core[c])
         }

         this.organizedCore.sort((a, b) => b.games - a.games) 
      },

      setCoreFocus(i) {
         this.coreFocus = i
      },

      lerpColors(wr) {
         const val = (wr - this.minWinrate) / (this.maxWinrate - this.minWinrate)
         const green = [79, 201, 79]
         const red = [201, 40, 0]

         const lerp = green.map((p, i) => p * val + red[i] * (1 - val))
         return `rgba(${lerp[0]},${lerp[1]},${lerp[2]})`
      },

      coreItemImage(id) {
         // For custom images not on ddragon cdn
         return (id === '10010') ? new URL(`../../../assets/images/boots.png`, import.meta.url).href :
            `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${id}.png`
      },

      itemImage(id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${id}.png`
      },

      spellImage(id) {
         return new URL(`../../../assets/spells/${id}.webp`, import.meta.url).href
      },

      runeImage(id) {
         return new URL(`../../../assets/runes/${id}.png`, import.meta.url).href
      },

      flexRuneImage(id) {
         return new URL(`../../../assets/runes/flex/${id}.png`, import.meta.url).href
      },

      activeLevel(i, j) {
         const x = this.levels[0][i-1]
         console.log(this.levels[0])
         if (x == j) return true
      },

      activeSkill(i, j) {
         const map = {
            1: 'Q',
            2: 'W',
            3: 'E',
            4: 'R'
         }

         if (this.levels[0][i-1] == j) return map[j]
      },

      itemSort(obj) {
         let arr = []
         for (const i in obj) {
            arr.push([i, obj[i].games, obj[i].wins])
         }
         
         if (this.config.winrateSort) {
            arr.sort((a, b) => (a[1] / a[2]) - (b[1] / b[2]))
            arr = arr.filter(v => (v[1] / this.organizedCore[this.coreFocus].games) > this.config.winrateThreshold)
         } else {
            arr.sort((a, b) => b[1] - a[1])  
         }

         return arr
      },
      
      masterSort(obj) {
         /* 
            Take any obj with games & wins value for Tldr section and return desired datum based off winrate configuration.
         */

         let peaches = [0, 0, 0] // [datum, games, wins]
         let roll = 0
         if (this.config.winrateSort) {
            for (const j in obj) {
               if (!obj[j] || (obj[j].games / this.organizedCore[this.coreFocus].games) < this.config.winrateThreshold) continue
               const potato = (obj[j].wins / obj[j].games)
               if (potato >= roll ) {
                  roll = potato
                  peaches = [j, obj[j].games, obj[j].wins]
               }
            }
         } else {
            for (const j in obj) {
               if (!obj[j]) continue
               if (obj[j].games >= roll) {
                  roll = obj[j].games
                  peaches = [j, obj[j].games, obj[j].wins]
               }
            }
         }
         return peaches 
      },

      filteredWinrate(wr) {
         return (wr * 100).toFixed(1) + '%'
         // return (win / total * 100).toFixed(1) + '%'
      },
      itemBackground(i) {
         if (i % 2 === 0) {
            return 'var(--alpha-01)'
         }
      }, 

   },

   computed: {

      activePrimaryRunes() {
         let primary = []
         for (const c in this.runes[this.primaryRunes[0]]) {
            const pre = this.runes[this.primaryRunes[0]][c].reduce((a, b) => ({ ...a, [b]: this.organizedCore[this.coreFocus].runes.primary[b] }), {})
            primary.push(this.masterSort(pre)[0])
         }
         return primary
      },
      
      activeSecondaryRunes() {
         let filter
         let baguette = []
         const secondaries = this.runes[this.secondaryRunes[0]].slice(1)

         for (const c in secondaries) {
            const pre = secondaries[c].reduce((a, b) => ({ ...a, [b]: this.organizedCore[this.coreFocus].runes.secondary[b] }), {})
            baguette.push(this.masterSort(pre))
         }
         
         (this.config.winrateSort) ? filter = baguette.map(x => (x[2] / x[1]) || 0) : filter = baguette.map(x => x[1])
         
         const j = filter.indexOf(Math.min(...filter))
         baguette.splice(j, 1)

         return baguette.map(x => parseInt(x[0]))
      },

      activeFlexRunes() {
         const flex = []

         flex.push(this.masterSort(this.organizedCore[this.coreFocus].runes.tertiary.offense)[0])
         flex.push(this.masterSort(this.organizedCore[this.coreFocus].runes.tertiary.flex)[0])
         flex.push(this.masterSort(this.organizedCore[this.coreFocus].runes.tertiary.defense)[0])

         return flex
      },

      startingItems() {
         return this.masterSort(this.organizedCore[this.coreFocus].starting)
      },

      startingSpells() {
         return this.masterSort(this.organizedCore[this.coreFocus].spells)
      },

      primaryRunes() {
         return this.masterSort(this.organizedCore[this.coreFocus].runes.tree.primary)
      },

      secondaryRunes() {
         const x = Object.assign({}, this.organizedCore[this.coreFocus].runes.tree.secondary)
         delete x[this.primaryRunes[0]]
         return this.masterSort(x)
      },

      levels() {
         if (this.config.winrateSort) {
            let potato
            let roll = 0
            for (const i in this.organizedCore[this.coreFocus].levels) {
               if ((this.organizedCore[this.coreFocus].levels[i][1] / this.organizedCore[this.coreFocus].games) < this.config.winrateThreshold) break
               if ((this.organizedCore[this.coreFocus].levels[i][2] / this.organizedCore[this.coreFocus].levels[i][1]) > roll) {
                  potato = this.organizedCore[this.coreFocus].levels[i]
                  roll = (this.organizedCore[this.coreFocus].levels[i][2] / this.organizedCore[this.coreFocus].levels[i][1])
               }
            }

            return potato
         } else {
            return this.organizedCore[this.coreFocus].levels[0]
         }
      },
   },

   props: {
      champion: null,
      patch: null
   }
}
</script>

<template>
   <div class="tldr-main">
      <div class="section-header">
         <h1>Overview</h1>
         <TldrModal />
      </div>
      <div class="section">
         <div class="core-selection">
            <div class="combination-tooltip">
               <p>Select a <b>combination</b></p>
               <UXTooltip :tip="'core'"/>
            </div>
            <div class="combinations">
               <div class="core" :class="{'core-focus' : this.coreFocus === i}" @click="this.setCoreFocus(i)" v-for="(c, i) in this.organizedCore" :key="i">
                  <div class="core-numbers">
                     <div :style="{ 'color': this.lerpColors(c.winrate) }" class="winrate">{{ this.filteredWinrate(c.winrate) }}</div>
                     <div class="total">{{ c.games }}</div>
                  </div>
                  <div class="core-img">
                     <img :src="this.coreItemImage(i)" alt="" v-for="(i, j) in c.core.split('_') " :key="j">
                  </div>
               </div>
            </div>
         </div>
         <div>
            <div class="items">
               <div class="sub-section-header">
                  <div class="sub-lhs">
                     <a @click="$emit('scroll', 'items')" class="title">Items</a>
                  </div>
                  <UXTooltip :tip="'items'" />
               </div>
               <div class="items-wrapper">
   
                  <div class="items-column" :class="{ 'column-bg': (i+1) % 2 === 0 }" v-for="i in 6" :key="i">
                     <span>{{ i }}</span> <!-- KEEP? -->
                     <div v-for="(i, k) in this.itemSort(this.organizedCore[this.coreFocus].items[i]).slice(0, 2)" :key="k">
                        <img
                           @mouseenter="this.store.setTooltipData({ event: $event, key: i[0], mode: 'items' })"
                           @mouseleave="this.store.tooltip.active = false"
                           :src="this.itemImage(i[0])"
                           alt="">
                        <div class="winrate">{{ this.filteredWinrate(i[2] / i[1]) }}</div>
                        <div class="total">{{ i[1] }}</div>
                     </div>
                  </div>
               </div>
   
            </div>
            <div class="starting-spells">
               <div class="starting">
                  <div class="sub-section-header">
                     <a @click="$emit('scroll', 'spells')" class="title">Starting</a>
                     <div class="sub-rhs">
                        <div class="misc">
                           <h3>{{ this.filteredWinrate(startingItems[2] / startingItems[1]) }}</h3>
                           <h3>{{ startingItems[1] }}</h3>
                        </div>
                        <UXTooltip :tip="'starting'" />
                     </div>
                  </div>
                  <img
                     v-if="(typeof startingItems[0] === 'string')"
                     v-for="(i, j) in startingItems[0].split('_')"
                     :src="this.itemImage(i)"
                     @mouseenter="this.store.setTooltipData({ event: $event, key: i, mode: 'items' })"
                     @mouseleave="this.store.tooltip.active = false"
                     class="starting-image" alt="" :key="j">
                  <p class="no-data" v-else> Not enough data :(</p>
               </div>
               <div class="spells">
                  <div class="sub-section-header">
                     <a @click="$emit('scroll', 'spells')" class="title">Spells</a>
                     <div class="sub-rhs">
                        <div class="misc">
                           <h3>{{ this.filteredWinrate(startingSpells[2] / startingSpells[1]) }}</h3>
                           <h3>{{ startingSpells[1] }}</h3>
                        </div>
                        <UXTooltip :tip="'spells'"/>
                     </div>
                  </div>
                  <img class="starting-image"
                     v-for="(id, i) in startingSpells[0].split('_')"
                     @mouseenter="this.store.setTooltipData({event: $event, key: id, mode: 'spells'})"
                     @mouseleave="this.store.tooltip.active = false"
                     :src="this.spellImage(id)" alt=""
                     :key="i">
               </div>
            </div>
         </div>
         <div class="runes-leveling">
            <div class="runes">
               <div class="sub-section-header">
                  <a @click="$emit('scroll', 'runes')" class="title">Runes</a>
                  <div class="sub-rhs">
                     <div class="misc">
                        <div>
                           <img :src="this.runeImage(primaryRunes[0])"/>
                           <h3>{{ this.filteredWinrate(primaryRunes[2] / primaryRunes[1]) }}</h3>
                           <h3>{{ primaryRunes[1] }}</h3>
                        </div>
                        <div>
                           <img :src="this.runeImage(secondaryRunes[0])"/>
                           <h3>{{ this.filteredWinrate(secondaryRunes[2] / secondaryRunes[1]) }}</h3>
                           <h3>{{ secondaryRunes[1] }}</h3>
                        </div>
                     </div>
                     <UXTooltip :align="'right'" :tip="'runes'" />
                  </div>
               </div>
               <div class="runes-wrapper">
                  <div class="tldr-primary">
                     <div class="rune-row" alt="" v-for="(row, i) in this.runes[primaryRunes[0]]" :key="i">
                        <img :class="{'active-rune': rune == activePrimaryRunes[i] }"
                           v-for="(rune, j) in row"
                           :src="this.runeImage(rune)" alt=""
                           @mouseenter="this.store.setTooltipData({event: $event, key: rune, mode: 'runes', runeTree: primaryRunes[0], runeRow: i})"
                           @mouseleave="this.store.tooltip.active = false"
                           :key="j">
                     </div>
                  </div>
                  <div>
                     <div class="tldr-secondary">
                        <div class="rune-row" v-for="(row, i) in this.runes[secondaryRunes[0]].slice(1)" :key="i">
                           <img :class="{ 'active-rune': activeSecondaryRunes.includes(rune) }"
                              v-for="(rune, j) in row"
                              :src="this.runeImage(rune)" alt=""
                              @mouseenter="this.store.setTooltipData({event: $event, key: rune, mode: 'runes', runeTree: secondaryRunes[0], runeRow: i+1})"
                              @mouseleave="this.store.tooltip.active = false"
                              :key="j">
                        </div>
                     </div>
                     <div class="tldr-flex">
                        <div class="rune-row" v-for="(row, i) in this.flex" :key="i">
                           <img :class="{ 'active-rune': rune == activeFlexRunes[i] }"
                              v-for="(rune, j) in row"
                              @mouseenter="this.store.setTooltipData({event: $event, key: rune, mode: 'runes', runeTree: this.flex, runeRow: i})"
                              @mouseleave="this.store.tooltip.active = false"
                              :src="this.flexRuneImage(rune)" alt="" :key="j">
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="leveling">
               <div class="sub-section-header">
                  <a @click="$emit('scroll', 'spells')" class="title">Level Order</a>
                  <div class="sub-rhs">
                     <div class="misc">
                        <h3>{{ this.filteredWinrate(levels[2] / levels[1]) }}</h3>
                        <h3>{{ levels[1] }}</h3>
                     </div>
                     <UXTooltip :align="'right'" :tip="'levels'" />
                  </div>
               </div>
               <div class="level-wrapper">
                  <div class="level-column" v-for="i in 18" :key="i">
                     <div class="level-row" :class="{'active-level' : levels[0][i-1] == j}" v-for="j in 4" :key="j">
                        {{ this.activeSkill(i, j) }}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
@import url(./styles.css);

.no-data {
   color: var(--color-font-faded);
   font-style: italic;
   font-size: 0.8rem;
}
.section {
   display: flex;
   justify-content: space-between;
   height: 405px;
   color: var(--color-font);
}

.combination-tooltip {
   display: flex;
   justify-content: space-between;
   color: var(--color-font-faded);
   font-size: 0.75rem;
   font-style: italic;
   padding-bottom: 0.6rem;
   padding-right: 25px;
}

.combination-tooltip p {
   margin: 0;
   display: inline-block;
}

.core-selection {
   display: flex;
   flex-direction: column;
   border-right: 1px solid var(--outline);
}

.combinations {
   padding-right: 20px;
   overflow: scroll;
   overflow-x: hidden;
}

.combinations::after {
   position: absolute;
   bottom: 0;
   height: 100%;
   content: '';
   background: tomato;
}

.combinations::-webkit-scrollbar {
   width: 2px;
}

.combinations::-webkit-scrollbar-thumb {
   background: var(--outline);
}

.starting-spells {
   display: flex;
   padding-top: 30px;
   gap: 50px;
   align-items: center;
}

.starting {
   min-width: 180px;
}
.spells {
   min-width: 180px;
   /* margin-top: 80px; */
}

.runes-leveling {
   width: 360px;
}
.runes-wrapper {
   display: flex;
   justify-content: space-evenly;
}

.runes-wrapper img {
   filter: saturate(0);
   opacity: 0.4;
}

img.active-rune {
   opacity: 1;
   filter: saturate(1.3);
}

.tldr-primary, .tldr-secondary, .tldr-flex {
   display: flex;
   flex-direction: column;
   align-items: center;
}

.tldr-primary .rune-row:first-child img {
   width: 40px;
}

.tldr-primary .rune-row img {
   width: 28px;
}

.tldr-primary .rune-row:not(:first-child) img {
   padding: 6px;
}

.tldr-secondary img {
   padding: 1px 2px;
}
.tldr-secondary img {
   width: 24px;
}
.tldr-flex img {
   width: 24px;
   margin: 0 3px;
   background: var(--surface-container);
   border-radius: 100%;
}

.rune-row {
   display: inline-block;
}

.leveling {
   padding-top: 30px;
}

.level-wrapper {
   display: flex;
}

.level-row {
   width: 16px;
   height: 16px;
   margin: 2px 1px;
   border: 1px solid transparent;
   border-radius: 2px;
   background: var(--surface-container);
   text-align: center;
   font-size: 0.7rem;
   line-height: 1.5;
}

.active-level {
   /* border: 1px solid var(--outline-variant); */
   color: var(--on-secondary-container);
   background: var(--secondary-container);
}

img.starting-image {
   width: 32px;
   border: 1px solid var(--outline-variant);

}

 img.starting-image:not(:nth-child(2)) {
   margin-left: 5px;
}
.items-column span {
   font-weight: bold;
   font-size: 1rem;
}

.items {
   color: var(--color-font);
}

.column-bg {
   background: var(--surface-container);
}

.items-wrapper {
   display: flex;
   gap: 10px;
}


.items-column {
   display: flex;
   flex-direction: column;
   gap: 20px;
   align-items: center;
   padding: 20px 20px;
   width: 35px;
   border-radius: 5px;
}

.items-column img {
   display: block;
   margin: 0 auto;
   margin-bottom: 3px;
   width: 32px;
   border: 1px solid var(--outline-variant);
}

.core {
   display: flex;
   padding: 8px 10px;
   margin: 5px 0;
   gap: 10px;
   justify-content: space-between;
   color: var(--color-font);
   align-items: center;
   transition: 0.2s;
   border: 1px solid transparent;
   border-radius: 3px;
   cursor: pointer;
   -webkit-touch-callout: none; /* iOS Safari */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Old versions of Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

.core-focus {
   background: var(--surface-container);
   border: 1px solid var(--outline);
}

.core:hover {
   background: var(--surface-container);
}

.core-img {
   height: 34px;
}

.core-img img {
   width: 32px;
   border: 1px solid var(--outline-variant);
}

.core-numbers {
   width: px;
}

.winrate {
   text-align: center;
   font-size: 0.8rem;
}

.total {
   font-size: 0.75rem;
   text-align: center;
   color: var(--color-font-faded);
}
.core-img img:not(:first-child) {
   margin-left: 5px;
}
</style>