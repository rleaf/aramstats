<script>
import axios from 'axios'
import RadarChart from '../RadarChart.vue'
import UXTooltip from '@/components/UXTooltip.vue'
import Champion from '../Champion.vue'
import Heatmap from '../Heatmap.vue'
import StatDropdown from '../StatDropdown.vue'
import ImageStatDropdown from '../ImageStatDropdown.vue'
// import RuneStatDropdown from '../RuneStatDropdown.vue'
import Challenges from '../Challenges.vue'
import Encounters from '../Encounters.vue'
import _names from '@/constants/champions.js'
import { summonerStore } from '@/stores/summonerStore'
import { superStore } from '../../stores/superStore'

export default {
   components: {
      RadarChart,
      UXTooltip,
      StatDropdown,
      ImageStatDropdown,
      // RuneStatDropdown,
      Champion,
      Heatmap,
      Challenges,
      Encounters
   },

   data() {
      return {
         data: this._data,                   // Proxy data so it can mutate on Update click
         superStore: superStore(),           // Store for global settings
         summonerStore: summonerStore(),     // Store for summoner settings
         names: _names,                      // Constant names to map championId to name
         championFilter: '',                 // Filter for table champion search 
         sortFilter: null,                   // Determine if sort is active
         toggleState: false,                 // Determine if toggle all button has been clicked
         descending: false,                  // Determine if sort is in descending
         moduleStats: false,                 // Determine if module stats window is active
         statsSelection: 'Champion Stats',   // Stats window to be rendered on lhs.
         update: false,                      // Bool to help UX for update button
         updateKey: 0,                       // For re-rendering post summoner update
      }
   },

   mounted() {
      // console.log(this.data, 'potatos')
      document.title = `${this.data.gameName} | ARAM Stats`
      window.addEventListener('keypress', this.championSearchFocus)
   },

   beforeUnmount() {
      window.removeEventListener('keypress', this.championSearchFocus)
   },
   
   methods: {
      championSearchFocus(e) {
         if (e.key !== 's' || document.activeElement === this.$refs.championSearch || this.superStore.focus) return

         e.preventDefault()
         this.$refs.championSearch.focus()
      },

      toggleAll() {
         this.toggleState = !this.toggleState

         if (this.toggleState) {
            for (const c of this.data.championData) {
               this.summonerStore.championPool.add(c.championId)
            }
         } else {
            this.summonerStore.championPool.clear()
         }

      },

      sort(idx) {
         if (idx === this.sortFilter) {
            (this.descending) ? this.sortFilter = null : this.descending = true

         } else {
            this.sortFilter = idx
            this.descending = false
         }
      },

      async updateProfile() {
         const url = `/api/update/${this.$route.params.region}/${this.$route.params.gameName}/${this.$route.params.tagLine}`
         let res
         
         this.update = true
         this.$refs.updateButton.innerHTML = 'Updating...'
         
         try {
            res = await axios.get(url)
         } catch (e) {
            console.log(e, 'updateProfile error')
         }
         
         this.update = false
         this.$refs.updateButton.innerHTML = 'Update'
         
         
         if (res.status === 200) {
            this.data = res.data
            this.superStore.setNotification('Summoner updated')
            this.updateKey++
         }
         
         if (res.status === 204) {
            this.superStore.setNotification('Summoner already up to date')
         }
      },

      async deleteProfile() {
         if (!confirm('Delete summoner?')) return

         const url = `/api/delete/${this.$route.params.region}/${this.$route.params.gameName}/${this.$route.params.tagLine}`

         try {
            await axios.delete(url)   
         } catch (e) {
            
         }

         this.$router.push({ name: 'home' })
         this.superStore.setNotification(`${this.data.gameName}#${this.data.tagLine} deleted`, 5000)
      }
   },
   
   computed: {

      filteredChampions() {
         return this.data.championData.filter(c => this.names.urlName[c.championId].toLowerCase().includes(this.championFilter.toLowerCase()))
      },
      
      sortedChampions() {
         switch (this.sortFilter) {
            case 0:
               return (this.descending) ? this.filteredChampions.sort((a, b) => this.names.urlName[b.championId].localeCompare(this.names.urlName[a.championId])) : 
                  this.filteredChampions.sort((a, b) => this.names.urlName[a.championId].localeCompare(this.names.urlName[b.championId]))
            case 1:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.wins / a.games) - (b.wins / b.games)) : 
                  this.filteredChampions.sort((a, b) => (b.wins / b.games) - (a.wins / a.games))
            case 2:
               return (this.descending) ? this.filteredChampions.sort((a, b) => ((a.avg.k + a.avg.a) / a.avg.d) - ((b.avg.k + b.avg.a) / b.avg.d)) :
                  this.filteredChampions.sort((a, b) => ((b.avg.k + b.avg.a) / b.avg.d) - ((a.avg.k + a.avg.a) / a.avg.d))
            case 3:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.kp) - (b.avg.kp)) :
                  this.filteredChampions.sort((a, b) => (b.avg.kp) - (a.avg.kp))
            case 4:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.tdd) - (b.avg.tdd)) :
                  this.filteredChampions.sort((a, b) => (b.avg.tdd) - (a.avg.tdd))
            case 5:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.tdt) - (b.avg.tdt)) :
                  this.filteredChampions.sort((a, b) => (b.avg.tdt) - (a.avg.tdt))
            case 6:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.tsm) - (b.avg.tsm)) :
                  this.filteredChampions.sort((a, b) => (b.avg.tsm) - (a.avg.tsm))
            case 7:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.th) - (b.avg.th)) :
                  this.filteredChampions.sort((a, b) => (b.avg.th) - (a.avg.th))
            case 8:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.ah) - (b.avg.ah)) :
                  this.filteredChampions.sort((a, b) => (b.avg.ah) - (a.avg.ah))
            case 9:
               return (this.descending) ? this.filteredChampions.sort((a, b) => (a.avg.ge) - (b.avg.ge)) :
                  this.filteredChampions.sort((a, b) => (b.avg.ge) - (a.avg.ge))
            default:
               return this.filteredChampions.sort((a, b) => (b.games) - (a.games))
         }
      },

      profileIcon() {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/profileicon/${this.data.profileIcon}.png`
      },

      lhsHeaders() {
         return ['Champion', 'Winrate']
      },

      rhsHeaders() {
         return ['KDA', 'KP', 'Damage', 'Taken', 'Mitigated', 'Healed', 'Ally Healing', 'Gold']
      },

      convertChampionData() {
         return this.data.championData.reduce((o, c) => {
            o[c.championId] = c
            return o
         }, {})
      },

      computeAccountStats() {
         let a_g = 0, a_w = 0, a_tp = 0
         let rsg = 0, rw = 0, bw = 0

         for (const c of this.data.championData) {
            a_g += c.games
            a_w += c.wins
            rsg += c.rsg
            bw += c.bw
            rw += c.rw
            
            for (const m of c.matches) {
               a_tp += m.gd
            }
         }

         // return [
         //    `${(a_w / a_g * 100).toFixed(2)}%`,
         //    `${Math.round(a_tp / 1440 * 100 ) / 100} days`,
         //    `${a_g}`,
         //    `${a_g - rsg}`, 
         //    `${rsg}`,
         //    `${(bw / a_w * 100).toFixed(2)}%`,
         //    `${(rw / a_w * 100).toFixed(2)}%`,
         //    `${this.data.fountainSitter}`
         // ]

         return {
            'winrate': `${(a_w / a_g * 100).toFixed(2)}%`,
            'time': `${Math.round(a_tp / 1440 * 100 ) / 100} days`,
            'games': `${a_g}`,
            'bsg': `${a_g - rsg}`,
            'rsg': `${rsg}`,
            'bw': `${(bw / a_w * 100).toFixed(2)}%`,
            'rw': `${(rw / a_w * 100).toFixed(2)}%`,
            'fs': `${this.data.fountainSitter}`
         }
      },

      aggregatedStats() {
         let c_kda = [0, 0, 0]
         let stats = {
            // Generals
            'kda': '',
            'matches': 0,
            'fbk': 0,
            'gameLength' : 0,
            'deathTime' : 0,
            'damage' : 0,
            'damageTaken' : 0,
            'damageMitigated' : 0,
            'healed' : 0,
            'allyShielded' : 0,
            'allyHealed' : 0,
            'gold' : 0,
            'killParticipation' : 0,
            // Multikills
            'triples' : 0,
            'quadras' : 0,
            'pentas' : 0,
            // Structures
            'towersDestroyed': 0,
            'damageDealtToTowers': 0,
            'towersLost': 0,
            // Teamfights
            'expectation': 0,
            'capitalization': 0,
            'usefulness': 0,
            'participation': 0,
            'frequency': 0,
            'death': 0,
            // Spell casts
            'q': 0,
            'w': 0,
            'e': 0,
            'r': 0,
            // Summoner Spells
            '1': [0, 0],
            '3': [0, 0],
            '4': [0, 0],
            '6': [0, 0],
            '7': [0, 0],
            '13': [0, 0],
            '14': [0, 0],
            '21': [0, 0],
            '32': [0, 0],
            // Runes
            'primaryRunes': {},
            'secondaryRunes': {},
            // Pings
            'allIn': 0,
            'missing': 0,
            'basic': 0,
            'command': 0,
            'danger': 0,
            'enMiss': 0,
            'enVis': 0,
            'back': 0,
            'hold': 0,
            'vis': 0,
            'omw': 0,
            'push': 0,
            'visClear': 0,
            // Items
            'slotUnus': 0,
            'slotDuo': 0,
            'slotTres': 0,
            'slotQuattuor': 0,
            'slotQuinque': 0,
            'slotSex': 0,
         }

         let championAveragedStats = [
            'killParticipation',
            'damage',
            'damageTaken',
            'damageMitigated',
            'healed',
            'allyHealed',
            'allyShielded',
            'gold',
         ]
         
         let matchAveragedStats = [
            'deathTime',
            'gameLength',
            'damageDealtToTowers',
         ]

         let itemSlots = [
            'slotUnus',
            'slotDuo',
            'slotTres',
            'slotQuattuor',
            'slotQuinque',
            'slotSex',
         ]

         let summonerSpells = [
            '1',
            '3',
            '4',
            '6',
            '7',
            '13',
            '14',
            '21',
            '32',
         ]

         const formatTime = (o) => {
            // Prettify time to MM:SS. 5.2 --> 05:12
            const af = n => (n.length === 1) ? '0' + n : n

            if (!o) return '-'
            const i = o.toString().split('.')
            let one = af(i[0])
            let two = Math.floor(Number(`.${i[1]}`) * 60).toString()
            two = af(two)

            return `${one}:${two}`
         }

         let itemArrayHelper = [0, 0, 0, 0, 0, 0]

         for (const c of this.summonerStore.championPool) {
            const o = this.convertChampionData[c]

            c_kda[0]+= o.avg.k
            c_kda[1]+= o.avg.d
            c_kda[2]+= o.avg.a
            stats.fbk += o.fbk

            stats.killParticipation += o.avg.kp
            stats.damage += o.avg.tdd
            stats.damageTaken += o.avg.tdt
            stats.damageMitigated += o.avg.tsm
            stats.healed += o.avg.th
            stats.allyShielded += o.avg.as
            stats.allyHealed += o.avg.ah
            stats.gold += o.avg.ge
            stats.triples += o.mk.t
            stats.quadras += o.mk.q
            stats.pentas += o.mk.p
            stats.towersLost += o.tl
            stats.towersDestroyed += o.tg
            stats.damageDealtToTowers += o.ddtt
            stats.expectation += o.tf.exp
            stats.capitalization += o.tf.cap
            stats.usefulness += o.tf.use
            stats.participation += o.tf.part
            stats.frequency += o.tf.freq
            stats.death += o.tf.death

            for (const ss of summonerSpells) {
               stats[ss][0] += o.ss[ss].games
               stats[ss][1] += o.ss[ss].casts
            }

            stats.q += o.sc.q
            stats.w += o.sc.w
            stats.e += o.sc.e
            stats.r += o.sc.r
            stats.allIn += o.p.all
            stats.missing += o.p.assist
            stats.basic += o.p.back
            stats.command += o.p.comm
            stats.danger += o.p.danger
            stats.enMiss += o.p.enMiss
            stats.enVis += o.p.enVis
            stats.back += o.p.hold
            stats.hold += o.p.omw
            stats.vis += o.p.vis
            stats.omw += o.p.omw
            stats.push += o.p.push
            stats.visClear += o.p.visClr
            
            stats.matches += o.matches.length

            for (const m of o.matches) {
               stats.gameLength += m.gd
               stats.deathTime += m.tsd

               if (stats.primaryRunes[m.pr]) {
                  stats.primaryRunes[m.pr][0]++
                  stats.primaryRunes[m.pr][1] += (m.w) ? 1 : 0
               } else {
                  stats.primaryRunes[m.pr] = [1, (m.w) ? 1 : 0]
               }

               if (stats.secondaryRunes[m.sr]) {
                  stats.secondaryRunes[m.sr][0]++
                  stats.secondaryRunes[m.sr][1] += (m.w) ? 1 : 0
               } else {
                  stats.secondaryRunes[m.sr] = [1, (m.w) ? 1 : 0]
               }

               // if (stats.secondaryRunes[m.sr]) {
               //    stats.secondaryRunes[m.sr].games++
               //    stats.secondaryRunes[m.sr].wins += (m.w) ? 1 : 0
               // } else {
               //    stats.secondaryRunes[m.sr] = {
               //       games: 1,
               //       wins: (m.w) ? 1 : 0 
               //    }
               // }

               for (let i = 0; i < 6; i++) {
                  if (m.ic[i] > 0) itemArrayHelper[i]++
               }

               itemSlots.forEach((o, i) => stats[o] += m.ic[i])
            }
         }

         itemSlots.forEach((o, i) => {
            stats[o] = Math.round(stats[o] / itemArrayHelper[i] * 100) / 100
            stats[o] = formatTime(stats[o])
         })

         /**
          * CHAMPION AVERAGE STATS
          * Stats that are already averaged for the champion on the backend and need to be divided against the amount of champions selected.
          */
         const divByChamps = (o) => Math.round(o / this.summonerStore.championPool.size)
         c_kda = c_kda.map(x => divByChamps(x))

         championAveragedStats.forEach(o => stats[o] = Math.round(stats[o] / this.summonerStore.championPool.size))
         stats.kda = `${c_kda[0]}/${c_kda[1]}/${c_kda[2]}`

         

         /**
          * MATCH AVERAGE STATS
          * Match stats that need to be summed, then divided by the match count. These are stats that are not precomputed on the backend.
         */
         matchAveragedStats.forEach(o => stats[o] = (stats[o] / stats.matches).toFixed(1))

         const af = (n, d) => (Math.round(n / d * 1000) / 1000)
         stats.capitalization = af(stats.capitalization, stats.frequency)
         stats.expectation = af(stats.expectation, stats.participation)
         stats.usefulness = af(stats.usefulness, stats.participation)
         stats.death = af(stats.death, stats.participation)

         stats.gameLength = formatTime(stats.gameLength) // Game duration
         stats.deathTime = formatTime(stats.deathTime / 60) // Death time (/=60 cause tsd is in seconds)

         return stats
      },

      getAccountStats() {
         return [
            ['Winrate', this.computeAccountStats['winrate']],
            ['Time Played', this.computeAccountStats['time']],
            ['Games', this.computeAccountStats['games']],
            ['Red Side Winrate', this.computeAccountStats['rw']],
            ['Blue Side Winrate', this.computeAccountStats['bw']],
            ['Fountain Sitting', this.computeAccountStats['fs']],
         ]
      },

      getGeneralStats() {
         return [
            ['KDA', this.aggregatedStats['kda']],
            ['Matches', this.aggregatedStats['matches']],
            ['First Blood', this.aggregatedStats['fbk']],
            ['Kill Participation', this.aggregatedStats['killParticipation'] + '%'],
            ['Game Length', this.aggregatedStats['gameLength']],
            ['Death Time', this.aggregatedStats['deathTime']], 
            ['Damage', this.aggregatedStats['damage']],
            ['Damage Taken', this.aggregatedStats['damageTaken']],
            ['Damage Mitigated', this.aggregatedStats['damageMitigated']],
            ['Healing', this.aggregatedStats['healed']],
            ['Ally Healing', this.aggregatedStats['allyHealed']],
            ['Ally Shielding', this.aggregatedStats['allyShielded']],
            ['Gold', this.aggregatedStats['gold']],
         ]
      },

      getItemSlots() {
         return [
            ['Slot 1', this.aggregatedStats['slotUnus']],
            ['Slot 2', this.aggregatedStats['slotDuo']],
            ['Slot 3', this.aggregatedStats['slotTres']],
            ['Slot 4', this.aggregatedStats['slotQuattuor']],
            ['Slot 5', this.aggregatedStats['slotQuinque']],
            ['Slot 6', this.aggregatedStats['slotSex']],
         ]
      },

      getMultiKills() {
         return [
            ['Triples', this.aggregatedStats['triples']],
            ['Quadras', this.aggregatedStats['quadras']],
            ['Pentas', this.aggregatedStats['pentas']],
         ]
      },

      getStructures() {
         return [
            ['Towers Destroyed', this.aggregatedStats['towersDestroyed']],
            ['Towers Lost', this.aggregatedStats['towersLost']],
            ['Tower Damage Dealt', Math.round(this.aggregatedStats['damageDealtToTowers'])],
         ]
      },

      getTeamfights() {
         return [
            ['Frequency', this.aggregatedStats['frequency']],
            ['Expectation', this.aggregatedStats['expectation'].toFixed(2)],
            ['Longevity', this.aggregatedStats['usefulness'].toFixed(2)],
            ['Participation', (this.aggregatedStats['participation'] / this.aggregatedStats['frequency'] * 100).toFixed(2) + '%'],
            ['Death', (this.aggregatedStats['death'] * 100).toFixed(1) + '%'],
            ['Capitalization', (this.aggregatedStats['capitalization'] * 100).toFixed(1) + '%'],
         ]
      },

      getSummonerSpells() {
        return [
            ['1', this.aggregatedStats['1']],
            ['3', this.aggregatedStats['3']],
            ['4', this.aggregatedStats['4']],
            ['6', this.aggregatedStats['6']],
            ['7', this.aggregatedStats['7']],
            ['13', this.aggregatedStats['13']],
            ['14', this.aggregatedStats['14']],
            ['21', this.aggregatedStats['21']],
            ['32', this.aggregatedStats['32']],
         ] 
      },

      getSpellCasts() {
         return [
            ['Q', this.aggregatedStats['q']],
            ['W', this.aggregatedStats['w']],
            ['E', this.aggregatedStats['e']],
            ['R', this.aggregatedStats['r']],
         ]
      },
      
      getKeystoneRunes() {
         return Object.entries(this.aggregatedStats.primaryRunes)
      },
      

      getSecondaryTree() {
         return Object.entries(this.aggregatedStats.secondaryRunes)
      },

      getPings() {
         return [
            ['All In', this.aggregatedStats['allIn']],
            ['Missing', this.aggregatedStats['missing']],
            ['Basic', this.aggregatedStats['basic']],
            ['Command', this.aggregatedStats['command']],
            ['Danger', this.aggregatedStats['danger']],
            ['Enemy Missing', this.aggregatedStats['enMiss']],
            ['Enemy Vision', this.aggregatedStats['enVis']],
            ['Back', this.aggregatedStats['back']],
            ['Hold', this.aggregatedStats['hold']],
            ['Need Vision', this.aggregatedStats['vis']],
            ['On My Way', this.aggregatedStats['omw']],
            ['Push', this.aggregatedStats['push']],
            ['Vision Clear', this.aggregatedStats['visClear']],
         ]
      },

      updatedDate() {
         return new Date(this.data.updated).toLocaleDateString()
      },
   },

   props: {
      _data: Object,
      patch: null
   }

}
</script>

<template>
   <div class="summoner-ready-main" :key="this.updateKey">
      <div class="gradient-bg" />
      <div ref="header" class="header">
         <img v-if="this.update" class="bongo" src="@/assets/images/bongo-cat.gif" alt="">
         <div class="header-lhs">
            <div class="header-summoner-icon">
               <img :src="profileIcon" alt="">
            </div>
            <div class="header-lhs-one">
               <div class="summoner-name">
                  {{ this.data.gameName }}
                  <div class="tagLine">{{ this.data.tagLine }}</div>
               </div>
               <div class="buttons">
                  <button :class="{ 'active-update': this.update }" ref="updateButton" :disabled="this.update" @click="this.updateProfile()">Update</button>
                  <!-- <button @click="this.deleteProfile()">Delete</button> -->
               </div>
               <div class="last-updated">
                  Last updated: {{ this.updatedDate }}
               </div>
            </div>
         </div>

         <div class="header-rhs">
            <RadarChart :data="this.data.championData" />
         </div>
      </div>
      <div class="body">
         
         <div class="lhs-body">
            <div class="section">
               <div class="section-header">
                  <h2>Account</h2>
                  <UXTooltip :align="'left'" :tip="'account'" />
               </div>

               <StatDropdown
                  :stats="getAccountStats"
                  :persist="true"
                  :tooltip="'implement'"/>

               <div class="side-stats">
                  <h3>Playrate</h3>
                  <div class="visual">
                     <span :style="{'width': (this.computeAccountStats['rsg'] / this.computeAccountStats['games'] * 100 - 0.5) + '%'}"></span>
                     <span :style="{'width': (this.computeAccountStats['bsg'] / this.computeAccountStats['games'] * 100 - 0.5) + '%'}"></span>
                  </div>
                  <div class="details">
                     <div>
                        <svg width="10" height="10">
                           <circle fill="var(--red-side)" cx="5" cy="5" r="5" />
                        </svg>
                        {{ Math.round(this.computeAccountStats['rsg'] / this.computeAccountStats['games'] * 100) }}%
                        <span class="game-count">{{ this.computeAccountStats[4] }}</span>
                     </div>
                     <div>
                        <svg width="10" height="10">
                           <circle fill="var(--blue-side)" cx="5" cy="5" r="5" />
                        </svg>
                        {{ Math.round(this.computeAccountStats['bsg'] / this.computeAccountStats['games'] * 100) }}%
                        <span class="game-count">{{ this.computeAccountStats[3] }}</span>
                     </div>
                  </div>
               </div>

            </div>
            <div class="section">
               <div class="section-header">
                  <div class="module">
                     <div class="burger" @click="this.moduleStats = !this.moduleStats" :class="{ 'module-menu-active': this.moduleStats }">
                        <span v-for="i in 4" :key="i"></span>
                     </div>
                     <h2>{{ this.statsSelection }}</h2>
                  </div>
               </div>
               <Transition name="module">
                  <div v-if="this.moduleStats" class="module-menu">
                     <div class="selections">
                        <div @click="this.statsSelection='Champion Stats'; this.moduleStats = false">Champion Stats</div>
                        <div @click="this.statsSelection='Challenges'; this.moduleStats = false">Challenges</div>
                        <div @click="this.statsSelection='Encounters'; this.moduleStats = false">Encounters</div>
                     </div>
                  </div>
               </Transition>
               <div v-if="this.moduleStats" class="outer-click" @click="this.moduleStats = false"></div>

               <div v-if="this.statsSelection=='Champion Stats'">
                  <StatDropdown
                     :header="'General'"
                     :stats="getGeneralStats"
                     :tooltip="'general'"/>
   
                  <StatDropdown
                     :header="'Item Completion'"
                     :stats="getItemSlots"
                     :tooltip="'itemSlots'"/>
   
                  <StatDropdown
                     :header="'Multikills'"
                     :stats="getMultiKills"
                     :tooltip="'multikills'"/>
   
                  <StatDropdown
                     :header="'Structures'"
                     :stats="getStructures"
                     :tooltip="'structures'"/>
   
                  <StatDropdown
                     :header="'Teamfights'"
                     :stats="getTeamfights"
                     :tooltip="'teamfights'"/>
   
                  <ImageStatDropdown
                     :header="'Summoner Spells'"
                     :stats="getSummonerSpells"
                     :tooltip="'summonerSpells'"/>

                  <ImageStatDropdown
                     :header="'Keystone Runes'"
                     :stats="getKeystoneRunes"
                     :tooltip="'keystoneRunes'"/>

                  <ImageStatDropdown
                     :header="'Secondary Trees'"
                     :stats="getSecondaryTree"
                     :tooltip="'secondaryTree'"/>

                  <StatDropdown
                     :header="'Spellcasts'"
                     :stats="getSpellCasts"
                     :tooltip="'spellcasts'"/>
   
                  <StatDropdown
                     :header="'Pings'"
                     :stats="getPings"
                     :tooltip="'pings'"/>
               </div>

               <div v-if="this.statsSelection=='Challenges'">
                  <Challenges :data="this.data.challenges" />
               </div>

               <div v-if="this.statsSelection=='Encounters'">
                  <Encounters :data="this.data.championData" />
               </div>
               
            </div>
         </div>

         <div class="rhs-body">
            <Heatmap :data="this.data.championData" />
            <div class="champions-panel-header">
               <div class="utility">
                  <div>
                     <input ref="championSearch" @keyup.escape="this.$refs.championSearch.blur()" @click="this.championFilter = ''" type="text" v-model="this.championFilter" spellcheck="false">
                     <span v-show="!this.championFilter.length" class="keyboard-shortcut">
                        Press <kbd>s</kbd> to search
                     </span>
                  </div>
                  <div class="toggle" style="margin-left: auto;">
                     <button :class="{ 'active': this.toggleState }" @click="this.toggleAll()">Toggle All</button>
                  </div>
                  <UXTooltip :align="'right'" :tip="'championsTable'"/>
               </div>
               <div class="table-headers">
                  <div class="lhs">
                     <div @click="this.sort(i)" v-for="(h, i) in lhsHeaders" :key="i">
                        {{ h }}
                        <hr v-show="this.sortFilter === i" :class="{ 'descending': this.descending }">
                     </div>
                  </div>
                  <div class="rhs">
                     <div @click="this.sort(i+2)" v-for="(h, i) in rhsHeaders" :key="i">
                        {{ h }}
                        <hr v-show="this.sortFilter === i+2" :class="{ 'descending': this.descending }">
                     </div>
                  </div>
               </div>
               <hr>
            </div>
            <div class="champions">
               <Champion
                  :data="c" v-for="c in sortedChampions"
                  :patch="this.patch"
                  :key="c.championId" />
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>

.summoner-ready-main {
   display: flex;
   flex-direction: column;
   margin: 0 auto;
   width: 1100px;
   color: var(--color-font-focus);
}

.header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   margin-top: 5vh;
   padding-top: 4vh;
   padding-bottom: 6vh;
   border-top: 1px solid var(--outline);
   /* background: radial-gradient(ellipse at top, var(--cell-panel), var(--cell-panel-rgb) 25%); */
}

.header-lhs {
   display: flex;
}

.header-summoner-icon {
   width: 100px;
   height: 100px;
   overflow: hidden;
   border-radius: 100%;
   border: 1px solid var(--outline-variant);
}

.header-summoner-icon img {
   width: 100%;
}

.header-lhs-one {
   padding-left: 1.5rem;
}

.last-updated {
   font-size: 0.75rem;
   color: var(--color-font-faded);
   padding: 0.35rem 0rem;
}

.bongo {
   position: absolute;
   left: calc(50% - 100px);
   width: 300px;
   transform: rotate(-13deg) translate(-130px, 127px);
}

.update-message {
   position: absolute;
   left: 50%;
   top: 17vh;
   transform: translateX(-50%);
   font-size: 0.9rem;
   background: var(--update);
   border-radius: 3px;
   padding: 0.6rem 1.5rem;
}

.buttons {
   display: flex;
   gap: 8px;
   padding-top: 10px;
}

.buttons button {
   padding: 0.5rem 0.8rem;
   min-width: 45px;
   cursor: pointer;
   border-radius: 3px;
   border: 1px solid var(--outline-variant);
   /* border: none; */
   background: var(--surface);
   color: var(--color-font);
   font-size: 0.9rem;
   transition: 150ms ease-in-out;
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
}

button.active-update {
   opacity: 0.7;
   cursor: default;
}

.buttons button:hover:not(.active-update) {
   border: 1px solid var(--outline);
}

/* .buttons button:last-child:hover {
   background: var(--danger);
   color: var(--color-font-focus);
} */

.buttons div:hover {
   background: var(--cold-blue-focus);
} 

.summoner-name {
   display: inline-block;
   font-size: 2.8rem;
   margin: 0;
   font-family: var(--header-font);
}

.summoner-name .tagLine {
   display: inline-block;
   margin: 0;
   font-size: 1.3rem;
   color: var(--color-font-faded);
}

.gradient-bg {
   background: radial-gradient(ellipse at top, rgba(var(--surface-rgb), 0.4), rgba(var(--surface-rgb), 1) 73%), no-repeat -10% 25%/100% url('../../assets/summoner_assets/backdrop.webp');
   position: absolute;
   z-index: -5;
   margin-top: 5vh;
   width: inherit;
   height: 400px;
}

.body {
   display: flex;
   justify-content: space-between;
   padding-bottom: 10vh;
}

.section-header {
   border-bottom: 1px solid var(--outline-variant);
   margin-bottom: 20px;
   display: flex;
   align-items: center;
   justify-content: space-between;
}

.section-header .module {
   display: flex;
   gap: 10px;
   /* align-items: baseline; */
   /* border-radius: 3px;
   padding: 0.1rem 0.25rem;
   margin: 0.21rem 0;
   transition: 200ms ease-in-out; */
}

.lhs-body {
   /* width: 260px; */
   flex: 0 0 260px;
}

.section {
   padding-bottom: 5vh;
}

.burger {
   cursor: pointer;
   border-radius: 3px;
   padding: 4px;
   position: relative;
   width: 22px;
   height: 18px;
   transition: all 200ms ease-in-out;
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
   transition: background 200ms ease-in-out;
}

.burger:hover {
   background: var(--cold-blue-focus);
}

.burger span {
   position: absolute;
   width: 22px;
   height: 1px;
   background-color: var(--color-font);
   transition: all 100ms ease-in-out;
}

.burger span:nth-child(1) {
   top: 8px;
}
.burger span:nth-child(2), .burger span:nth-child(3) {
   top: 13px;
}
.burger span:nth-child(4) {
   top: 18px;
}

.section-header .burger:hover {
   background: var(--cold-blue-focus);
}

.module-menu-active span:nth-child(1), .module-menu-active span:nth-child(4) {
   transform: scale(0);
   top: 13px;
}

.module-menu-active span:nth-child(2) {
   transform: rotate(45deg);
}
.module-menu-active span:nth-child(3) {
   transform: rotate(-45deg);
}

/* .stats-selection {
   width: 300px;
} */

.module-enter-active,
.module-leave-active {
   transition: all 200ms ease-in-out;
   /* transition: max-height 200ms ease-in-out, opacity 300ms; */
}

.module-enter-from,
.module-leave-to {
   /* opacity: 0; */
   max-height: 0px;
}

.module-enter-to,
.module-leave-from {
   /* opacity: 1; */
   max-height: 106px;
}

.module-menu {
   position: absolute;
   z-index: 2;
   overflow: hidden;  
   transform: translateY(-21px);
}

.selections {
   width: 242px;
   z-index: 2;
   background: var(--surface-container);
   padding: 0.25rem 0.5rem;
   border-radius: 0 0 3px 3px;
   border: 1px solid var(--outline-variant);
}

.selections div {
   cursor: pointer;
   font-size: 0.9rem;
   margin: 3px 0;
   padding: 0.25rem 0.5rem;
   border-radius: 3px;
   font-weight: 600;
   transition: 200ms ease-in-out;
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
}

.selections div:hover {
   background: var(--surface-container-highest);
}

.outer-click {
   position: fixed;
   z-index: 1;
   top: 0;
   left: 0;
   width: 100%;
   height: 100vh;
}

.side-stats h3 {
   margin: 0;
   margin-bottom: 10px;
   padding-left: 0.5rem;
   font-size: 0.9rem;
}

.side-stats .visual {
   display: flex;
   justify-content: space-between;
   height: 10px;
   width: 100%;
}

.side-stats .details {
   display: flex;
   justify-content: space-between;
   width: 100%;
   font-size: 0.8rem;
   padding-top: 10px;
}

.details .game-count {
   color: var(--color-font-faded);
   padding-left: 3px;
   font-style: italic;
}

.visual span:first-child {
   border-radius: 5px 0 0 5px;
   background: var(--red-side);
}
.visual span:last-child {
   border-radius: 0 5px 5px 0;
   background: var(--blue-side);
}

/* svg {
   width: 100%;
   height: 20px;
   overflow: hidden;
   cursor: pointer;
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
} */

/* rect {
   width: calc(100% - 1px);
   height: calc(100% - 1px);
   stroke: var(--light-10);
} */

.rhs-body {
   flex: 0 0 800px;
}

.champions-panel-header .table-headers {
   /* background: rgba(255, 255, 255, 0.05); */
   display: flex;
   font-size: 0.8rem;
   align-items: center;
   justify-content: space-between;
   height: 30px;
   /* margin-bottom: 4px; */
   /* border-bottom: 1px solid var(--outline-variant); */
   /* border-top: 1px solid var(--outline-variant); */
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
}


.champions-panel-header hr {
   height: 1px;
   margin: 0;
   border: none;
   background-color: var(--outline-variant);
   outline: none;
   transition: transform .1s ease-in-out; 
}

.table-headers hr {
   margin-top: -4px;
}

.descending {
   transform: translateY(8px);
}

.champions {
   margin-top: 5px;
}
.utility {
   display: flex;
   align-items: center;
   margin-bottom: 15px;
}

.utility div:first-child {
   position: relative;
}

.utility .keyboard-shortcut {
   position: absolute;
   z-index: 0;
   left: 8px;
   top: 6px;
   font-size: 0.8rem;
   padding: 0;
   color: var(--color-font-faded);
   pointer-events: none;
}

.keyboard-shortcut kbd {
   display: inline-flex;
   border: 1px solid var(--outline-variant);
   border-radius: 5px;
   font-family: var(--font-main);
   justify-content: center;
   line-height: 0.3rem;
   padding: 6px 5px;
}

.utility input {
   background: var(--surface-container);
   border: 1px solid var(--outline-variant);
   color: var(--color-font);
   padding: .4rem .45rem;
   border-radius: 3px;
   transition: .2s;
}

.utility input:focus {
   outline: none;
   border: 1px solid var(--outline);
}

.utility button {
   padding: 0 1rem;
   margin: 0;
   cursor: pointer;
   border-radius: 3px;
   border: 0;
   margin-right: 10px;
   height: 30px;
   border: 1px solid var(--outline-variant);
   background: var(--surface);
   color: var(--color-font);
   font-size: 0.75rem;
   transition: 150ms ease-in-out;
}

button.active {
   border: 1px solid var(--outline);
   background: var(--surface-container);
}

.utility button:hover {
   border: 1px solid var(--outline);
}

.lhs div, .rhs div {
   cursor: pointer;
   line-height: 30px;
}

div.ascending {
   border-bottom: 2px solid var(--outline-variant);
}

div.descending {
   line-height: 50px;
}

.table-headers .lhs, .table-headers .rhs {
   display: flex;
   font-weight: 600;
   gap: 5px;
   justify-content: flex-end;
   height: 100%;
}

.table-headers .rhs div {
   width: 70px;
}

.table-headers .lhs div:first-child {
   margin-left: 29px;
   width: 160px;
}

.table-headers .lhs div:nth-child(2) {
   width: 50px;
}

.table-headers .rhs div:nth-child(1) {
   width: 65px; /* KP */
}

.table-headers .rhs div:nth-child(2) {
   width: 40px; /* KP */
}

.table-headers .rhs div:nth-child(4) {
   width: 60px; /* Taken */
   /* margin-right: 20px; */
}

.table-headers .rhs div:nth-child(6) {
   width: 55px; /* Healed */
}

.table-headers .rhs div:nth-child(7) {
   width: 75px; /* Ally Healing */
}

.table-headers .rhs div:nth-child(8) {
   margin-left: 5px;
   width: 40px; /* Gold */
}

.section-header h2 {
   font-family: 'Thestral';
   font-size: 1.6rem;
   margin: 0;
}

/* circle {
   fill: var(--alpha-07);
   transition: 0.2s cubic-bezier(.25, .52, .64, .84);
}

circle.toggle-all {
   transform: translateX(42%);
   fill: var(--color-font);
} */

.toggle {
   display: flex;
   align-items: center;
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
}

.toggle span {
   font-size: 0.8rem;
   color: var(--color-font-faded);
   padding-right: 5px;
   transition: color 0.3s cubic-bezier(.25, .52, .64, .84);
}

span.toggled {
   color: var(--color-font);
}
</style>