<script>
import Champion from '../Champion.vue'
import Dropdown from '../Dropdown.vue'
import OverviewPanel from '../Panels/OverviewPanel.vue'
import ChampionPanel from '../Panels/ChampionPanel.vue'
import ChallengePanel from '../Panels/ChallengePanel.vue'
import Histogram from '../Histogram.vue'
import ChampSearch from '../ChampSearch.vue'
import axios from 'axios'

export default {
   components: {
      Champion,
      Dropdown,
      Histogram,
      ChampSearch,
      OverviewPanel,
      ChampionPanel,
      ChallengePanel,
   },
   data() {
      return {
         championInfo: this.userInfo.slice(1),
         profile: {
            IconId: `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/${this.userInfo[0].profileIconId}.png`,
            name: this.userInfo[0].name
         },
         selected: 'Total Games',
         refresh: 'Update',
         order: true,
         dmgDpmState: 0,
         championKey: 0,
         isDisabled: false,
         hover: null,
         profileSection: 0,
         championFilter: null
      }
   },

   computed: {
      sortedChamps() {
         switch (this.selected) {
            case 'Champion':
               return (this.order) ?
                  this.championInfo.sort((a, b) => a.championName.localeCompare(b.championName)):
                  this.championInfo.sort((a, b) => b.championName.localeCompare(a.championName))
            case 'Total Games':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.totalGames - a.totalGames):
                  this.championInfo.sort((a, b) => a.totalGames - b.totalGames)
            case 'Wins':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.wins - a.wins):
                  this.championInfo.sort((a, b) => a.wins - b.wins)
            case 'Average Damage':
               if (this.dmgDpmState < 2) {
                  return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageTotalDamageDealt - a.averageTotalDamageDealt):
                  this.championInfo.sort((a, b) => a.averageTotalDamageDealt - b.averageTotalDamageDealt)
               } else {
                  return (this.order) ?
                     this.championInfo.sort((a, b) => b.averageDamagePerMinute - a.averageDamagePerMinute) :
                     this.championInfo.sort((a, b) => a.averageDamagePerMinute - b.averageDamagePerMinute)
               }
            case 'Average Healing':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageTotalHeal - a.averageTotalHeal):
                  this.championInfo.sort((a, b) => a.averageTotalHeal - b.averageTotalHeal)
            case 'Average Healing to Teammates':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageHealingOnTeammates - a.averageHealingOnTeammates):
                  this.championInfo.sort((a, b) => a.averageHealingOnTeammates - b.averageHealingOnTeammates)
            case 'Average Damage Taken':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageTotalDamageTaken - a.averageTotalDamageTaken):
                  this.championInfo.sort((a, b) => a.averageTotalDamageTaken - b.averageTotalDamageTaken)
            case 'Average Self Mitigated Damage':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageTotalSelfMitigated - a.averageTotalSelfMitigated):
                  this.championInfo.sort((a, b) => a.averageTotalSelfMitigated - b.averageTotalSelfMitigated)
            case 'Average Gold':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageGoldEarned - a.averageGoldEarned):
                  this.championInfo.sort((a, b) => a.averageGoldEarned - b.averageGoldEarned)
            case 'Triple kills':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.totalTripleKills - a.totalTripleKills):
                  this.championInfo.sort((a, b) => a.totalTripleKills - b.totalTripleKills)
            case 'Quadra kills':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.totalQuadraKills - a.totalQuadraKills):
                  this.championInfo.sort((a, b) => a.totalQuadraKills - b.totalQuadraKills)
            case 'Penta kills':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.totalPentaKills - a.totalPentaKills):
                  this.championInfo.sort((a, b) => a.totalPentaKills - b.totalPentaKills)
            default:
               return this.championInfo.sort((a, b) => b.totalGames - a.totalGames)
         }
      },
   },

   props: {
      userInfo: Object
   },

   methods: {
      sortProc(x) {
         (x == this.selected) ? (this.order = !this.order):
         this.selected = x
      },

      // sortDo(x) {
      //    if (this.order) {
      //       return this.championInfo.sort((a, b) => a.championName.localeCompare(b.championName))
      //    } else {
      //       return this.championInfo.sort((a, b) => b.championName.localeCompare(a.championName))
      //    }
      // },

      sortingBy() {
         if (this.selected == 'Average Damage') {
            if (this.dmgDpmState == 2 || this.dmgDpmState == 1) {
               return 'Average Damage'
            } else {
               return 'Damage per minute'
            }
         }

         return this.selected
      },

      avgDmgDpm(x) {
         (this.dmgDpmState == 3) ? this.dmgDpmState = 0 : this.dmgDpmState++
         this.sortProc(x)
      },

      async refreshSummoner() {
         this.isDisabled = true
         const url = `/api/summoners/update/${this.$route.params.region}/${this.$route.params.username}`

         this.refresh = 'Updating...'
         await axios.get(url)
            .then((res) => {
               this.championInfo = res.data
            })
            .then(() => {
               this.championKey += 1
            })
            .then(() => {
               this.isDisabled = false
               this.refresh = 'Update'
            })
      },

      async deleteSummoner() {
         const url = `/api/summoners/delete/${this.$route.params.region}/${this.$route.params.username}`
         const text =  `
         Remove summoner from database?
         `

         if (confirm(text)) {
            try {
               await axios.get(url)
            } catch (e) {
               console.log('delete', e)
            }
            this.$router.push({name: `home`})
         }
         
      }
   }

}
</script>

<template>
   <div class="user-ready-main">
      <div class="profile-landing">
         <div class="profile-name">
            <img class="pfp" :src=profile.IconId  alt="">
            <div>
               {{ this.profile.name }}

               <div class="refresh-button">
                  <a :class="{ disable: this.isDisabled }" @click="refreshSummoner()">
                     {{ this.refresh }}
                  </a>
               </div>
            </div>
            <div class="danger-zone">
               <span style="color: var(--color-font); padding-right: 15px; font-size: 0.9rem;">hmm? -></span> 
               <a class="purge" @mouseover="hover = true" @mouseleave="hover = false" @click="deleteSummoner()" >
                  Delete
               </a>
               <div class="purge-wrapper" >
               </div>
               <span v-if="hover" class="purge-tooltip">
                  If you're seeing missing information, it is hopefully only because I made changes since the
                  last time you parsed your summoner.
                  <br><br>
                  Older parses in the database may not store recently added stats and/or the 
                  frontend may not be able to properly read recent variations made to the API.
                  Click this if you'd like to delete your summoner from the database.
                  You will have to search your profile again.
                  <br><br>
                   For reference, you can check out <u>Night Owl</u> on NA which will always be UTD.
                  <br><br>
                  Confirmation will appear after clicking.
               </span>
            </div>
         </div>
         <div class="profile-wrapper">
            <div class="profile-sections">
               <div class="summoner-profile-tab"
                  :class="{ 'active-tab': this.profileSection == 0 }"
                  @click="this.profileSection = 0">
                  Overview
               </div>
               <div class="summoner-profile-tab"
                  :class="{ 'active-tab': this.profileSection == 1 }"
                  @click="this.profileSection = 1">
                  Champion
               </div>
               <div class="summoner-profile-tab"
                  :class="{ 'active-tab': this.profileSection == 2 }"
                  @click="this.profileSection = 2">
                  Challenges
               </div>
            </div>
            <div class="profile" v-show="this.profileSection == 0">
               <OverviewPanel :data="this.championInfo" />
            </div>
            <div class="profile" v-show="this.profileSection == 1">
               <ChampionPanel :data="this.championInfo"/>
            </div>
            <div class="profile" v-show="this.profileSection == 2">
               <ChallengePanel :data="this.championInfo"/>
            </div>
         </div>
      </div>
      <div class="stats-main">
         <div class="sorting-by">
            <!-- Sorting by: {{ sortingBy() }} -->
            Sort by
         
         </div>
         <!-- <div class="headers">
            <div class='champ-name header' @click="sortProc('Champion')">Champion</div>
            <div class='total-games header' @click="sortProc('Total Games')">Games</div>
            <div class='wins header' @click="sortProc('Wins')">Wins</div>
            <div class='avg-dmg header' @click="avgDmgDpm('Average Damage')">Damage</div>
            <div class='avg-healing header' @click="sortProc('Average Healing')">Healing</div>
            <div class='avg-healing-to-teammates header' @click="sortProc('Average Healing to Teammates')">Team <br>Healing</div>
            <div class='avg-dt header' @click="sortProc('Average Damage Taken')">Dmg Taken</div>
            <div class='avg-mit header' @click="sortProc('Average Self Mitigated Damage')">Dmg Mit</div>
            <div class='avg-kda header'>KDA</div>
            <div class='avg-gold header' @click="sortProc('Average Gold')">Gold</div>
            <div>
               <div class="tqp header" @click="sortProc('Triple kills')">
                  T
               </div>
               <div class="tqp header" @click="sortProc('Quadra kills')">
                  Q
               </div>
               <div class="tqp header" @click="sortProc('Penta kills')">
                  P
               </div>
            </div>
         </div> -->
         <div :key="this.championKey">
            <Champion v-for="(champ, i) in sortedChamps"
            :key="champ.championName"
            :champion=champ
            :class="(i % 2 == 0) ? `style-0` : `style-1`"
            />
         </div>
      </div>
   </div>
</template>

<style scoped>
@import url('../../assets/stats.css');


.profile-sections div {
   display: inline-block;
   color: var(--color-font-fade);
   margin-right: 10px;
   margin-bottom: 10px;
   padding: 0.5rem 0.8rem;
   background: var(--profile-tab);
   border-radius: 5px;
}
.profile-sections div:hover {
   background: var(--profile-tab-active);
   cursor: pointer;
}

.profile-sections .active-tab {
   background: var(--profile-tab-active);
   color: var(--color-font);
}

.profile-wrapper {
   /* padding-left: 45px; */
   padding-top: 45px;
}

.profile {
   height: 350px;
}

.disable {
   pointer-events: none;
}
.sorting-by {
   color: var(--color-font);
   padding-bottom: 1rem;
}


.headers {
   padding-left: 46px;
   padding-bottom: .4rem;
   height: 2rem;
   display: flex;
   align-items: flex-end;
}

.header:hover {
   text-decoration: underline;
   color: var(--color-font-hover);
   cursor: pointer;
}

.refresh-button a {
   font-size: 1rem;
   border: 1px solid var(--color-font);
   border-radius: 5px;
   cursor: pointer;
   padding: 4px 9px;
}

.user-ready-main {
   margin-left: auto;
   margin-right: auto;
   width: 1200px;
}

.stats-main {
   display: block;
   padding-top: 50px;
   padding-bottom: 10vh;
}

.profile-landing {
   display: block;
   border-radius: 3px;
   width: 100%;
}

.profile-name {
   display: flex;
   justify-content: left;
   align-items: center;
   padding-top: 45px;
   gap: 20px;
   font-size: 1.5rem;
   color: var(--color-font);
}
.danger-zone {
   position: relative;
   display: flex;
   margin-left: auto;
   align-items: center;
   padding-top: 38px;
}

.danger-zone a {
   font-size: 1rem;
   color: var(--color-font);
   border: 1px solid var(--color-font);
   border-radius: 5px;
   cursor: pointer;
   padding: 4px 9px;
}

.purge-tooltip {
   position: absolute;
   top: 75px;
   right: 0;
   padding: 0.5rem .7rem;
   border-radius: 5px;
   width: 500px;
   font-size: 0.9rem;
   background: var(--profile-panel);
   box-shadow: 3px 3px 5px 2px var(--profile-tab);
   color: var(--color-font);
}

.pfp {
   border-radius: 100%;
   width: 90px;
}
</style>