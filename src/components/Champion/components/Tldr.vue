<script>
export default {
   data() {
      return {
         organizedCore: [],
         coreFocus: 0,
         config: {
            visibleCore: 10, // Limit core build to top N builds, sorted by popularity
            winrateSort: false, // Sort trailing items by highest winrate
            trailingExtended: 2, // How many trailing items to display
         },
         // totalGames: 0, use actual total games
      }
   },

   created() {
      this.sortCore()
      // console.log(this.champion.core)
      // if (this.champion != null) 
   },
   
   methods: {
      sortCore() {
         for (const c in this.champion.core) {
            // this.totalGames += this.champion.core[c].games
            this.champion.core[c].core = c
            this.organizedCore.push(this.champion.core[c])
         }
         this.organizedCore.sort((a, b) => b.games - a.games)
         this.organizedCore = this.organizedCore.slice(0, this.config.visibleCore)
         // console.log(this.totalGames)
         console.log('potato', this.organizedCore)
      },

      itemImage(id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${id}.png`
      },

      trailingSort(obj) {
         let arr = []
         for (const i in obj) {
            arr.push([i, obj[i].games, obj[i].wins])
         }
         (this.config.winrateSort) ? arr.sort((a, b) => (a[1] / a[2]) - (b[1] / b[2])) : arr.sort((a, b) => b[1] - a[1])
         return arr
      },
      
      startingSort(obj) {
         let key
         let roll = 0
         if (this.config.winrateSort) {
            for (const j in obj) {
               const potato = (obj[j].wins / obj[j].games)
               if (potato > roll ) key = [j, obj[j].games, obj[j].wins]
            }
         } else {
            for (const j in obj) {
               if (obj[j].games > roll) {
                  roll = obj[j].games
                  key = key = [j, obj[j].games, obj[j].wins]
               }
            }
         }

         return key
      },

      winrate(total, win) {
         return (win / total * 100).toFixed(1) + '%'
      },
      trailingBackground(i) {
         if (i != 2) {
            return 'var(--alpha-01)'
         }
      }
   },

   computed: {
      startingItems() {
         return this.startingSort(this.organizedCore[this.coreFocus].starting)
      }
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
               <h2>Items</h2>
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
            <div class="sub-section-header">
               <div class="title">Starting</div>
               {{ this.winrate(startingItems[1], startingItems[2]) }}
               <div class="misc">
               </div>
            </div>
            <img :src="this.itemImage(img)" alt="" v-for="(img, i) in startingItems[0].split('_')" :key="i">
         </div>
         <div class="runes-leveling"></div>
      </div>
   </div>
</template>

<style scoped>
@import url(./styles.css);



.section {
   display: flex;
   height: 405px;
   color: var(--color-font);
}

.core-selection {
   border-right: 1px solid var(--cell-border);
   padding-right: 20px;
   /* margin-right: 10px; */
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

}

.trailing {
   padding: 0 20px;
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
   margin-top: 10px;
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