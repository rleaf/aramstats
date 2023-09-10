<script>
import Champion from '../Champion.vue'
import Dropdown from '../Dropdown.vue'
import MatchHistory from '../MatchHistory.vue'

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
      MatchHistory,
      Histogram,
      ChampSearch,
      ListPanel,
      SummonerPanel,
      ChampionPanel,
      Danger
   },

   watch: {
      $route: {
         immediate: true,
         handler() {
            document.title = `${this.response.name} | ARAM Stats`
         }
      }
   },

   data() {
      return {
         currentPatch: '',
         championData: this.response.championData,
         challengeInfo: this.response.challenges,
         profile: {
            // IconId: `http://ddragon.leagueoflegends.com/cdn/13.9.1/img/profileicon/${this.response.profileIconId}.png`,
            IconId: `http://ddragon.leagueoflegends.com/cdn/13.17.1/img/profileicon/${this.response.profileIcon}.png`,
            name: this.response.name
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
      this.summonerAverages()
      this.getCurrentPatch() 
      // Pull patch data from https://ddragon.leagueoflegends.com/api/versions.json

   },

   methods: {
      async getCurrentPatch() {
         const url = 'https://ddragon.leagueoflegends.com/api/versions.json'

         try {
            // this.currentPatch = (await axios.get(url)).data[0].split('.').slice(0, 2).join('.')
            this.currentPatch = (await axios.get(url)).data[0]
         } catch (e) {
            console.log(e, 'getCurrentPatch')
         }
      },

      async updateSummoner() {
         this.isDisabled = true
         const url = `/api/summoners/update/${this.$route.params.region}/${this.$route.params.username}`

         this.refresh = 'Updating...'
         let res = await axios.put(url)
         this.championData = res.data
         this.challengeInfo = res.data[0].challenges

         // Rerender champ list
         this.updateKey += 1

         // Re-enable button
         this.isDisabled = false

         // Set button back to 'update'
         this.refresh = 'Update'
      },

      summonerAverages() {
         for (const champ of this.championData) {
            this.summonerStats.totalMatches += champ.games
            this.summonerStats.totalWins += champ.wins

            this.summonerStats.kda[0] += champ.averages.kills
            this.summonerStats.kda[1] += champ.averages.deaths
            this.summonerStats.kda[2] += champ.averages.assists

            this.summonerStats.killParticipation += champ.averages.killParticipation

            this.summonerStats.multiKills.triple += champ.multikills.triple
            this.summonerStats.multiKills.quadra += champ.multikills.quadra
            this.summonerStats.multiKills.penta += champ.multikills.penta
         }
         this.summonerStats.kda = this.summonerStats.kda.map(x => Math.round(x / this.championData.length * 10) / 10)
         this.summonerStats.killParticipation = Math.round(this.summonerStats.killParticipation / this.championData.length * 10) / 10
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
               this.championData.sort((a, b) => a.championName.localeCompare(b.championName)) :
               this.championData.sort((a, b) => b.championName.localeCompare(a.championName))
         }

         const value = table[this.selected]

         return (this.order) ?
            this.championData.sort((a, b) => b[value] - a[value]) :
            this.championData.sort((a, b) => a[value] - b[value])
      },

      bongocat() { 
         return new URL(`../../assets/bongo-cat.gif`, import.meta.url).href
      },

      winrate() {
         return `${Math.round((this.summonerStats.totalWins / this.summonerStats.totalMatches) * 1000) / 10}%`
      },

      kda() {
         // console.log(this.championData)
         // if (!this.championData.averageKills) return '-'
         // return `${this.summonerStats.kda.kills / this.championData.length}/${this.summonerStats.kda.deaths / this.championData.length}/${this.summonerStats.kda.assists / this.championData.length}`
         return `${this.summonerStats.kda[0]} / ${this.summonerStats.kda[1]} / ${this.summonerStats.kda[2]}`
      },

      // kdr() {
      //    if (!this.champion.averageKills) return '-'
      //    return `${Math.round(((this.champion.averageKills + this.champion.averageAssists) / this.champion.averageDeaths) * 100) / 100}`
      // },

      // killParticipation() {
      //    return `${Math.round(this.summonerStats.killParticipation / this.championData.length * 10) / 10}%`
      // },

      background() {
         return `background: radial-gradient(circle at 50% -160%, transparent 30%, var(--tint100) 77%), no-repeat center -330% url('${this.profile.IconId}');
                 background-size: 380px;`
      },
   },
   
   props: {
      response: Object
   }
}
</script>

<template>
   <div class="user-ready-main">
      <div class="lhs">
         <div class="profile" :style="background">
            <div class="name-wrapper">
               <img class="pfp" :src=profile.IconId  alt="">
               <div>
                  {{ this.profile.name }}
                  <div>
                     <button :disabled="isDisabled" @click="updateSummoner()">
                        {{ this.refresh }}
                     </button>
                     <img class="bongo-cat" :src="bongocat" v-show="this.isDisabled">
                  </div>
               </div>
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
                  {{ this.summonerStats.killParticipation }}%
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
         
         <MatchHistory />
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
            <ListPanel :championData="this.championData" :currentPatch="this.currentPatch" :key="this.updateKey"/>
         </div>
         <div class="panel" v-show="this.panel === 1">
            <SummonerPanel 
               :championData="this.championData"
               :challengeData="this.challengeInfo" 
               :totalMatches="this.summonerStats.totalMatches" />
         </div>
         <div class="panel" v-show="this.panel === 2">
            <ChampionPanel :data="this.championData"/>
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
   min-width: 760px;
   width: 760px;
   /* height: 100vh;
   overflow-y: scroll;
   padding-right: 5px; */
}

/* .rhs::-webkit-scrollbar {
   width: 15px;
}

.rhs::-webkit-scrollbar-track {
   background-color: rgba(0, 0, 0, 0.1);
}

.rhs::-webkit-scrollbar-thumb {
   background-color: var(--tint100);
   border-radius: 8px;
} */

.sections {
   display: flex;
   gap: 10px;
}

.section-tab:hover {
   cursor: pointer;
   /* font-weight: bold; */
}

.active {
   /* background: var(--tint100); */
   background: var(--hoverButton);
   font-weight: bold;
}

.section-tab {
   padding: 0.75rem 1rem;
   /* font-weight: bold; */
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
   background: var(--tint100);
   border-radius: 15px;
}

.name-wrapper {
   padding: 30px 0;
   display: flex;
   margin-left: 40px;
   justify-content: left;
   align-items: center;
   gap: 20px;
   font-size: 1.5rem;
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
   transform: rotate(-14deg)  translate(17px, -91px);
}

.img-bg {
   position: relative;
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
   transition: 0.25s;
}

.name-wrapper button:hover {
   cursor: pointer;
   background: var(--tint100);
}

.name-wrapper button[disabled] {
   background: var(--hoverButton);
   cursor: wait;
}

.summ-stats {
   display: grid;
   width: 100%;
   grid-template-areas: 
   '1 2'
   '3 4';
   row-gap: 40px;
   justify-content: space-evenly;
   margin: 0 auto;
   font-size: 1.5rem;
   font-weight: lighter;
   line-height: 1;
}

.summ-stats h3 {
   font-size: 1rem;
   font-weight: lighter;
   color: var(--tint400);
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
}

.quadra {
   background-image: url('../../assets/diamond.svg');
   background-size: 75%;
   width: 60px;
}

.penta {
   background-image: url('../../assets/pentagon.svg');
   background-size: 80%;
   width: 55px;
}

.summ-mk {
   padding: 40px 20px;
   display: flex;
   font-size: 1.5rem;
   font-weight: medium;
   text-shadow: rgba(0, 0, 0, 0.5) 2px 2px 1px;
   justify-content: space-around;
}

</style>