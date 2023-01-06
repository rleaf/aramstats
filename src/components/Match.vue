<script>
import axios from 'axios'

export default {
   data() {
      return {
         gamePlayed: Number,
         daysSince: Number,
         gameDuration: Number,
         date: null,
         kda: `${this.match.kills}/${this.match.deaths}/${this.match.assists}`,
         primaryRune: this.match.primaryRune,
         secondaryTree: this.match.secondaryTree,
         items: [

         ],
      }
   },

   created() {
      this.timeSet()
      this.itemImages()

      // const url = `http://ddragon.leagueoflegends.com/cdn/12.23.1/data/en_US/runesReforged.json`
      // axios.get(url)
      //    .then((res) => {
      //       console.log(res)
      //    })
      // console.log(this.match)
   },
   
   props: {
      match: Object
   },

   computed: {
      primary() {
         return new URL(`../assets/runes/${this.primaryRune}.png`, import.meta.url).href
      },
      secondary() {
         return new URL(`../assets/runes/${this.secondaryTree}.png`, import.meta.url).href
      }
   },

   methods: {
      timeSet() {
         this.date = new Date(this.match.gameCreation)
         const now = Date.now()
         const diffTime = Math.abs(this.date - now)
         this.daysSince = Math.round(diffTime / (1000 * 60 * 60 * 24))
         this.date = this.date.toLocaleString().split(/[ ,]+/)[0]
      },

      itemImages() {
         for (let i = 0; i < 6; i++) {
            if (this.match[`item${i}`] != 0) {
               let x = `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${this.match[`item${i}`]}.png`
               this.items.push(x)
            }
         }
      },
   }

}
</script>

<template>
   <div class="match-container">
      <!-- {{ this.match }} -->

      <div class="left-box">
         <div class="time">
            {{ this.daysSince }} day(s) ago
            <div class="date">
               {{ this.date }},
               {{ this.match.gameDuration }} min
            </div>
         </div>
         <div class="runes" v-if="primary">
            <!-- <img :src="rune" alt=""> -->
            <!-- <img :src="`../assets/runes/${this.match.secondaryTree}`" alt=""> -->
            <img class="primaryRune" :src="primary" alt="">
            <img class="secondaryTree" :src="secondary" alt="">
         </div>
         <div class="match-items">
            <img v-for="item in this.items"
               :key="item"
               :src="item">
         </div>
      </div>
      <div class="right-box">
         <div class="total-dmg match-cell">
            {{ this.match.totalDamageDealtToChampions }}
            <div class="dpm">
               {{ this.match.damagePerMinute }} DPM
            </div>
         </div>
         <div class="total-heal match-cell">
            {{ this.match.totalHeal || '-'}}
         </div>
         <div class="total-healing-to-teammates match-cell">
            {{ this.match.totalHealsOnTeammates }}
         </div>
         <div class="total-dmg-taken match-cell">
            {{ this.match.totalDamageTaken }}
         </div>
         <div class="total-mitigated-dmg match-cell">
            {{ this.match.totalSelfMitigated || '-' }}
         </div>
         <div class="kda match-cell">
            {{ this.kda }}
         </div>
         <div class="gold-earned match-cell">
            {{ this.match.goldEarned }}
         </div>
         <div class="tqp-match-wrapper match-cell">
            <div class="tqp-match">
               {{ this.match.tripleKills }}
            </div>
            <div class="tqp-match">
               {{ this.match.quadraKills }}
            </div>
            <div class="tqp-match">
               {{ this.match.pentaKills }}
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
@import url('../assets/stats.css');

.time {
   width: 100px;
}
.runes {
   display: flex;
   align-items: center;
   gap: 2px;
}

.primaryRune {
   width: 25px;
   /* background: rgba(0, 0, 0, 0.521);
   padding: 1px;
   border-radius: 100%; */
}
.secondaryTree {
   width: 15px;
   background: rgba(0, 0, 0, 0.521);
   padding: 4px;
   border-radius: 100%;
   
}
.dpm {
   font-size: 0.7rem;
   font-style: oblique;
   color: var(--color-font);
}


.match-items img {
   width: 25px;
}

.date {
   font-style: oblique;
   font-size: 0.7rem;
   color: var(--color-font);
}

.left-box {
   float: left;
   gap: 20px;
   padding-left: 10px;
   display: flex;
   align-items: center;
   height: 40px;
   color: var(--color-font);
}

.win {
   background: linear-gradient(90deg, var(--win), rgba(0, 0, 0, 0))
}

.loss {
   background: linear-gradient(90deg, var(--loss), rgba(0, 0, 0, 0))
}

.match-container {
   font-size: 0.9rem;
   border-top: 1px solid var(--matches-border-top);
}


</style>