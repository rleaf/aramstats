<script>
import Champion from '../Champion.vue'
import Dropdown from '../Dropdown.vue'
import OverviewPanel from '../Panels/OverviewPanel.vue'
import ChampionPanel from '../Panels/ChampionPanel.vue'
import ChallengePanel from '../Panels/ChallengePanel.vue'
import Histogram from '../Histogram.vue'
import ChampSearch from '../ChampSearch.vue'
import Danger from '../Danger.vue'
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
      Danger
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
         profileSection: 0,
         sortFocus: false,
         sortOptions: [
            {
               key: 'Main',
               values: ['Total Games', 'Champion', 'Wins']
            },
            {
               key: 'Damage',
               values: ['Damage', 'DPM']
            },
            {
               key: 'Heal',
               values: ['Healing', 'HPM', 'Ally Healing', 'Ally HPM']
            },
            {
               key: 'Tank',
               values: ['Damage Taken', 'DTPM', 'Damage Mitigated', 'DMPM']
            },
            {
               key: 'Multikills',
               values: ['Triple kills', 'Quadra kills', 'Penta kills']
            },
            {
               key: 'Misc',
               values: ['Gold', 'GPM']
            },
            
         ]
      }
   },

   computed: {
      sortedChamps() {
         /* 
         * Please figure out a better way to deal with this.
         */
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
            case 'Damage':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageTotalDamageDealt - a.averageTotalDamageDealt):
                  this.championInfo.sort((a, b) => a.averageTotalDamageDealt - b.averageTotalDamageDealt)
            case 'DPM':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageDamagePerMinute - a.averageDamagePerMinute) :
                  this.championInfo.sort((a, b) => a.averageDamagePerMinute - b.averageDamagePerMinute)
            case 'Healing':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageTotalHeal - a.averageTotalHeal):
                  this.championInfo.sort((a, b) => a.averageTotalHeal - b.averageTotalHeal)
            case 'HPM':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageHealingPerMinute - a.averageHealingPerMinute):
                  this.championInfo.sort((a, b) => a.averageHealingPerMinute - b.averageHealingPerMinute)
            case 'Ally Healing':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageHealingOnTeammates - a.averageHealingOnTeammates):
                  this.championInfo.sort((a, b) => a.averageHealingOnTeammates - b.averageHealingOnTeammates)
            case 'Ally HPM':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageAllyHealPerMinute - a.averageAllyHealPerMinute):
                  this.championInfo.sort((a, b) => a.averageAllyHealPerMinute - b.averageAllyHealPerMinute)
            case 'Damage Taken':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageTotalDamageTaken - a.averageTotalDamageTaken):
                  this.championInfo.sort((a, b) => a.averageTotalDamageTaken - b.averageTotalDamageTaken)
            case 'Damage Mitigated':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageTotalSelfMitigated - a.averageTotalSelfMitigated):
                  this.championInfo.sort((a, b) => a.averageTotalSelfMitigated - b.averageTotalSelfMitigated)
            case 'Gold':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageGoldEarned - a.averageGoldEarned):
                  this.championInfo.sort((a, b) => a.averageGoldEarned - b.averageGoldEarned)
            case 'GPM':
               return (this.order) ?
                  this.championInfo.sort((a, b) => b.averageGoldPerMinute - a.averageGoldPerMinute):
                  this.championInfo.sort((a, b) => a.averageGoldPerMinute - b.averageGoldPerMinute)
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
      }
   },

   props: {
      userInfo: Object
   },

   methods: {
      sortProc(x) {
         // (x == this.selected) ? (this.order = !this.order):
         this.selected = x
      },

      sortOrder() {
         this.order = !this.order
      },

      sortSection(x) {
         if (x === 'test') return true
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

      async refreshSummoner() {
         this.isDisabled = true
         const url = `/api/summoners/update/${this.$route.params.region}/${this.$route.params.username}`

         this.refresh = 'Updating...'
         let res = await axios.get(url)
         this.championInfo = res.data.slice(1)

         // Rerender champ list
         this.championKey += 1

         // Re-enable button
         this.isDisabled = false

         // Set button back to 'update'
         this.refresh = 'Update'
      },
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
            <Danger />
            <!-- <div class="danger-zone">
               <span style="color: var(--color-font); padding-right: 15px; font-size: 0.9rem;">old data? -></span> 
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
                  <u>Night Owl</u> on NA will always be UTD for reference.
                  <br><br>
                  Confirmation will appear after clicking.
               </span>
            </div> -->
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
         <div class="sort">
            <button class="sort-button" @click="this.sortFocus = true" @blur="this.sortFocus = false">Sort by: {{ this.selected || 'Total Games'}}</button>
            <button class="order-button" @click="sortOrder()">{{ this.order ? ('Descending') : ('Ascending') }}</button>

            <div class="sort-dropdown" v-show="this.sortFocus">
               <!-- <div :class="{ section: sortSection(option)}" class="sort-item" @mousedown="sortProc(option)"
               v-for="(option, i) in sortOptions" :key="i">
                  {{ option || '-' }}
               </div> -->
               <div v-for="(option, i) in sortOptions" :key="i">
                  <div class="sort-key">
                     {{ option.key || '-' }}
                  </div>
                  <div class="sort-item" v-for="value in option.values" :key="value" @mousedown="sortProc(value)">
                     {{ value }}
                  </div>
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

.sort button {
   border: 1px solid var(--champion-filter-list-hover);
   border-radius: 4px;
   font-size: 15px;
   background: transparent;
   color: var(--color-font);
   padding: 5px;
   cursor: pointer;
}

.sort button:hover {
   background: var(--champion-filter-list-hover);
}

button.order-button {
   margin-left: 10px;
}
.sort-button:focus {
   background: var(--champion-filter-list-hover);
   outline: none;
}

.sort-dropdown {
   position: absolute;
   /* width: 200px; */
   background: var(--champion-filter-list);
   z-index: 5;
   margin-bottom: 50px;
}

.sort-key {
   padding-left: 15px;
   text-decoration: underline;
   font-weight: 500;
   padding-top: 5px;
   color: var(--blue600t);
}
.sort-item {
   transition: 0.1s;
   color: var(--color-font);
   font-size: 14px;
   padding: 8px 12px;
   cursor: pointer;
}

.sort-item:hover {
   background: var(--champion-filter-list-hover);
}

.sort {
   color: var(--color-font);
   padding-bottom: 10px;
}

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




.pfp {
   border-radius: 100%;
   width: 90px;
}
</style>