<script>
import Champion from '../Champion.vue'
import Histogram from '../Histogram.vue'
import axios from 'axios'

export default {
   components: {
      Champion,
      Histogram,
   },
   data() {
      return {
         championInfo: this.userInfo,
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
         championFilter: '',
         championFocus: '',
         champSearchFocus: false,
         championBook: []
      }
   },

   mounted() {
      for (let i = 0; i < this.championInfo.length; i++) {
         if ('championName' in this.championInfo[i]) {
            if (this.championInfo[i].trueChampionName) {
               this.championBook.push(this.championInfo[i].trueChampionName)
            } else {
               this.championBook.push(this.championInfo[i].championName)
            }
         }
      }
      this.championBook.sort((a, b) => a.localeCompare(b))
   },
   computed: {
      sortedChamps() {
         switch (this.selected) {
            case 'Champion':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => a.championName.localeCompare(b.championName)):
                  this.championInfo.slice(1).sort((a, b) => b.championName.localeCompare(a.championName))
            case 'Total Games':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.totalGames - a.totalGames):
                  this.championInfo.slice(1).sort((a, b) => a.totalGames - b.totalGames)
            case 'Wins':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.wins - a.wins):
                  this.championInfo.slice(1).sort((a, b) => a.wins - b.wins)
            case 'Average Damage':
               if (this.dmgDpmState < 2) {
                  return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageTotalDamageDealt - a.averageTotalDamageDealt):
                  this.championInfo.slice(1).sort((a, b) => a.averageTotalDamageDealt - b.averageTotalDamageDealt)
               } else {
                  return (this.order) ?
                     this.championInfo.slice(1).sort((a, b) => b.averageDamagePerMinute - a.averageDamagePerMinute) :
                     this.championInfo.slice(1).sort((a, b) => a.averageDamagePerMinute - b.averageDamagePerMinute)
               }
            case 'Average Healing':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageTotalHeal - a.averageTotalHeal):
                  this.championInfo.slice(1).sort((a, b) => a.averageTotalHeal - b.averageTotalHeal)
            case 'Average Healing to Teammates':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageHealingOnTeammates - a.averageHealingOnTeammates):
                  this.championInfo.slice(1).sort((a, b) => a.averageHealingOnTeammates - b.averageHealingOnTeammates)
            case 'Average Damage Taken':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageTotalDamageTaken - a.averageTotalDamageTaken):
                  this.championInfo.slice(1).sort((a, b) => a.averageTotalDamageTaken - b.averageTotalDamageTaken)
            case 'Average Self Mitigated Damage':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageTotalSelfMitigated - a.averageTotalSelfMitigated):
                  this.championInfo.slice(1).sort((a, b) => a.averageTotalSelfMitigated - b.averageTotalSelfMitigated)
            case 'Average KDA':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageKDA - a.averageKDA):
                  this.championInfo.slice(1).sort((a, b) => a.averageKDA - b.averageKDA)
            case 'Average Gold':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.averageGoldEarned - a.averageGoldEarned):
                  this.championInfo.slice(1).sort((a, b) => a.averageGoldEarned - b.averageGoldEarned)
            case 'Triple kills':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.totalTripleKills - a.totalTripleKills):
                  this.championInfo.slice(1).sort((a, b) => a.totalTripleKills - b.totalTripleKills)
            case 'Quadra kills':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.totalQuadraKills - a.totalQuadraKills):
                  this.championInfo.slice(1).sort((a, b) => a.totalQuadraKills - b.totalQuadraKills)
            case 'Penta kills':
               return (this.order) ?
                  this.championInfo.slice(1).sort((a, b) => b.totalPentaKills - a.totalPentaKills):
                  this.championInfo.slice(1).sort((a, b) => a.totalPentaKills - b.totalPentaKills)
            default:
               return this.championInfo.slice(1).sort((a, b) => b.totalGames - a.totalGames)
         }
      },

      champSearchList() {
         return this.championBook.filter(champ => {
            return champ.toLowerCase().includes(this.championFilter.toLowerCase())
         })
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

      sortDo(x) {
         if (this.order) {
            return this.userInfo.slice(1).sort((a, b) => a.championName.localeCompare(b.championName))
         } else {
            return this.userInfo.slice(1).sort((a, b) => b.championName.localeCompare(a.championName))
         }
      },

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

      championSearch() {
         if (this.championFilter != '') {
            this.championFilter = ''
         }
         this.champSearchFocus = true
      },

      selectChampion(champion) {
         this.championFocus = champion
         this.championFilter = champion
         this.champSearchFocus = false
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
         </div>
         <div class="danger-zone">
            <div class="purge-wrapper" @mouseover="hover = true" @mouseleave="hover = false">
               <a class="purge" @click="deleteSummoner()" >
                  Delete
               </a>
            </div>
         </div>
         <span v-if="hover" class="purge-tooltip">
            Older parses in the database may not store recently added stats.
            Click this if you'd like to delete your summoner from the database.
            You will have to search your profile again.
            <br><br>
            Confirmation will appear after clicking.
         </span>
         <div class="champion-search">
            <input 
               type="text"
               placeholder="Search champion"
               v-model="championFilter"
               @click="championSearch"
               @keyup.esc="champSearchFocus = false">
            <div class="champion-search-list" v-show="champSearchFocus">
               <div class="champion-search-select" v-for="champ in champSearchList"
                  :key="champ"
                  @click="selectChampion(champ)">
                  {{ champ }}
               </div>
            </div>
            <div class="outside-search" v-show="champSearchFocus"
               @click="champSearchFocus = false"></div>
         </div>
         <Histogram 
            :data="this.championInfo"
            :championFilter="this.championFocus"/>
      </div>
      <div class="stats-main">
         <div class="sorting-by">
            Sorting by: {{ sortingBy() }}
         </div>
         <div class="headers">
            <div class='champ-name header' @click="sortProc('Champion')">Champion</div>
            <div class='total-games header' @click="sortProc('Total Games')">Total Games</div>
            <div class='wins header' @click="sortProc('Wins')">Wins</div>
            <div class='avg-dmg header' @click="avgDmgDpm('Average Damage')">avg Dmg</div>
            <div class='avg-healing header' @click="sortProc('Average Healing')">avg Heal</div>
            <div class='avg-healing-to-teammates header' @click="sortProc('Average Healing to Teammates')">avg HtT</div>
            <div class='avg-dt header' @click="sortProc('Average Damage Taken')">avg DT</div>
            <div class='avg-mit header' @click="sortProc('Average Self Mitigated Damage')">avg Mit</div>
            <div class='avg-kda header' @click="sortProc('Average KDA')">avg KDA</div>
            <div class='avg-gold header' @click="sortProc('Average Gold')">avg Gold</div>
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
         </div>
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

.outside-search {
   position: fixed;
   z-index: 1;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
}

.champion-search {
   margin-top: 50px;
   margin-left: 50px;
}
.champion-search input {
   background: var(--search-bar);
   color: var(--color-font-search);
   padding: 0.5rem 0.8rem;
   border: 1px solid var(--color-font);
   border-radius: 5px;
   width: 150px;
}
.champion-search input:focus {
   outline: none;
   background: white;
}

.champion-search-select {
   padding-bottom: 5px;
}

.champion-search-list {
   position: absolute;
   margin-top: 2px;
   z-index: 2;
   background: #313131;
   color: var(--color-font);
   padding: 0.5rem 0.8rem;
   width: 150px;
   height: 150px;
   overflow-y: scroll;
}

.champion-search-list::-webkit-scrollbar-track {
   background-color: #404040;
}
.champion-search-list::-webkit-scrollbar {
   width: 18px;
}
.champion-search-list::-webkit-scrollbar-thumb {
   border-radius: 2px;
   box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
   background-color: #737272;
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
   height: 2rem;
   display: flex;
   align-items: center;
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
   padding-left: 45px;
   gap: 20px;
   font-size: 1.5rem;
   color: var(--color-font);
}
.danger-zone {
   display: flex;
   justify-content: flex-end;
   margin-top: -34px;
   padding-right: 45px;
}

.purge-wrapper a {
   font-size: 1rem;
   color: var(--color-font);
   border: 1px solid var(--color-font);
   border-radius: 5px;
   cursor: pointer;
   padding: 4px 9px;
}

.purge-tooltip {
   float: right;
   padding-top: 10px;
   width: 400px;
   font-size: 0.9rem;
   text-align: end;
   color: var(--color-font);
}
.pfp {
   border-radius: 100%;
   width: 90px;
}
</style>