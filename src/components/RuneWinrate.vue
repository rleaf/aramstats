<script>
export default {
   data() {
      return {
         rune: {}
      }
   },

   mounted() {
      this.runeWinrate()
   },

   watch: {
      data(_, prev) {
         
         if (prev) this.rune = {}
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
         this.data.matches.forEach((match) => {
            if (match.primaryRune in this.rune) {
               if (match.win) this.rune[match.primaryRune].win += 1
               this.rune[match.primaryRune].totalGames += 1
            } else {
               this.rune[match.primaryRune] = {
                  totalGames: 0,
                  win: 0
               }

               if (match.win) this.rune[match.primaryRune].win += 1
               this.rune[match.primaryRune].totalGames += 1
            }
         })

         for (const prop in this.rune) {
            this.rune[prop].winRate = Math.round(this.rune[prop].win / this.rune[prop].totalGames * 100)
         }

      }
   },

   computed: {
      // sorting (sort object?)
   },

   props: {
      data: null
   }
}
</script>

<template>
   <div class="rune-main">
      <div class="rune-wr" v-for="(v, k, i) in this.rune"
         :key="k"
         :class="i % 2 == 0 ? `rune-style-0` : `rune-style-1`">
         <img :src="runeImage(k)" alt="">
         <div class="rune-wins" >
            {{ v.win }}/{{ v.totalGames }}
            ({{ v.winRate }}%)
         </div>
      </div>
   </div>
</template>

<style scoped>

   .rune-style-0 {
      background: #1f2a42;
   }

   .rune-wins {
      margin-top: -3px;
      padding-right: 3px;
      font-size: 0.9rem;
   }
   .rune-wr {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 2px 5px;
      margin-bottom: 3px;
      border-radius: 5px;
   }
   .rune-wr img {
      width: 28px;
   }

   .rune-main {
      padding-top: 10px;
   }
</style>