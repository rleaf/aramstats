<script>
import Champion from '../Champion.vue'
import Dropdown from '../Dropdown.vue'

// import OverviewPanel from '../Panels/OverviewPanel.vue'
// import ChampionPanel from '../Panels/ChampionPanel.vue'
// import ChallengePanel from '../Panels/ChallengePanel.vue'

import ListPanel from '../Panels/ListPanel.vue'
import SummonerPanel from '../Panels/SummonerPanel.vue'
import ChampionPanel from '../Panels/ChampionPanel.vue'

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
      // OverviewPanel,
      // ChampionPanel,
      // ChallengePanel,
      ListPanel,
      SummonerPanel,
      ChampionPanel,
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
         summonerStats: {
            totalMatches: 0,
            totalWins: 0,
            killParticipation: 0,
            kda: [0, 0, 0],
            multiKills: {
               triple: 0,
               quadra: 0,
               penta: 0
            },
         },
      }
   },

   created() {
      this.iterate()
   },

   methods: {
      async updateSummoner() {
         this.isDisabled = true
         const url = `/api/summoners/update/${this.$route.params.region}/${this.$route.params.username}`

         this.refresh = 'Updating...'
         let res = await axios.put(url)
         this.championInfo = res.data.slice(1)
         this.challengeInfo = res.data[0].challenges

         // Rerender champ list
         this.updateKey += 1

         // Re-enable button
         this.isDisabled = false

         // Set button back to 'update'
         this.refresh = 'Update'
      },

      iterate() {
         for (const champ of this.championInfo) {
            this.summonerStats.totalMatches += champ.totalGames
            this.summonerStats.totalWins += champ.wins

            this.summonerStats.kda[0] += champ.averageKills
            this.summonerStats.kda[1] += champ.averageDeaths
            this.summonerStats.kda[2] += champ.averageAssists

            this.summonerStats.killParticipation += champ.averageKillParticipation

            this.summonerStats.multiKills.triple += champ.totalTripleKills
            this.summonerStats.multiKills.quadra += champ.totalQuadraKills
            this.summonerStats.multiKills.penta += champ.totalPentaKills
         }
         this.summonerStats.kda = this.summonerStats.kda.map(x => Math.round(x / this.championInfo.length * 10) / 10)
      },
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
      },

      winrate() {
         return `${Math.round((this.summonerStats.totalWins / this.summonerStats.totalMatches) * 1000) / 10}%`
      },

      kda() {
         // console.log(this.championInfo)
         // if (!this.championInfo.averageKills) return '-'
         // return `${this.summonerStats.kda.kills / this.championInfo.length}/${this.summonerStats.kda.deaths / this.championInfo.length}/${this.summonerStats.kda.assists / this.championInfo.length}`
         return `${this.summonerStats.kda[0]} / ${this.summonerStats.kda[1]} / ${this.summonerStats.kda[2]}`
      },

      // kdr() {
      //    if (!this.champion.averageKills) return '-'
      //    return `${Math.round(((this.champion.averageKills + this.champion.averageAssists) / this.champion.averageDeaths) * 100) / 100}`
      // },

      killParticipation() {
         return `${Math.round(this.summonerStats.killParticipation / this.championInfo.length * 10) / 10}%`
      },

      background() {
         return `background: radial-gradient(circle at 50% -110%, transparent, #262933 90%), no-repeat center 70% url('${this.profile.IconId}');
                 background-size: 380px;`
      },
   },
   
   props: {
      userInfo: Object
   }
}
</script>

<template>
   <div class="user-ready-main">
      <div class="lhs">
         <div class="profile">
            <div class="name-wrapper" :style="background">
               <img class="pfp" :src=profile.IconId  alt="">
               <div>
                  {{ this.profile.name }}
                  <button :disabled="isDisabled" @click="updateSummoner()">
                     {{ this.refresh }}
                  </button>
               </div>
               <img class="bongo-cat" :src="bongocat" v-show="this.isDisabled">
            </div>
            <div class="summ-stats">
               <div class="1">
                  <h3>Winrate</h3>
                  {{ winrate }}
               </div>
               <div class="2">
                  <h3>KDA</h3>
                  {{ kda }}
               </div>
               <div class="3">
                  <h3>Wins / Total</h3>
                  {{ this.summonerStats.totalWins }} / {{ this.summonerStats.totalMatches }}
               </div>
               <div class="4">
                  <h3>Kill Participation</h3>
                  {{ killParticipation }}
               </div>
            </div>
            <div class="summ-mk">
               <div class="triple">
                  {{ this.summonerStats.multiKills.triple }}
               </div>
               <div class="quadra">
                  {{ this.summonerStats.multiKills.quadra }}
               </div>
               <div class="penta">
                  {{ this.summonerStats.multiKills.penta }}
               </div>
            </div>
         </div>
         <div class="history">
            <h4>.</h4>
         </div>
      </div>
      <div class="rhs">
         <div class="sections">
            <div class="section-tab" 
            :class="{ active: this.panel === 0}"
            @click="this.panel = 0">
               List
            </div>
            <div class="section-tab" 
            :class="{ active: this.panel === 1}"
            @click="this.panel = 1">
               Summoner
            </div>
            <div class="section-tab" 
            :class="{ active: this.panel === 2}"
            @click="this.panel = 2">
               Champion
            </div>
         </div>
         <div class="panel" v-show="this.panel === 0">
            <ListPanel :info="this.championInfo" />
         </div>
         <div class="panel" v-show="this.panel === 1">
            <SummonerPanel 
               :championData="this.championInfo"
               :challengeData="this.challengeInfo" 
               :totalMatches="this.summonerStats.totalMatches" />
         </div>
         <div class="panel" v-show="this.panel === 2">
            <ChampionPanel :data="this.championInfo"/>
         </div>
      </div>
   </div>
</template>

<style scoped>

.user-ready-main {
   display: flex;
   width: 100%;
   justify-content: center;
   gap: 30px;
   margin-top: 10vh;
   color: var(--color-font);
}

.lhs {
   display: flex;
   flex-direction: column;
   width: 380px;
   gap: 30px;
}

.rhs {
   display: flex;
   flex-direction: column;
   /* background: var(--lightN100); */
   width: 760px;
}

.sections {
   display: flex;
   gap: 10px;
}

.section-tab:hover {
   cursor: pointer;
}

.active {
   background: var(--light1000);
}

.section-tab {
   padding: 0.75rem 1rem;
   font-weight: bold;
   border-radius: 15px;
   /* https://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting */
   -webkit-touch-callout: none; /* iOS Safari */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Old versions of Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none;
}

.profile {
   background: var(--lightN100);
   border-radius: 15px;
}

.name-wrapper {
   padding: 30px;
   display: flex;
   align-items: center;
   gap: 25px;
   font-size: 1.8rem;
   font-weight: bold;
   border-radius: 15px;
} 

img.pfp {
   width: 100px;
   border-radius: 100%;
   box-shadow: 0 0 0 4px var(--color-background);
}

img.bongo-cat {
   position: absolute;
   width: 110px;
   transform: rotate(-15deg) translate(65px, 26px);
}

.img-bg {
   position: relative;
   /* width: 100%; */
   height: 0;
   opacity: 0.3;
}

.name-wrapper button {
   display: block;
   background: var(--color-background);
   border: none;
   height: 33px;
   width: 100px;
   color: var(--color-font);
   border-radius: 20px;
   margin-top: 10px;
   font-size: 1.05rem;
   /* transition: 0.25s; */
}

.name-wrapper button:hover {
   cursor: pointer;
}

.name-wrapper button[disabled] {
   background: var(--lightN100);
   /* filter: saturate(0.1); */
   cursor: wait;
}

.summ-stats {
   display: grid;
   width: 300px;
   grid-template-areas: 
   '1 2'
   '3 4';
   gap: 40px;
   margin: 0 auto;
   font-size: 1.5rem;
   font-weight: lighter;
   line-height: 1;
}

.summ-stats h3 {
   font-size: 1rem;
   margin-top: 0;
   margin-bottom: 5px;
}

.summ-mk div {
   background-repeat: no-repeat;
   background-position: center;
   text-align: center;
   line-height: 2;
}
.triple {
   background-image: url('../../assets/triangle.svg');
   background-size: 85%;
   width: 60px;
   filter: drop-shadow(0 0 3px rgba(2, 68, 80, 0.9));
}

.quadra {
   background-image: url('../../assets/diamond.svg');
   background-size: 75%;
   width: 60px;
   filter: drop-shadow(0 0 3px rgba(80, 2, 76, 0.9));
}

.penta {
   background-image: url('../../assets/pentagon.svg');
   background-size: 80%;
   width: 55px;
   filter: drop-shadow(0 0 3px rgba(80, 49, 2, 0.9));
}

.summ-mk {
   padding: 40px 20px;
   display: flex;
   font-size: 1.5rem;
   font-weight: medium;
   text-shadow: rgba(0, 0, 0, 0.5) 2px 2px 1px;
   justify-content: space-around;
}

.history {
   display: flex;
   justify-content: center;
   background: var(--lightN100);
   border-radius: 15px;
}


.bongo-cat {
   padding-left: 50px;
   height: 90px;
}
</style>