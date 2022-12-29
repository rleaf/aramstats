<script>
import { isIntegerKey } from '@vue/shared'
import Champion from '../Champion.vue'
import axios from 'axios'

export default {
   components: {
      Champion
   },
   data() {
      return {
         championInfo: this.userInfo,
         profile: {
            IconId: `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/${this.userInfo[0].profileIconId}.png`,
            name: this.userInfo[0].name
         },
         selected: String,
         refresh: 'Refresh',
         order: true,
         championKey: 0,
      }
   },

   mounted() {
      // this.userInfo.shift()
   },

   computed: {
      sortedChamps() {
         switch (this.selected) {
            case 'champion':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => a.championName.localeCompare(b.championName)):
                  this.championInfo.slice(1).sort((a, b) => b.championName.localeCompare(a.championName))
            case 'totalGames':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.totalGames - a.totalGames):
                  this.championInfo.slice(1).sort((a, b) => a.totalGames - b.totalGames)
            case 'wins':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.wins - a.wins):
                  this.championInfo.slice(1).sort((a, b) => a.wins - b.wins)
            case 'avgDmg':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageTotalDamageDealt - a.averageTotalDamageDealt):
                  this.championInfo.slice(1).sort((a, b) => a.averageTotalDamageDealt - b.averageTotalDamageDealt)
            case 'avgHeal':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageHealingOnTeammates - a.averageHealingOnTeammates):
                  this.championInfo.slice(1).sort((a, b) => a.averageHealingOnTeammates - b.averageHealingOnTeammates)
            case 'avgDmgTake':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageTotalDamageTaken - a.averageTotalDamageTaken):
                  this.championInfo.slice(1).sort((a, b) => a.averageTotalDamageTaken - b.averageTotalDamageTaken)
            case 'avgKDA':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageKDA - a.averageKDA):
                  this.championInfo.slice(1).sort((a, b) => a.averageKDA - b.averageKDA)
            case 'avgGold':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageGoldEarned - a.averageGoldEarned):
                  this.championInfo.slice(1).sort((a, b) => a.averageGoldEarned - b.averageGoldEarned)
            case 'tripleKills':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.totalTripleKills - a.totalTripleKills):
                  this.championInfo.slice(1).sort((a, b) => a.totalTripleKills - b.totalTripleKills)
            case 'quadraKills':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.totalQuadraKills - a.totalQuadraKills):
                  this.championInfo.slice(1).sort((a, b) => a.totalQuadraKills - b.totalQuadraKills)
            case 'pentaKills':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.totalPentaKills - a.totalPentaKills):
                  this.championInfo.slice(1).sort((a, b) => a.totalPentaKills - b.totalPentaKills)
            default:
               return this.championInfo.slice(1).sort((a, b) => b.totalGames - a.totalGames)
         }
      }
   },
   props: {
      userInfo: Object
   },

   methods: {
      sortProc(x) {
         (x == this.selected) ? (this.order = !this.order):
         this.selected = x
      },

      sortDo(x) {
         if (this.order) {
            return this.userInfo.slice(1).sort((a, b) => a.championName.localeCompare(b.championName))
         } else {
            return this.userInfo.slice(1).sort((a, b) => b.championName.localeCompare(a.championName))
         }
      },

      everyOther(i) {
         return (i % 2 == 0) ? `style-0` : `style-1`
      },

      rerender() {
         this.championKey += 1
      },

      async refreshSummoner() {

         const url = `http://localhost:5000/api/summoners/${this.$route.params.region}/${this.$route.params.username}`

         this.refresh = 'Updating'
         await axios.get(url)
            .then((res) => {
               this.championInfo = res.data
            })
            .then(() => {
               this.rerender()
            })
            .then(() => {
               this.refresh = 'Refresh'
            })
      }
   }

}
</script>

<template>
   <div class="user-ready-main">
      <!-- {{ this.userInfo }} -->
      <div class="profile-landing">
         <div class="profile-name">
            <img class="pfp" :src=profile.IconId  alt="">
            <div>
               {{ this.profile.name }}

               <div class="refresh">
                  <a @click="refreshSummoner()">
                     {{ this.refresh }}
                  </a>
               </div>
            </div>
         </div>
      </div>
      <div class="stats-main">
         <div class="headers">
            <div class='champ-name-header' @click="sortProc('champion')">Champion</div>
            <div class='total-games-header' @click="sortProc('totalGames')">Total Games</div>
            <div class='wins-header' @click="sortProc('wins')">Wins</div>
            <div class='avg-dmg-header' @click="sortProc('avgDmg')">avg Dmg</div>
            <div class='avg-healing-header' @click="sortProc('avgHeal')">avg Heal</div>
            <div class='avg-dt-header' @click="sortProc('avgDmgTake')">avg DT</div>
            <div class='avg-kda-header' @click="sortProc('avgKDA')">avg KDA</div>
            <div class='avg-gold-header' @click="sortProc('avgGold')">avg Gold</div>
            <div class='triple-kills-header' @click="sortProc('tripleKills')">Triple Kills</div>
            <div class='quadra-kills-header' @click="sortProc('quadraKills')">Quadra Kills</div>
            <div class='penta-kills-header' @click="sortProc('pentaKills')">Penta Kills</div>
         </div>
         <div :key="this.championKey">
            <!-- <transition-group name="flip-list">
            </transition-group> -->
            <Champion v-for="(champ, i) in sortedChamps"
            :key="champ.championName"
            :champion=champ
            :class="everyOther(i)"
            />
         </div>
      </div>
   </div>
</template>

<style scoped>
/* .flip-list-move {
   transition: transform 0.5s;
} */
.headers {
   padding-left: 46px;
   height: 2rem;
   /* padding-bottom: 8px; */
   display: flex;
   align-items: center;
   /* gap: 1%; */

}

.headers > div {
   width: 109px;
   /* font-weight: bold; */
   color: var(--light2);
}

.headers > div:hover {
   text-decoration: underline;
   color: var(--light1);
   cursor: pointer;
}

/* .headers > div:hover p {
   cursor: pointer;
} */
.refresh {
   /* padding-left: 45px;
   padding-top: 45px; */
   /* color: var(--light1); */
}

.refresh a {
   font-size: 1rem;
   border: 1px solid var(--light1);
   border-radius: 5px;
   cursor: pointer;
   padding: 4px 9px;

}

.user-ready-main {
   /* margin: 0 15vw 0 15vw; */
   margin-left: auto;
   margin-right: auto;
   max-width: 1200px;

}

.stats-main {
   display: block;
}

.profile-landing {
   /* background: #363636; */
   display: block;
   border-radius: 3px;
   width: 100%;
   height: 250px;
}

.profile-name {
   display: flex;
   /* width: 150px; */
   justify-content: left;
   align-items: center;
   gap: 20px;
   padding-top: 45px;
   padding-left: 45px;
   font-size: 1.5rem;
   color: white;
}

.pfp {
   border-radius: 100%;
   width: 90px;
}
</style>