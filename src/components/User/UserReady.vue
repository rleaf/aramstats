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
         challengeInfo: this.userInfo[0].challenges,
         profile: {
            IconId: `http://ddragon.leagueoflegends.com/cdn/13.4.1/img/profileicon/${this.userInfo[0].profileIconId}.png`,
            name: this.userInfo[0].name
         },
         selected: 'Total Games',
         refresh: 'Update',
         order: true,
         updateKey: 0,
         isDisabled: false,
         panel: 0,
         sortFocus: false,
         sortOptions: [
            {
               key: 'Main',
               values: ['Total Games', 'Champion', 'Wins']
            },
            {
               key: 'Damage',
               values: ['Damage', 'DPM', 'Damage Share']
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
               values: ['Kill Participation', 'Gold', 'GPM']
            },
         ]
      }
   },

   computed: {
      sortedChamps() {
         const table = {
            'Champion': 'championName',
            'Total Games': 'totalGames',
            'Wins': 'wins',
            'Damage': 'averageTotalDamageDealt',
            'DPM': 'averageDamagePerMinute',
            'Healing': 'averageTotalHeal',
            'HPM': 'averageHealPerMinute',
            'Ally Healing': 'averageHealingOnTeammates',
            'Ally HPM': 'averageAllyHealPerMinute',
            'Damage Taken': 'averageTotalDamageTaken',
            'DTPM': 'averageDamageTakenPerMinute',
            'Damage Mitigated': 'averageTotalSelfMitigated',
            'DMPM': 'averageSelfMitigatedPerMinute',
            'Gold': 'averageGoldEarned',
            'GPM': 'averageGoldPerMinute',
            'Kill Participation': 'averageKillParticipation',
            'Damage Share': 'averageDamageShare',
            'Triple kills': 'totalTripleKills',
            'Quadra kills': 'totalQuadraKills',
            'Penta kills': 'totalPentaKills',
         }
         if (this.selected === 'Champion') {
            return (this.order) ?
            this.championInfo.sort((a, b) => a.championName.localeCompare(b.championName)) :
            this.championInfo.sort((a, b) => b.championName.localeCompare(a.championName))
         }
         
         const value = table[this.selected]

         return (this.order) ?
            this.championInfo.sort((a, b) => b[value] - a[value]) :
            this.championInfo.sort((a, b) => a[value] - b[value])
      },

      bongocat() {
         return new URL(`../../assets/bongo-cat.gif`, import.meta.url).href
      }
   },

   props: {
      userInfo: Object
   },

   methods: {
      async updateSummoner() {
         this.isDisabled = true
         const url = `/api/summoners/update/${this.$route.params.region}/${this.$route.params.username}`

         this.refresh = 'Updating...'
         let res = await axios.get(url)
         this.championInfo = res.data.slice(1)
         this.challengeInfo = res.data[0].challenges

         // Rerender champ list
         this.updateKey += 1

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
                  <a :class="{ disable: this.isDisabled }" @click="updateSummoner()">
                     {{ this.refresh }}
                  </a>
               </div>
            </div>
            <img class="bongo-cat" :src="bongocat" v-show="this.isDisabled">
            <!-- <img class="bongo-cat" :src="bongocat"> -->
            <Danger />
         </div>
         <div class="profile-wrapper">
            <div class="profile-sections">
               <div class="summoner-profile-tab"
                  :class="{ 'active-tab': this.panel == 0 }"
                  @click="this.panel = 0">
                  Overview
               </div>
               <div class="summoner-profile-tab"
                  :class="{ 'active-tab': this.panel == 1 }"
                  @click="this.panel = 1">
                  Champion
               </div>
               <div class="summoner-profile-tab"
                  :class="{ 'active-tab': this.panel == 2 }"
                  @click="this.panel = 2">
                  Challenges
               </div>
            </div>
            <div class="profile" v-show="this.panel == 0">
               <OverviewPanel :data="this.championInfo" />
            </div>
            <div class="profile" v-show="this.panel == 1">
               <ChampionPanel :data="this.championInfo"/>
            </div>
            <div class="profile" v-show="this.panel == 2" >
               <ChallengePanel :data="this.challengeInfo" :key="this.updateKey"/>
            </div>
         </div>
      </div>
      <div class="stats-main">
         <div class="sort">
            <button class="sort-button" @click="this.sortFocus = true" @blur="this.sortFocus = false">
               Sort by: {{ this.selected || 'Total Games'}}
            </button>
            <button class="order-button" @click="this.order = !this.order">
               {{ this.order ? ('Descending') : ('Ascending') }}
            </button>

            <div class="sort-dropdown" v-show="this.sortFocus">
            <!-- <div class="sort-dropdown"> -->
               <div v-for="(option, i) in sortOptions" :key="i">
                  <div class="sort-key">
                     {{ option.key || '-' }}
                  </div>
                  <div class="sort-item" v-for="value in option.values" :key="value" @mousedown="this.selected = value">
                     {{ value }}
                  </div>
               </div>
            </div>
         </div>
         <div :key="this.updateKey">
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

.bongo-cat {
   padding-left: 50px;
   height: 90px;
}

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
   border-radius: 5px;
   display: flex;
   width: 700px;
   justify-content: space-around;
   background: var(--champion-filter-list);
   z-index: 5;
   padding: 15px 10px;
}

.sort-key {
   text-decoration: underline;
   padding-bottom: 5px;
   font-weight: 500;
   /* padding-top: 20px; */
   color: var(--blue600t);
}
.sort-item {
   transition: 0.1s;
   color: var(--light700);
   font-size: 14px;
   line-height: 2;
   cursor: pointer;
}

.sort-item:hover {
   color: var(--color-font);
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