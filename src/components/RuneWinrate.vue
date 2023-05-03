<script>
export default {
   data() {
      return {
         rune: []
      }
   },

   mounted() {
      this.runeWinrate()
   },

   watch: {
      data(_, prev) {
         
         if (prev) this.rune = []
         this.runeWinrate()
      }
   },

   methods: {
      runeImage(runeId) {
         return new URL(`../assets/runes/${runeId}.png`, import.meta.url).href
      },

      runeWinrate() {
         /*
         1. Iterate over matches
         2. Get primaryRune & Win/Lose
         3. Calculate WR % for every primaryRune
         */

         let matches
         (this.comparison) ? matches = this.data : matches = this.data.matches

         for (const match of matches) {
            let runeIdx = this.rune.findIndex(el => el.name == match.primaryRune)

            if (runeIdx == -1) {
               this.rune.push({ 'name': match.primaryRune, 'wins': 0, 'totalGames': 1, 'winRate': 0 })
               if (match.win) this.rune[this.rune.length - 1].wins++
            } else {
               if (match.win) this.rune[runeIdx].wins++
               this.rune[runeIdx].totalGames++
            }
         }

         for (const rune of this.rune) {
            rune.winRate = Math.round(rune.wins / rune.totalGames * 100)
         }
      },

      winrateColor(x) {
         // https://stackoverflow.com/a/12259830/1545958
         if (x < 50) return 'color: var(--parse50)'
         if (x < 75) return 'color: var(--parse75)'
         if (x < 85) return 'color: var(--parse85)'
         if (x <= 100) return 'color: var(--parse100)'
      }
   },

   computed: {
      runeSort() {
         return this.rune.sort((a, b) => b.totalGames - a.totalGames)
      }
   },

   props: {
      data: null,
      comparison: false
   }
}
</script>

<template>
   <div class="rune-main">
      <div class="rune-wr" v-for="(r, i) in runeSort"
         :key="r.name"
         :class="i % 2 == 0 ? `rune-0` : ``">
         <img :src="runeImage(r.name)" alt="">
         <div class="runes-percent" >
            <span :style="winrateColor(r.winRate)">{{ r.winRate }}%</span>
         </div>
         <div class="runes-fraction">
            ({{ r.wins }}/{{ r.totalGames }})
         </div>
      </div>
   </div>
</template>

<style scoped>
.rune-0 {
      background: var(--runeMythic);
   }

   .runes-fraction {
      /* margin-left: auto; */
      margin-top: -1px;
      color: var(--color-font-fade);
   }
   .runes-percent {
      font-weight: bold;
   }
   .rune-wr {
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      gap: 5px;
      padding: 3px 0;
      padding-right: 15px;
      margin-bottom: 3px;
      border-radius: 5px;
   }
   .rune-wr img {
      width: 28px;
   }

   .rune-main {
      height: 210px;
      min-width: 120px;
      margin-top: 10px;
      overflow-y: scroll;
   }

   .rune-main::-webkit-scrollbar {
      width: 3px;
   }

   .rune-main::-webkit-scrollbar-thumb {
      background-color: var(--scroll-track);
      border-radius: 3px;
   }
</style>