<script>
export default {
   data() {
      return {
         mythicSelection: [],
      }
   },

   created() {

   },

   methods: {
      mythicToggle(i) {
         if (this.mythicSelection.includes(i)) {
            const j = this.mythicSelection.indexOf(i)
            this.mythicSelection.splice(j, 1)
         } else {
            this.mythicSelection.push(i)
         }
      },
      getTreeStuff(tree, mode) {
         const o = this.champion.mythics[this.mythicData[0].id].primaryRunes[tree]
         if (o) {
            return (mode === 0) ? o.games : o.wins
         }
      },
      getRuneGames(tree, j, rune) {
         const o = this.champion.mythics[this.mythicData[0].id].primaryRunes[tree]
         if (o) {
            if (o[`row${j}`][rune]) {
               return o[`row${j}`][rune].games
            }
         }
      },
      getRuneWins(tree, j, rune) {
         const o = this.champion.mythics[this.mythicData[0].id].primaryRunes[tree]
         if (o) {
            if (o[`row${j}`][rune]) {
               return o[`row${j}`][rune].wins
            }
         }
      },
      itemImage(Id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${Id}.png`
      },
      runeImage(id) {
         return new URL(`../../../assets/runes/${id}.png`, import.meta.url).href
      },
      winrate(total, win) {
         return `${Math.round(win / total * 1000) / 10}%`
      },
   },

   computed: {

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
   <h2>Runes</h2>
   <div class="rune-wrapper">
      <div class="mythic-tabs">
         <div class="tab" :class="{ 'tab-focus': this.mythicSelection.includes(i) }"  @click="this.mythicToggle(i)" v-for="(mythic, i) in this.mythicData" :key="i">
            <img rel="preload" :src="itemImage(mythic.id)" alt="">
            <div class="tab-sub">
               <h4> {{ winrate(mythic.games, mythic.wins) }} </h4>
               <h3> ({{ mythic.games }}) </h3>
            </div>
         </div>
      </div>
      <div class="runes">
         <div class="rune-tree" v-for="(tree, i) in Object.entries(this.runesTable)" :key="i">
            <img rel="preload" :src="runeImage(tree[0])" alt="">
            <div class="image-sub">
               <h4 v-if="this.getTreeStuff(tree[0], 0)">{{ winrate(this.getTreeStuff(tree[0], 0), this.getTreeStuff(tree[0], 1)) }}</h4>
               <h4 v-else>-</h4>
               <h3>{{ this.getTreeStuff(tree[0], 0) || '-' }}</h3>
            </div>
            <div class="rune-row" :class="{ 'keystone-row': j === 0 }" v-for="(row, j) in tree[1]" :key="j">
               <div class="rune"  v-for="(rune, k) in row" :key="k">
                  <img rel="preload" :class="{ 'keystones': j === 0 }" :src="runeImage(rune)" alt="">
                  <div class="image-sub-block">
                     <h4 v-if="this.getRuneGames(tree[0], j, rune)">{{ this.winrate(this.getRuneGames(tree[0], j, rune), this.getRuneWins(tree[0], j, rune)) }}</h4>
                     <h4 v-else>-</h4>
                     <h3>{{ this.getRuneGames(tree[0], j, rune) || '-' }}</h3>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
   .rune-wrapper {
      display: flex;
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
      color: var(--tint500);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .tab-sub h3 {
      display: block;
      color: var(--tint400);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }

   .tab {
      display: flex;
      align-items: center;
      background: var(--tint100);
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      padding: 0.5rem 1.5rem 0.5rem 0.5rem;
      gap: 0.5rem;
      transition: 0.25s;
   }

   

   .tab-focus {
      border: 1px solid var(--tint400);
   }

   .tab:hover {
      background: var(--hoverButton);
   }

   .mythic-tabs img {
      width: 30px;
      border: 1px solid var(--tint400);
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
      background: var(--tint200);
      border-radius: 5px;
      
   }
   .mythic-tabs::-webkit-scrollbar-thumb:hover {
      background: var(--tint300);
      transition: 0.25s;
   }
   
   .rune img {
      width: 35px;
   }
   .rune-row {
      display: flex;
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
      padding: 30px 0;
      width: 100%;
      background: var(--tint100);
      border-radius: 15px;
      display: flex;
      justify-content: space-evenly;
   }
   .rune-tree {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
   }

   .image-sub-block {
      text-align: center;
   }

   .image-sub {
      text-align: center;
   }

   .rune-tree > img {
      width: 35px;
   }
   
   h2 {   
      color: var(--light400);
      font-size: 1.1rem;
      display: inline-block;
      font-style: italic;
      font-weight: 400;
      margin: 1rem 0;
      text-align: center;
   }
   .image-sub h4 {
      display: inline-block;
      color: var(--tint500);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .image-sub h3 {
      display: inline-block;
      color: var(--tint400);
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
      color: var(--tint500);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .image-sub-block h3 {
      display: block;
      color: var(--tint400);
      text-align: center;
      font-weight: normal;
      margin: 0;
      margin-top: 0.2rem;
      font-size: 0.75rem;
   }
</style>