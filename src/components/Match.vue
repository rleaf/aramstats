<script>
export default {
   data() {
      return {
         gamePlayed: Number,
         daysSince: Number,
         gameDuration: Number,
         date: null,
         kda: `${this.match.kills}/${this.match.deaths}/${this.match.assists}`,
         items: [

         ],
      }
   },

   created() {
      this.date = new Date(this.match.gameCreation)
      const now = Date.now()
      const diffTime = Math.abs(this.date - now)
      this.daysSince = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      this.date = this.date.toLocaleString().split(/[ ,]+/)[0]

      // console.log(this.match)

      for (let i = 0; i < 7; i++) {
         if (this.match[`item${i}`] != 0) {
            let x = `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${this.match[`item${i}`]}.png`
            this.items.push(x)
         }
      }
   },
   
   props: {
      match: Object
   }

}
</script>

<template>
   <div class="match-container">
      <!-- {{ this.match }} -->
      <div class="left-box">
         <div class="game-creation">
            {{ this.daysSince }} days ago
            <div class="date">
               {{ this.date }},
               {{ this.match.gameDuration }} min
            </div>
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
         </div>
         <div class="total-heal match-cell">
            {{ this.match.totalHealsOnTeammates }}
         </div>
         <div class="total-dmg-taken match-cell">
            {{ this.match.totalDamageTaken }}
         </div>
         <div class="kda match-cell">
            {{ this.kda }}
         </div>
         <div class="gold-earned match-cell">
            {{ this.match.goldEarned }}
         </div>
         <div class="triple-kills match-cell">
            {{ this.match.tripleKills }}
         </div>
         <div class="quadra-kills match-cell">
            {{ this.match.quadraKills }}
         </div>
         <div class="penta-kills match-cell">
            {{ this.match.pentaKills }}
         </div>
      </div>
   </div>
</template>

<style scoped>

.match-items img {
   width: 25px;
}

.date {
   font-style: oblique;
   font-size: 0.70rem;
}

.game-creation {
   width: 100px;
}
.left-box {
   float: left;
   gap: 20px;
   padding-left: 10px;
   display: flex;
   align-items: center;
   height: 40px;
   color: var(--light3);
}
.right-box {
   display: flex;
   justify-content: flex-end;
   align-items: center;
   height: 40px;
   color: var(--light3);
}

.win {
   background: linear-gradient(90deg, rgba(0, 255, 0, 0.027), rgba(0, 255, 0, 0))
}

.loss {
   background: linear-gradient(90deg, rgba(255, 0, 0, 0.055), rgba(255, 0, 0, 0))
}

.match-container {
   font-size: 0.9rem;
   border-top: 1px solid rgba(255, 255, 255, 0.1)
}

.match-cell {
   /* width: 109px; */
   width: 104.91px;
}
</style>