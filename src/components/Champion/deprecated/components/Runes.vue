   <script>
export default {
   data() {
      return {
         mythicSelection: [],
         runesData: {
            primaryRunes: {
               8100: [[0, 0], [[0, 0], [0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0], [0, 0]]],
               8300: [[0, 0], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]]],
               8000: [[0, 0], [[0, 0], [0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]]],
               8400: [[0, 0], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]]],
               8200: [[0, 0], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]]],
            },
            secondaryRunes: {
               8100: [[0, 0], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0], [0, 0]]],
               8300: [[0, 0], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]]],
               8000: [[0, 0], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]]],
               8400: [[0, 0], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]]],
               8200: [[0, 0], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]]],
            },
            flexRunes: [
               [[0, 0], [0, 0], [0, 0]],
               [[0, 0], [0, 0], [0, 0]],
               [[0, 0], [0, 0], [0, 0]]
            ]
         }
      }
   },

   created() {
      for (const m in this.champion.mythics) {
         this.mythicSelection.push(m)
      }
      this.mythicRuneLoop()
   },

   methods: {
      mythicRuneLoop() {
         this.runesData = {
            primaryRunes: {
               // [games,wins]
               8100: [[0,0], [[0,0], [0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0], [0,0]]],
               8300: [[0,0], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]]],
               8000: [[0,0], [[0,0], [0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]]],
               8400: [[0,0], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]]],
               8200: [[0,0], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]]],
            },
            secondaryRunes: {
               8100: [[0,0], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0], [0,0]]],
               8300: [[0,0], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]]],
               8000: [[0,0], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]]],
               8400: [[0,0], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]]],
               8200: [[0,0], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]], [[0,0], [0,0], [0,0]]],
            },
            flexRunes: [
               [[0,0], [0,0], [0,0]],
               [[0,0], [0,0], [0,0]],
               [[0,0], [0,0], [0,0]]
            ]
         }
         for (const i in this.mythicSelection) {
            // Primary Runes
            for (const j in this.champion.mythics[this.mythicSelection[i]].primaryRunes) {
               if (j === '0') continue
               const tree = this.champion.mythics[this.mythicSelection[i]].primaryRunes[j]
               this.runesData.primaryRunes[j][0][0] += tree.games
               this.runesData.primaryRunes[j][0][1] += tree.wins
               for (const k in tree) {
                  if (typeof tree[k] != 'object') continue
                  const row = parseInt(k.slice(3))
                  for (const [x, y] of Object.entries(tree[k])) {
                     const idx = this.runesTable[j][row].indexOf(x)
                     this.runesData.primaryRunes[j][row+1][idx][0] += y.games
                     this.runesData.primaryRunes[j][row+1][idx][1] += y.wins
                  }

               }
            }

            for (const j in this.champion.mythics[this.mythicSelection[i]].secondaryRunes) {
               if (j === '0') continue // Some responses from riot gives 0 as the tree
               const tree = this.champion.mythics[this.mythicSelection[i]].secondaryRunes[j]
               this.runesData.secondaryRunes[j][0][0] += tree.games
               this.runesData.secondaryRunes[j][0][1] += tree.wins

               for (const k in tree) {
                  if (typeof tree[k] != 'object') continue
                  const row = parseInt(k.slice(3))
                  for (const [x, y] of Object.entries(tree[k])) {
                     const idx = this.runesTable[j][row+1].indexOf(x)
                     this.runesData.secondaryRunes[j][row+1][idx][0] += y.games
                     this.runesData.secondaryRunes[j][row+1][idx][1] += y.wins
                  }
               }  
            }

            for (const j in this.champion.mythics[this.mythicSelection[i]].flexRunes) {
               if (j === '0') continue
               const tree = this.champion.mythics[this.mythicSelection[i]].flexRunes[j]
               const row = parseInt(j.slice(3))
               for (const [k, v] of Object.entries(tree)) {
                  const idx = this.flexRunes[row].indexOf(k)
                  this.runesData.flexRunes[row][idx][0] += v.games
                  this.runesData.flexRunes[row][idx][1] += v.wins
               }

            }
         }
      },
      toggleAll() {
         if (this.mythicSelection.length > 0) {
            this.mythicSelection = []
         } else {
            for (const m in this.champion.mythics) {
               this.mythicSelection.push(m)
            }
         }
         this.mythicRuneLoop()
      },
      mythicToggle(i) {
         if (this.mythicSelection.includes(i)) {
            const j = this.mythicSelection.indexOf(i)
            this.mythicSelection.splice(j, 1)
         } else {
            this.mythicSelection.push(i)
         }
         this.mythicRuneLoop()
      },
      itemImage(Id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${Id}.png`
      },
      runeImage(id) {
         return new URL(`../../../assets/runes/${id}.png`, import.meta.url).href
      },
      flexRuneImage(id) {
         return new URL(`../../../assets/runes/flex/${id}.png`, import.meta.url).href
      },
      winrate(total, win) {
         return `${Math.round(win / total * 1000) / 10}%`
      },
   },

   computed: {
      flexRunes() {
         return [['5008', '5005', '5007'], ['5008', '5002', '5003'], ['5001', '5002', '5003']]
      },
      noMythicImage() {
         return new URL(`../../../assets/no_mythic.jpg`, import.meta.url).href
      },
   },

   props: {
      mythicData: null,
      champion: null,
      patch: null,
      parameters: null,
      items: null,
      runesTable: null
   }
}
</script>

<template>
   <div class="section-top">
      <h2>Runes</h2>
      <div class="section-top-right-wrapper">

         <div class="section-top-right">
            <div class="section-top-tabs">
               <div class="tab" @click="this.toggleAll()">
                  Toggle All
               </div>
            </div>
         </div>

      </div>
   </div>
   <div class="rune-wrapper">
      <div class="mythic-tabs">
         <div class="tab" :class="{ 'tab-focus': this.mythicSelection.includes(mythic.id) }"  @click="this.mythicToggle(mythic.id)" v-for="(mythic, i) in this.mythicData" :key="i">
            <img v-if="mythic.id == 0" rel="preload" :src="noMythicImage" alt="">
            <img v-else rel="preload" :src="itemImage(mythic.id)" alt="">
            <div class="tab-sub">
               <h4> {{ winrate(mythic.games, mythic.wins) }} </h4>
               <h3> ({{ mythic.games }}) </h3>
            </div>
         </div>
      </div>
      <div class="runes">

         <div class="primary-runes">
            <div class="rune-tree" v-for="(tree, i) in Object.entries(this.runesTable)" :key="i">
               <img class="primary-tree" rel="preload" :class="{ 'dead-rune': !this.runesData.primaryRunes[tree[0]][0][0] }" :src="runeImage(tree[0])" alt="">
               <div class="image-sub">
                  <h4 v-if="this.runesData.primaryRunes[tree[0]][0][0]">{{ winrate(this.runesData.primaryRunes[tree[0]][0][0], this.runesData.primaryRunes[tree[0].toString()][0][1]) }}</h4>
                  <h4 v-else>-</h4>
                  <h3>{{ this.runesData.primaryRunes[tree[0]][0][0] }}</h3>
               </div>
               <div class="rune-row" :class="{ 'keystone-row': j === 0 }" v-for="(row, j) in tree[1]" :key="j">
                  <div class="rune"  v-for="(rune, k) in row" :key="k">
                     <img rel="preload" :class="{ 'keystones': j === 0, 'dead-rune': !this.runesData.primaryRunes[tree[0]][j+1][k][0] }" :src="runeImage(rune)" alt="">
                     <div class="image-sub-block">
                        <h4 v-if="this.runesData.primaryRunes[tree[0]][j+1][k][0]">{{ this.winrate(this.runesData.primaryRunes[tree[0]][j+1][k][0], this.runesData.primaryRunes[tree[0]][j+1][k][1]) }}</h4>
                        <h4 v-else>-</h4>
                        <h3>{{ this.runesData.primaryRunes[tree[0]][j+1][k][0] }}</h3>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div class="secondary-runes">
            <div class="rune-tree" v-for="(tree, i) in Object.entries(this.runesTable)" :key="i">
               <img class="secondary-tree" rel="preload" :class="{ 'dead-rune': !this.runesData.secondaryRunes[tree[0]][0][0] }" :src="runeImage(tree[0])" alt="">
               <div class="image-sub">
                  <h4 v-if="this.runesData.secondaryRunes[tree[0]][0][0]">{{ winrate(this.runesData.secondaryRunes[tree[0]][0][0], this.runesData.secondaryRunes[tree[0].toString()][0][1]) }}</h4>
                  <h4 v-else>-</h4>
                  <h3>{{ this.runesData.secondaryRunes[tree[0]][0][0] }}</h3>
               </div>
               <div class="rune-row" v-for="(row, j) in tree[1].slice(1)" :key="j">
                  <!-- {{ row }} -->
                  <div class="rune" v-for="(rune, k) in row" :key="k">
                     <img rel="preload" :class="{ 'dead-rune': !this.runesData.secondaryRunes[tree[0]][j + 1][k][0] }" :src="runeImage(rune)" alt="">
                     <div class="image-sub-block">
                        <h4 v-if="this.runesData.secondaryRunes[tree[0]][j + 1][k][0]">{{ this.winrate(this.runesData.secondaryRunes[tree[0]][j + 1][k][0], this.runesData.secondaryRunes[tree[0]][j + 1][k][1]) }}</h4>
                        <h4 v-else>-</h4>
                        <h3>{{ this.runesData.secondaryRunes[tree[0]][j + 1][k][0] }}</h3>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         
         <div class="flex-runes">
            <div class="flex-rune-tree" v-for="(row, i) in flexRunes" :key="i">
               <div class="rune-row" v-for="(rune, j) in row" :key="j">
                  <img rel="preload" :class="{ 'dead-rune': !this.runesData.flexRunes[i][j][0] }" :src="flexRuneImage(rune)" alt="">
                  <div class="image-sub-block">
                     <h4 v-if="this.runesData.flexRunes[i][j][0]">{{ this.winrate(this.runesData.flexRunes[i][j][0], this.runesData.flexRunes[i][j][1]) }}</h4>
                     <h4 v-else>-</h4>
                     <h3>{{ this.runesData.flexRunes[i][j][0] }}</h3>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
   .section-top {
      height: 42px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 3px;
   }
   .section-top-right-wrapper {
      display: inline-block;
      width: calc(100% - 120px);
   }

   .section-top-right {
      display: flex;
      justify-content: space-between;
      align-items: center;
   }
   .section-top-tabs, .item-tabs {
      display: flex;
      flex-direction: row;
      gap: 10px;
   }
   .section-top-tabs .tab, .item-tabs .tab {
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
   }

   .dead-rune {
      filter: saturate(0);
   }
   .rune-wrapper {
      display: flex;
      height: 837px;
      margin-bottom: 50px;
   }
   .mythic-tabs {
      overflow-y: scroll;
      overflow-x: hidden;
      height: 100%;
      margin-right: 8px;
      padding-right: 5px;
   }
   .mythic-tabs .tab:not(:last-child) {
      margin-bottom: 0.25rem;
   }

   .tab-sub h4 {
      display: block;
      color: var(--color-font);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .tab-sub h3 {
      display: block;
      color: var(--color-font-faded);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }

   .tab {
      display: flex;
      align-items: center;
      background: var(--cold-blue);
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      padding: 0.5rem 1.5rem 0.5rem 0.5rem;
      gap: 0.5rem;
      transition: 0.25s;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
   }

   

   .tab-focus {
      border: 1px solid var(--cell-border);
      background: var(--cold-blue-focus);
      color: var(--color-font-focus);
   }

   .tab:hover {
      background: var(--cold-blue-focus);
   }

   .mythic-tabs img {
      width: 30px;
      border: 1px solid var(--cell-border);
   }

   .mythic-tabs::-webkit-scrollbar {
      width: 4px;
   }

   /* Track */
   .mythic-tabs::-webkit-scrollbar-track {
      border-radius: 5px;
   }

   /* Handle */
   .mythic-tabs::-webkit-scrollbar-thumb {
      background: var(--alpha-07);
      border-radius: 5px;
      
   }
   .mythic-tabs::-webkit-scrollbar-thumb:hover {
      background: var(--light-12);
      transition: 0.25s;
   }
   
   .rune img, .flex-runes img {
      width: 35px;
   }

   .rune-row {
      display: flex;
      gap: 8px;
      justify-content: center;
   }
   .flex-runes .rune-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: center;
   }
   .keystone-row {
      gap: 2px;
   }
   img.keystones {
      width: 45px;
      margin-bottom: -5px;
   }

   .runes {
      display: flex;
      width: 100%;
      flex-direction: column;
      padding: 30px 0;
      background: var(--cell-panel);
      border-radius: 15px;
      gap: 20px;
   }
   .primary-runes {
      display: flex;
      justify-content: space-evenly;
   }
   
   .secondary-runes {
      display: flex;
      justify-content: space-evenly;
   }

   .flex-runes {
      display: flex;
      justify-content: space-evenly;
   }

   .flex-runes img {
      background: var(--black-alpha-7);
      border-radius: 100%;
   }

   .rune-tree {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      width: 186px;
   }
   .flex-rune-tree {
      display: flex;
      align-items: center;
      gap: 15px;
   }


   .image-sub-block {
      text-align: center;
   }

   .image-sub {
      text-align: center;
   }

   img.primary-tree {
      width: 35px;
   }

   img.secondary-tree {
      width: 30px;
   }
   
   h2 {   
      color: var(--color-font);
      font-size: 1.1rem;
      display: inline-block;
      font-style: italic;
      font-weight: 400;
      margin: 0;
      text-align: center;
      width: 116px;
   }
   .image-sub h4 {
      display: inline-block;
      color: var(--color-font);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.8rem;
   }
   
   .image-sub h3 {
      display: inline-block;
      color: var(--color-font-faded);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
      margin-left: 0.3rem;
   }
   .image-sub-block {
      text-align: center;
   }

   .image-sub-block h4 {
      display: block;
      color: var(--color-font);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .image-sub-block h3 {
      display: block;
      color: var(--color-font-faded);
      text-align: center;
      font-weight: normal;
      margin: 0;
      margin-top: 0.2rem;
      font-size: 0.75rem;
   }
</style>