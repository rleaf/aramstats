<script>
import axios from 'axios'

export default {
   data() {
      return {
         mythic: {},
      }
   },

   mounted() {

      this.mythicWinrate()
   },

   watch: {
      data(_, prev) {

         if (prev) this.mythic = {}
         this.mythicWinrate()
      }
   },

   methods: {
      async findMythic(items) {
         /* 
            Iterate over the items in each game and then check if they're mythic
         */
         const url = 'http://ddragon.leagueoflegends.com/cdn/12.23.1/data/en_US/item.json'
         let mythic

         await axios.get(url)
            .then((res) => {
               items.forEach((item) => {
                  if (item != 0 && res.data.data[item].description.includes('rarityMythic')) {
                     
                     // masterwork check.
                     if (res.data.data[item].into == undefined) {
                        mythic = res.data.data[item].from + '.png'
                        return
                     }

                     mythic = res.data.data[item].image.full

                  }
               })
            })

         return mythic
      },
      mythicImage(Id) {
         return `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${Id}`
      },

      async mythicWinrate() {
         for(const match of this.data.matches) {

            let mythic = await this.findMythic(match.items)
            
            if (mythic != undefined) {
               if (mythic in this.mythic) {
                  if (match.win) this.mythic[mythic].win += 1
                  this.mythic[mythic].totalGames += 1
               } else {
                  this.mythic[mythic] = {
                     totalGames: 0,
                     win: 0
                  }
      
                  if (match.win) this.mythic[mythic].win += 1
                  this.mythic[mythic].totalGames += 1
               }
      
               for (const prop in this.mythic) {
                  this.mythic[prop].winRate = Math.round(this.mythic[prop].win / this.mythic[prop].totalGames * 100)
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

   props: {
      data: null
   }
}
</script>

<template>
   <div class="mythic-main">
      <div class="mythic-wr" v-for="(v, k, i) in this.mythic"
         :key="k"
         :class="i % 2 != 0 ? `mythic-style-0` : `mythic-style-1`">
         <img :src="mythicImage(k)" alt="">
         <div class="mythic-percent">
            <span :style="winrateColor(v.winRate)">{{ v.winRate }}%</span>
         </div>
         <div class="mythic-fraction">
            ({{ v.win }}/{{ v.totalGames }})
            <!-- (34/29) -->
         </div>
      </div>
   </div>
</template>

<style scoped>
.mythic-style-0 {
      background: var(--rune-mythic-swap);;
   }

   .mythic-fraction {
      margin-left: auto;
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
      gap: 5px;
      padding: 2px 5px;
      margin-bottom: 3px;
      border-radius: 5px;
   }

   .mythic-wr img {
      width: 28px;
   }

   .mythic-main {
      padding-top: 10px;
   }
</style>