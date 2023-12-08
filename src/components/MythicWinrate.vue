<script>
import axios from 'axios'

export default {
   data() {
      return {
         mythic: []
      }
   },

   mounted() {

      this.mythicWinrate()
   },

   watch: {
      data(_, prev) {

         if (prev) this.mythic = []
         this.mythicWinrate()
      }
   },

   methods: {
      async findMythic(items, book) {
         /* 
            Iterate over the items in each game and then check if they're mythic
         */
         let mythic

         items.forEach((item) => {
            if (item != 0 && book[item].description.includes('rarityMythic')) {
               // If masterwork, revert back to mythic.
               if (book[item].into == undefined) {
                  mythic = book[item].from + '.png'
                  return
               }

               mythic = book[item].image.full

            }
         })

         return mythic
      },

      mythicImage(Id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.currentPatch}/img/item/${Id}`
      },

      async mythicWinrate() {

         let matches
         (this.comparison) ? matches = this.data : matches = this.data.matches

         let _res
         const url = `https://ddragon.leagueoflegends.com/cdn/${this.currentPatch}/data/en_US/item.json`
         await axios.get(url)
            .then((res) => _res = res.data.data)

         for(const match of matches) {
            let mythic = await this.findMythic(match.i, _res)

            if (mythic != undefined) {
               let mythicIdx = this.mythic.findIndex(el => el.id == mythic)

               if (mythicIdx == -1) {
                  this.mythic.push({ 'id': mythic, 'wins': 0, 'totalGames': 1, 'winRate': 0})
                  if (match.win) this.mythic[this.mythic.length - 1].wins++
               } else {
                  if (match.win) this.mythic[mythicIdx].wins++
                  this.mythic[mythicIdx].totalGames++
               }
      
               for (const item of this.mythic) {
                  item.winRate = Math.round(item.wins / item.totalGames * 100)
               }
            }
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
      mythicSort() {
         return this.mythic.sort((a, b) => b.totalGames - a.totalGames)
      }
   },

   props: {
      data: null,
      comparison: false,
      currentPatch: null
   }
}
</script>

<template>
   <div class="mythic-main">
      <div class="mythic-wr" v-for="(m, i) in mythicSort"
         :key="m.id"
         :class="i % 2 == 0 ? `mythic-0` : ``">
         <img :src="mythicImage(m.id)" alt="">
         <div class="mythic-percent">
            <span :style="winrateColor(m.winRate)">{{ m.winRate }}%</span>
         </div>
         <div class="mythic-fraction">
            ({{ m.wins }}/{{ m.totalGames }})
         </div>
      </div>
   </div>
</template>

<style scoped>
   .mythic-0 {
      background: var(--alpha-02);
   }

   /* .mythic-style-1 {
      background: var(--rune-mythic-1);;
   } */

   .mythic-fraction {
      /* margin-left: auto; */
      margin-top: -1px;
      color: var(--color-font-fade);
   }
   .mythic-percent {
      font-weight: bold;
   }

   .mythic-wr {
      display: flex;
      font-size: 0.8rem;
      align-items: center;
      justify-content: space-evenly;
      gap: 5px;
      padding: 3px 0;
      padding-right: 15px;
      margin-bottom: 3px;
      border-radius: 5px;
   }

   .mythic-wr img {
      width: 28px;
      border-radius: 3px;
   }

   .mythic-main {
      height: 210px;
      min-width: 120px;
      margin-top: 10px;
      overflow-y: scroll;
      overflow-x: hidden;
   }

   .mythic-main::-webkit-scrollbar {
      width: 3px;
   }

   .mythic-main::-webkit-scrollbar-thumb {
      background-color: var(--scroll-track);
   }
</style>