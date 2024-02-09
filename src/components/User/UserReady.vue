<script>
import Dropdown from '../Dropdown.vue'
import Encounters from '../Encounters.vue'

import ListPanel from '../Panels/ListPanel.vue'
import SummonerPanel from '../Panels/SummonerPanel.vue'
import ChampionPanel from '../Panels/ChampionPanel.vue'

import Histogram from '../Histogram.vue'
import ChampSearch from '../ChampSearch.vue'
import Danger from '../Danger.vue'
import axios from 'axios'


export default {
   components: {
      Dropdown,
      Encounters,
      Histogram,
      ChampSearch,
      ListPanel,
      SummonerPanel,
      ChampionPanel,
      Danger
   },

   data() {
      return {
         championData: this.response.championData,
         challengeInfo: this.response.challenges,
         summoner: {
            iconId: this.response.profileIcon,
            // name: (this.response.tagLine) ? `${this.response.gameName}#${this.response.tagLine}` : this.response.name,
            name: [this.response.gameName, this.response.tagLine]
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

   watch: {
      $route: {
         immediate: true,
         handler() {
            document.title = `${this.response.gameName} | ARAM Stats`
         }
      }
   },

   created() {      
      this.summonerAverages()
   },

   methods: {
      async updateSummoner() {
         this.isDisabled = true
         const url = `/api/summoners/update/${this.$route.params.region}/${this.$route.params.gameName}/${this.$route.params.tagLine}`
         // console.log(url)
         // return

         this.refresh = 'Updating...'
         const res = await axios.put(url)

         this.championData = res.data.championData
         this.summoner.name = [res.data.gameName, res.data.tagLine]
         this.summoner.iconId = res.data.profileIcon
         this.challengeInfo = res.data.challenges

         // Rerender champ list
         this.updateKey++

         // Re-enable button
         this.isDisabled = false

         // Set button back to 'update'
         this.refresh = 'Update'
      },

      summonerAverages() {
         for (const champ of this.championData) {
            this.summonerStats.totalMatches += champ.games
            this.summonerStats.totalWins += champ.wins

            this.summonerStats.kda[0] += champ.avg.k
            this.summonerStats.kda[1] += champ.avg.d
            this.summonerStats.kda[2] += champ.avg.a

            this.summonerStats.killParticipation += champ.avg.kp

            this.summonerStats.multiKills.triple += champ.mk.t
            this.summonerStats.multiKills.quadra += champ.mk.q
            this.summonerStats.multiKills.penta += champ.mk.p
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
         return new URL(`../../assets/images/bongo-cat.gif`, import.meta.url).href
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

      profileIcon() {
         // clogs 403 initially because getpatch hasn't run. once responds w/ patch will update reactively.
         return `https://ddragon.leagueoflegends.com/cdn/${this.currentPatch}/img/profileicon/${this.summoner.iconId}.png`
      },

      background() {
         return `background: radial-gradient(circle at 50% -160%, transparent 30%, var(--cell-panel) 77%), no-repeat center -460% url('${this.profileIcon}');
                 background-size: 380px;`
      },
   },
   
   props: {
      response: Object,
      currentPatch: null
   }
}
</script>

<template>
   <div class="user-ready-main" :key="this.updateKey">
      <div class="lhs">
         <div class="profile" :style="background">
            <div class="name-wrapper">
               <img class="pfp" :src=profileIcon  alt="">
               <div>
                  {{ this.summoner.name[0] }}
                  <span class="sub">
                     #{{ this.summoner.name[1] }}
                  </span>
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
         
         <Encounters :championData="this.championData"/>
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
         <div class="panel" v-if="this.panel === 0">
            <ListPanel
               :championData="this.championData"
               :currentPatch="this.currentPatch"
               :updateKey="this.updateKey"/>
         </div>
         <div class="panel" v-if="this.panel === 1">
            <SummonerPanel 
               :championData="this.championData"
               :challengeData="this.challengeInfo" 
               :totalMatches="this.summonerStats.totalMatches" />
         </div>
         <div class="panel" v-if="this.panel === 2">
            <ChampionPanel
               :data="this.championData"
               :currentPatch="this.currentPatch"/>
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
}

.sections {
   display: flex;
   gap: 10px;
}





.section-tab {
   border-radius: 10px;
   color: var(--color-font);
   background: var(--cold-blue);
   padding: 0.5rem 0.95rem;
   font-size: 0.85rem;
   border: 1px solid transparent;
   transition: 0.2s;
   -webkit-touch-callout: none; /* iOS Safari */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Old versions of Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none;
}

.section-tab:hover {
   cursor: pointer;
   background: var(--cold-blue-focus);
}

.active {
   border: 1px solid var(--cell-border);
   background: var(--cold-blue-focus);
   color: var(--color-font-focus);
   /* font-weight: bold; */
}

.profile {
   background: var(--cold-blue);
   border-radius: 15px;
}

.name-wrapper {
   padding: 30px 0;
   display: flex;
   margin-left: 40px;
   justify-content: left;
   align-items: center;
   gap: 20px;
   color: var(--color-font-focus);
   font-size: 1.35rem;
   border-radius: 15px;
} 

.name-wrapper .sub {
   color: var(--color-font-faded);
   font-size: 1.25rem;
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
   background: var(--cold-blue);
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
   color: var(--color-font-focus);
   background: var(--cold-blue-focus);
}

.name-wrapper button[disabled] {
   background: var(--light-10);
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
   font-size: 1.3rem;
   font-weight: normal;
   line-height: 1;
}

.summ-stats h3 {
   font-size: 0.85rem;
   font-weight: normal;
   color: var(--color-font-faded);
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
   background-image: url('../../assets/svg/triangle.svg');
   background-size: 85%;
   width: 60px;
}

.quadra {
   background-image: url('../../assets/svg/diamond.svg');
   background-size: 75%;
   width: 60px;
}

.penta {
   background-image: url('../../assets/svg/pentagon.svg');
   background-size: 80%;
   width: 55px;
}

.summ-mk {
   padding: 40px 20px;
   display: flex;
   font-size: 1.5rem;
   font-weight: medium;
   text-shadow: var(--light-18) 1px 1px 3px;
   justify-content: space-around;
}

</style>