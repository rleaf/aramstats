<script>
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
            if (this.match.items) {
               if (this.match.items[i] != 0) {
                  let x = `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${this.match.items[i]}.png`
                  this.items.push(x)
               }
            }
         }
      },
   },

   computed: {
      primary() {
         return new URL(`../assets/runes/${this.primaryRune}.png`, import.meta.url).href
      },
      secondary() {
         return new URL(`../assets/runes/${this.secondaryTree}.png`, import.meta.url).href
      },
      matchWinLoss() {
         return (this.match.win) ? 'win' : 'loss'
      }
   },

}
</script>

<template>
   <div class="match-container">
      <div class="left-box">
         <div class="win-loss" :class="matchWinLoss"></div>
         <div class="time">
            {{ this.daysSince }} days ago
            <div class="date">
               {{ this.date }}, <span class="duration">{{ this.match.gameDuration }} min</span>
            </div>
         </div>
         <div class="runes" v-if="primary">
            <img class="primaryRune" :src="primary" alt="">
            <img class="secondaryTree" :src="secondary" alt="">
         </div>
         <div class="kda">
            <p class="kda">
               {{ this.kda }} <span class="unit">KDA</span>
            </p>
            {{ this.match.kda || '-' }}
            {{ this.match.madeupprop || '-' }}% <span class="unit">KP</span>
         </div>
         <div class="match-items">
            <img v-for="item in this.items"
               :key="item"
               :src="item">
         </div>
         <div class="tqp-match-wrapper">
               <div class="tqp-match">
                  <span class="unit">T</span> {{ this.match.tripleKills }}
               </div>
               <div class="tqp-match">
                  <span class="unit">Q</span> {{ this.match.quadraKills }}
               </div>
               <div class="tqp-match">
                  <span class="unit">P</span> {{ this.match.pentaKills }}
               </div>
            </div>
      </div>
      <div class="right-box">
         <div class="total-dmg">
            {{ this.match.totalDamageDealtToChampions }}, {{ this.match.madeupprop || '-' }}% <span class="unit">/ DS</span>
            <div class="per-minute">
               {{ this.match.damagePerMinute }} <span class="unit">/ m</span>
            </div>
         </div>
         <div class="total-heal">
            {{ this.match.totalHeal || '-'}}
            <div class="per-minute">
               {{ this.match.madeupprop || '-'  }} <span class="unit">/ m</span>
            </div>
         </div>
         <div class="total-ally-healing">
            {{ this.match.totalHealsOnTeammates }}
            <div class="per-minute">
               {{ this.match.madeupprop || '-' }} <span class="unit">/ m</span>
            </div>
         </div>
         <div class="total-dmg-taken">
            {{ this.match.totalDamageTaken }}
            <div class="per-minute">
               {{ this.match.madeupprop || '-' }} <span class="unit">/ m</span>
            </div>
         </div>
         <div class="total-mitigated-dmg">
            {{ this.match.totalSelfMitigated || '-' }}
            <div class="per-minute">
               {{ this.match.madeupprop || '-' }} <span class="unit">/ m</span>
            </div>
         </div>
         <div class="gold-earned">
            {{ this.match.goldEarned }}
            <div class="per-minute">
               {{ this.match.goldPerMinute }} <span class="unit">/ m</span>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
@import url('../assets/stats.css');


.runes {
   display: flex;
   width: 65px;
   align-items: center;
   /* gap: 2px; */
}

.primaryRune {
   width: 26px;
}
.secondaryTree {
   width: 20px;
   background: var(--secondary-tree);
   padding: 4px;
   border-radius: 100%;
   
}
.per-minute {
   font-size: 0.7rem;
   font-style: oblique;
   color: var(--color-font);
}

.kda {
   width: 105px;
}

p.kda {
   margin: 0;
}

.match-items {
   display: flex;
   align-items: center;
   width: 180px;
}

.match-items img {
   width: 26px;
   margin-left: 2px;
}

.time {
   color: var(--light900);
   width: 110px;
   padding-left: 10px;
}

.date {
   /* font-style: oblique; */
   font-size: 11px;
}

.duration {
   width: 50px;
   font-size: 14px;
   color: var(--color-font);
}

.unit {
   font-size: 13px;
   color: var(--light900);
}

.tqp-match-wrapper {
   display: flex;
   /* width: 55px; */
   flex-direction: row;
   gap: 9px;
   /* font-size: 12px; */
   line-height: 1;

}

.left-box {
   display: flex;
   align-items: center;
   height: inherit;
   color: var(--color-font);
}

.right-box {
   display: flex;
   align-items: center;
   height: inherit;
   color: var(--color-font);
}

.total-dmg {
   width: 120px;
}

.total-heal {
   width: 75px;
}

.total-ally-healing {
   width: 90px;
}

.total-dmg-taken {
   width: 110px;
}

.total-mitigated-dmg {
   width: 130px;
}

.gold-earned {
   width: 70px;
}

.win {
   /* background: linear-gradient(90deg, var(--win), rgba(0, 0, 0, 0)) */
   background: var(--win);
}

.loss {
   /* background: linear-gradient(90deg, var(--loss), rgba(0, 0, 0, 0)) */
   background: var(--loss);
}

.match-container {
   display: flex;
   justify-content: space-between;
   font-size: 14px;
   height: 50px;
   border-top: 1px solid var(--matches-border-top);
}

.win-loss {
   width: 20px;
   height: inherit;
}

</style>