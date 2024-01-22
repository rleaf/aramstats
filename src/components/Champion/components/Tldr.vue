<script>
import _runes from '@/constants/runes'
import _flex from '@/constants/flex'

export default {
   data() {
      return {
         organizedCore: [],
         coreFocus: 0,
         config: {
            visibleCore: 10, // Limit core build to top N builds, sorted by popularity
            winrateSort: false, // Sort trailing items by highest winrate
            trailingExtended: 2, // How many trailing items to display
            levelCutoff: 10, // Minimum character level when considering skill order.
         },
         runes: _runes,
         flex: _flex,
      }
   },

   created() {
      this.sortCore()
      this.skills
   },
   
   methods: {
      sortCore() {
         for (const c in this.champion.core) {
            this.champion.core[c].core = c
            this.organizedCore.push(this.champion.core[c])
         }
         this.organizedCore.sort((a, b) => b.games - a.games)
         this.organizedCore = this.organizedCore.slice(0, this.config.visibleCore)
         console.log('organized core', this.organizedCore)
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

      trailingSort(obj) {
         let arr = []
         for (const i in obj) {
            arr.push([i, obj[i].games, obj[i].wins])
         }
         (this.config.winrateSort) ? arr.sort((a, b) => (a[1] / a[2]) - (b[1] / b[2])) : arr.sort((a, b) => b[1] - a[1])
         return arr
      },
      
      masterSort(obj) {
         /* 
            Take any obj with games & wins value for Tldr section and return desired datum based off winrate configuration.
         */
         let peaches
         let roll = 0
         if (this.config.winrateSort) {
            for (const j in obj) {
               const potato = (obj[j].wins / obj[j].games)
               if (potato > roll ) peaches = [j, obj[j].games, obj[j].wins]
            }
         } else {
            for (const j in obj) {
               if (obj[j].games > roll) {
                  roll = obj[j].games
                  peaches = [j, obj[j].games, obj[j].wins]
               }
            }
         }

         return peaches // [datum, games, wins]
      },

      winrate(total, win) {
         return (win / total * 100).toFixed(1) + '%'
      },
      trailingBackground(i) {
         if (i != 2) {
            return 'var(--alpha-01)'
         }
      }, 

   },

   computed: {
      startingItems() {
         return this.masterSort(this.organizedCore[this.coreFocus].starting)
      },

      startingSpells() {
         return this.masterSort(this.organizedCore[this.coreFocus].spells)
      },

      primaryRunes() {
         return this.masterSort(this.organizedCore[this.coreFocus].runes.primary)
      },

      secondaryRunes() {
         // delete this.organizedCore[this.coreFocus].runes.secondary[this.primaryRunes[0]]
         // const x = this.organizedCore[this.coreFocus].runes.secondary
         const x = Object.assign({}, this.organizedCore[this.coreFocus].runes.secondary)
         delete x[this.primaryRunes[0]]
         return this.masterSort(x)
      },

      skills() {
         /* 
            Need to take skills object and produce an object where redundant skill paths are reduced to their
            superset.

            Need array for order from small to large
         */
         // Broken until I fix backend since I will not be passing `raw` back to front.
         
         const x = Object.entries(this.organizedCore[this.coreFocus].skills).sort((a, b) => a[0].length - b[0].length)

         for (const i of x) {
            if (i[0].length < this.config.levelCutoff) continue
            console.log(i)
            
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
         Tldr
      </div>
      <div class="section">
         <div class="core-selection">
            <div class="core" :class="{'core-focus' : this.coreFocus === i}" @click="this.coreFocus = i" v-for="(c, i) in this.organizedCore" :key="i">
               <div class="core-numbers">
                  <div class="winrate">{{ this.winrate(c.games, c.wins) }}</div>
                  <div class="total">{{ c.games }}</div>
               </div>
               <div class="core-img">
                  <img :src="this.itemImage(i)" alt="" v-for="(i, j) in c.core.split('_') " :key="j">
               </div>
            </div>
         </div>
         <div class="trailing">
            <div class="sub-section-header">
               <div class="sub-lhs">
                  <span class="title">Items</span>
               </div>
               <img src="@/assets/information.svg" alt="">
            </div>
            <div class="trailing-items-wrapper">

               <div class="trailing-items" :style="{ background: this.trailingBackground(i) }" v-for="i in 3" :key="i">
                  <span style="color: var(--color-font-faded);">{{ i + 3 }}</span> <!-- KEEP? -->
                  <div v-for="(i, k) in this.trailingSort(this.organizedCore[this.coreFocus].trailing[i+3]).slice(0, this.config.trailingExtended)" :key="k">
                     <img :src="this.itemImage(i[0])" alt="">
                     <div class="winrate">{{ this.winrate(i[1], i[2]) }}</div>
                     <div class="total">{{ i[2] }}</div>
                  </div>
               </div>
            </div>

         </div>
         <div class="starting-spells">
            <div class="starting">
               <div class="sub-section-header">
                  <div class="sub-lhs">
                     <span class="title">Starting</span>
                     <div class="misc">
                        <h3>{{ this.winrate(startingItems[1], startingItems[2]) }}</h3>
                        <h3>{{ startingItems[1] }}</h3>
                     </div>
                  </div>
                  <img src="@/assets/information.svg" alt="">
               </div>
               <img class="starting-image" :src="this.itemImage(img)" alt="" v-for="(img, i) in startingItems[0].split('_')" :key="i">
            </div>
            <div class="spells">
               <div class="sub-section-header">
                  <div class="sub-lhs">
                     <span class="title">Spells</span>
                     <div class="misc">
                        <h3>{{ this.winrate(startingSpells[1], startingSpells[2]) }}</h3>
                        <h3>{{ startingSpells[1] }}</h3>
                     </div>
                  </div>
                  <img src="@/assets/information.svg" alt="">
               </div>
               <img class="starting-image" :src="this.spellImage(img)" alt="" v-for="(img, i) in startingSpells[0].split('_')" :key="i">
            </div>
         </div>
         <div class="runes-leveling">
            <div class="runes">
               <div class="sub-section-header">
                  <div class="sub-lhs">
                     <span class="title">Runes</span>
                     <div class="misc">
                        <h3>{{ this.winrate(primaryRunes[1], primaryRunes[2]) }}</h3>
                        <h3>{{ primaryRunes[1] }}</h3>
                     </div>
                  </div>
                  <img src="@/assets/information.svg" alt="">
               </div>
               <div class="runes-wrapper">
                  <div class="tldr-primary">
                     <div class="rune-row" alt="" v-for="(row, i) in this.runes[primaryRunes[0]]" :key="i">
                        <img :src="this.runeImage(rune)" alt="" v-for="(rune, j) in row" :key="j">
                     </div>
                  </div>
                  <div>
                     <div class="tldr-secondary">
                        <div class="rune-row" v-for="(row, i) in this.runes[secondaryRunes[0]].slice(1)" :key="i">
                           <img :src="this.runeImage(rune)" alt="" v-for="(rune, j) in row" :key="j">
                        </div>
                     </div>
                     <div class="tldr-flex">
                        <div class="rune-row" v-for="(row, i) in this.flex" :key="i">
                           <img :src="this.flexRuneImage(rune)" alt="" v-for="(rune, j) in row" :key="j">
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="leveling">
               <div class="sub-section-header">
                  <div class="sub-lhs">
                     <span class="title">Level Order</span>
                     <div class="misc">
                        <h3>{{ this.winrate(startingSpells[1], startingSpells[2]) }}</h3>
                        <h3>{{ startingSpells[1] }}</h3>
                     </div>
                  </div>
                  <img src="@/assets/information.svg" alt="">
               </div>
               <div class="level-wrapper">
                  <div class="level-column" v-for="(col, i) in 18" :key="i">
                     <div class="level-row" v-for="(row, j) in 4" :key="j">
                        
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



.section {
   display: flex;
   justify-content: space-between;
   height: 405px;
   color: var(--color-font);
}

.core-selection {
   border-right: 1px solid var(--cell-border);
   padding-right: 20px;
   overflow: scroll;
   overflow-x: hidden;
}

.core-selection::-webkit-scrollbar {
   width: 4px;
}

.core-selection::-webkit-scrollbar-track {
   border-radius: 5px;
   padding-right: 15px;
}

.core-selection::-webkit-scrollbar-thumb {
   background: var(--alpha-06);
   border-radius: 5px;
   
}
.core-selection::-webkit-scrollbar-thumb:hover {
   background: var(--light-12);
   transition: 0.25s;
}

.starting-spells {
   min-width: 200px;
   /* padding-right: 20px; */
}

.spells {
   margin-top: 80px;
}

.runes-leveling {
   width: 350px;
}
.runes-wrapper {
   display: flex;
   justify-content: space-evenly;
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

.tldr-secondary img, .tldr-flex img {
   padding: 1px 2px;
}
.tldr-secondary img {
   width: 24px;
}

.tldr-flex img {
   width: 24px;
}

.rune-row {
   display: inline-block;
}

.level-wrapper {
   display: flex;
}

.level-row {
   width: 18px;
   height: 18px;
   margin: 1px;
   background: tomato;
}

img.starting-image {
   width: 32px;
   border: 1px solid var(--cell-border);

}

 img.starting-image:not(:nth-child(2)) {
   margin-left: 5px;
}

.trailing {
   /* padding: 0 20px; */
   color: var(--color-font);
}

.trailing-items-wrapper {
   display: flex;
   gap: 10px;
}

.trailing-items {
   display: flex;
   flex-direction: column;
   gap: 20px;
   align-items: center;
   padding: 20px 20px;
   width: 35px;
   border-radius: 5px;
}

.trailing-items img {
   display: block;
   margin: 0 auto;
   width: 32px;
   border: 1px solid var(--cell-border);
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
   background: var(--cold-blue-focus);
   border: 1px solid var(--cell-border);
}

.core:hover {
   background: var(--cold-blue-focus);
}

.core-img {
   height: 34px;
}

.core-img img {
   width: 32px;
   border: 1px solid var(--cell-border);
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