<script>
import axios from 'axios'
import champions from '../../constants/champions'
import Mythics from './components/Mythics.vue'
import Items from './components/Items.vue'
import Runes from './components/Runes.vue'


export default {
   components: {
      Mythics,
      Items,
      Runes
   },
   data() {
      return {
         builds: null,
         itemBin: [],
         backName: champions.imageName[this.champion.id],
         abilities: [],
         parameters: {
            thresholds: {
               core: 0.10,
               trail: 0.10,
            },
            trailingDuplicates: true,
            trailingExtended: 3,
            levelCutoff: 10
         },
         title: '',
         masterTab: 0,
         mythicTab: 0,
         tldrTab: 0,
         items: null,
         runes: null,
         // runesTable: {
         //    8100: [[8112, 8124, 8128, 9923], [8126, 8139, 8143], [8136, 8120, 8138], [8135, 8134, 8105, 8106]],
         //    8300: [[8351, 8360, 8369], [8306, 8304, 8313], [8321, 8316, 8345], [8347, 8410, 8352]],
         //    8000: [[8005, 8008, 8021, 8010], [9101, 9111, 8009], [9104, 9105, 9103], [8014, 8017, 8299]],
         //    8400: [[8437, 8439, 8465], [8446, 8463, 8401], [8429, 8444, 8473], [8451, 8453, 8242]],
         //    8200: [[8214, 8229, 8230], [8224, 8226, 8275], [8210, 8234, 8233], [8237, 8232, 8236]]
         // },
         runesTable: {
            8100: [['8112', '8124', '8128', '9923'], ['8126', '8139', '8143'], ['8136', '8120', '8138'], ['8135', '8134', '8105', '8106']],
            8300: [['8351', '8360', '8369'], ['8306', '8304', '8313'], ['8321', '8316', '8345'], ['8347', '8410', '8352']],
            8000: [['8005', '8008', '8021', '8010'], ['9101', '9111', '8009'], ['9104', '9105', '9103'], ['8014', '8017', '8299']],
            8400: [['8437', '8439', '8465'], ['8446', '8463', '8401'], ['8429', '8444', '8473'], ['8451', '8453', '8242']],
            8200: [['8214', '8229', '8230'], ['8224', '8226', '8275'], ['8210', '8234', '8233'], ['8237', '8232', '8236']]
         },
         mythicData: [],
      }
   },

   created() {
      console.log(this.backName)
      console.log(this.champion)
      this.getChampData()
      this.getMythicClusters()
      console.log('potato', this.mythicData)
      this.getItems()
      this.getRunes()
   },
   
   mounted() {

   },
      
   methods: {
      tabFocus(id, tab) {
         if (tab === 0) return (id = this.tldrTab) ? true : false
         if (tab === 1) return (id = this.mythicTab) ? true : false
      },

      activeSkill(i, j) {
         return (this.mythicData[this.mythicTab].tldr.levels[this.tldrTab][0][i-1] == j) ? true : false
      },

      activeSkillKey(i, j) {
         if (this.mythicData[this.mythicTab].tldr.levels[this.tldrTab][0][i - 1] == j) {
            return i
         }
      },
      
      activeRune(id, idx) {
         return (this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][idx].includes(id.toString())) ? true : false
      },

      flexRune(id, j) {
         if (this.mythicData[this.mythicTab].tldr.runes.length > 0) {
            return (this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][3][j] == id) ? true : false
         }
      },

      runeTree(i) {
         const t = this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][0][i]
         return this.runesTable[t]
      },

      tabClick(i) {
         this.mythicTab = this.mythicData.findIndex(el => i === el.id)
      },

      getItems() {
         const url = `https://ddragon.leagueoflegends.com/cdn/${this.patch}/data/en_US/item.json`
         axios.get(url).then(res => {
            this.items = res.data.data
         })
      },

      getRunes() {
         const url = `https://ddragon.leagueoflegends.com/cdn/${this.patch}/data/en_US/runesReforged.json`
         axios.get(url).then(res => {
            this.runes = res.data
         })
      },
      
      getMythicClusters() {
         const iter = (mythic, obj, name, container) => {
            if (!obj) return
            for (const [k, v] of Object.entries(obj)) {
               container.push([k, v.games, v.wins])
            }
            container.sort((a, b) => b[1] - a[1])
            mythic[name] = container
         }

         for (const k in this.champion.mythics) {
            // if (k === '0') continue
            let mythicWrapper
            if (k === '0') {
               mythicWrapper = {
                  id: k,
                  games: this.champion.mythics[k].games,
                  wins: this.champion.mythics[k].wins
               }
            } else {
               mythicWrapper = {
                  id: k,
                  games: this.champion.items[k].games,
                  wins: this.champion.items[k].wins
               }
            }
            this.mythicData.push(mythicWrapper)
         }

         this.mythicData.sort((a, b) => b.games - a.games)

         for (const i in this.mythicData) {
            const mythic = this.mythicData[i]
            let item = mythic.id
            let _itemPosition = [[], [], [], [], [], []]
            let _levelOrder = []
            let _skillPath = []
            let _runes = []
            let _spells = []
            let _startingItems = []
            let _coreBuild = []

            for (const [pos, v] of Object.entries(this.champion.mythics[item].items)) {
               let sum = 0
               for (const [k2, v2] of Object.entries(v)) {
                  sum += v2.games
                  _itemPosition[pos].push([k2, v2.games, v2.wins])
               }

               _itemPosition[pos].sort((a, b) => b[1] - a[1])
            }

            mythic.itemPosition = _itemPosition
            if (this.champion.mythics[item].coreBuild) {
               iter(mythic, this.champion.mythics[item].coreBuild, 'coreBuild', _coreBuild)
            }
            iter(mythic, this.champion.mythics[item].levelOrder, 'levelOrder', _levelOrder)
            iter(mythic, this.champion.mythics[item].skillPath, 'skillPath', _skillPath)
            iter(mythic, this.champion.mythics[item].spells, 'spells', _spells)
            iter(mythic, this.champion.mythics[item].startingItems, 'startingItems', _startingItems)
            iter(mythic, this.champion.mythics[item].runes, 'runes', _runes)

         }
      },

      abilityLetter(idx) {
         switch (idx) {
            case 0:
               return 'P'
            case 1:
               return 'Q'
            case 2:
               return 'W'
            case 3:
               return 'E'
            case 4:
               return 'R'
         }
      },

      getAbilityImages(name, idx) {
         return (idx === 0) ? `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/passive/${name}` :
            `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/spell/${name}.png`
      },

      getChampData() {
         const url = `https://ddragon.leagueoflegends.com/cdn/${this.patch}/data/en_US/champion/${this.backName}.json`
         axios.get(url).then(res => {
            const tomato = res.data.data[this.backName]
            // console.log('tomato', tomato)
            this.title = tomato.title
            this.abilities.push(tomato.passive.image.full)
            for (const spell of tomato.spells) {
               this.abilities.push(spell.id)
            }
         })
      },
   },

   computed: {
      getSpells() {
         const a = this.mythicData[this.mythicTab].spells
         if (this.tldrTab === 0) {
            return a.filter(r => (r[1] / this.mythicData[this.mythicTab].games) >= this.parameters.thresholds.core)
               .sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
         } else {
            return a.sort((a, b) => b[1] - a[1])[0]
         }
         
      },

      background() {
         const img = new URL(`../../assets/champion_splash/${this.backName.toLowerCase()}.webp`, import.meta.url).href
         return `linear-gradient(to right, rgba(var(--tint100RGB), 1.0), rgba(var(--tint100RGB), 0.9) 10%, rgba(var(--tint100RGB), .8) 60%, rgba(var(--tint100RGB), .7) 90%), no-repeat -20% 15%/100% url('${img}')`
      },

      championWinrate() {
         return `${Math.round((this.champion.wins / this.champion.games) * 1000) / 10}%`
      },

      champIcon() {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/${this.backName}.png`
      },

      keystone() {
         console.log(this.mythicData[this.mythicTab][9][0][0].split('|'))
         return this.mythicData[this.mythicTab][9][0][0].split('|')[1].split('_')[0]
      },

      flexRunes() {
         return [[5008, 5005, 5007], [5008, 5002, 5003], [5001, 5002, 5003]]
      },

      getPrimaryRuneTable() {
         if (this.mythicData[this.mythicTab].tldr.runes.length > 0 && this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][0]) {
            const t = this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][0][0]
            return this.runesTable[t]
         }
      },
      
      getSecondaryRuneTable() {
         if (this.mythicData[this.mythicTab].tldr.runes.length > 0) {
            const t = this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][0][1]
            return this.runesTable[t].slice(1, 4)
         }
      },

      getFlexRunes() {
         if (this.mythicData[this.mythicTab].tldr.runes.length > 0) {
            const t = this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][3]
            return t
         }
      },

      getRuneWinrate() {
         if (this.mythicData[this.mythicTab].tldr.runes.length > 0) {
            return this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][4]
         }
      }
   },

   props: {
      champion: null,
      patch: null
   }
}


</script>

<template>
   <div class="champion-ready-main">
      <div class="champion-wrapper">
         <div class="test">
            <p>
               This page not finished. Check out the 11/7 update in <router-link to="/updates">updates</router-link>
            </p>
         </div>
         <div class="champion-head" :style="{ background: background }">
            <div class="champion-profile">
               <div class="champion-image">
                  <img :src="champIcon" alt="" @click="test()">
               </div>
               <div class="champion-right">
                  <div class="champion-name">
                     {{this.champion.name}} <h2>{{ this.title }}</h2>
                  </div>
                  <div class="champion-abilities">
                     <div v-for="(img, i) in this.abilities">
                        <img :src="getAbilityImages(img, i)" rel="preload">
                        <div class="spell-letter">
                           {{ abilityLetter(i) }}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="champion-header-cell">
               <h3>Winrate</h3>
               {{ championWinrate }}
               <h4>
                  {{ this.champion.games }} games
               </h4>
            </div>
         </div>

         <div class="master-tabs">
            <div :class="{'tab-focus' : this.masterTab === 0 }" @click="this.masterTab = 0" class="tab">
               tldr
            </div>
            <div :class="{'tab-focus' : this.masterTab === 1 }" @click="this.masterTab = 1" class="tab">
               Items
            </div>
            <div :class="{'tab-focus' : this.masterTab === 2 }" @click="this.masterTab = 2" class="tab">
               Runes
            </div>
         </div>

         <div class="champion-body">

            <div v-if="this.masterTab === 0" class="mythics section">
               <Mythics
                  :mythic-data="this.mythicData"
                  :champion="this.champion"
                  :patch="this.patch"
                  :parameters="this.parameters"
                  :items="this.items"
                  :runes="this.runes"
                  :runes-table="this.runesTable"/>
            </div>

            <div v-if="this.masterTab === 1" class="items section">
               <Items
                  :mythic-data="this.mythicData"
                  :champion="this.champion"
                  :patch="this.patch"
                  :parameters="this.parameters"
                  :items="this.items" />
            </div>
               
            <div v-if="this.masterTab === 2" class="runes section">
               <Runes
                  :mythic-data="this.mythicData"
                  :champion="this.champion"
                  :patch="this.patch"
                  :parameters="this.parameters"
                  :items="this.items"
                  :runes-table="this.runesTable"/>
            </div>

         </div>
      </div>
   </div>
</template>

<style scoped>
   .champion-name {
      display: inline-block;
   }

   .champion-name h2 {
      display: inline-block;
      margin: 0;
      margin-left: 0.2rem;
      font-style: italic;
      font-size: 1rem;
      font-weight: normal;
      color: var(--tint400);
   }
   .champion-right {
      display: flex;
      height: 100%;
      justify-content: space-evenly;
      flex-direction: column;
      font-size: 1.5rem;
   }
   .champion-profile {
      gap: 20px;
      height: 100px;
      display: flex;
      flex-direction: row;
      align-items: center;
   }

   .champion-head {
      display: flex;
      border-radius: 15px;
      align-items: center;
      height: 200px;
      padding: 0;
      gap: 4rem;
      width: 100%;
      font-size: 1.3rem;
      font-weight: bold;
      color: var(--color-font);
   }

   .champion-head h3 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: normal;
      color: var(--tint400);
   }
   
   .champion-head h4 {
      margin: 0;
      font-size: 0.9rem;
      font-style: italic;
      font-weight: normal;
      color: var(--tint400);

   }

   .champion-image {
      overflow: hidden;
      margin-left: 40px;
      width: 100px;
      height: 100px;
      border-radius: 10px;
      box-shadow: 0 0 0 4px var(--color-background);
   }

   .champion-abilities {
      height: 38px;
   }
   .champion-abilities img {
      width: 36px;
      border: 1px solid var(--tint400);
   }
   
   .champion-abilities > div {
      display: inline-block;
   }

   .spell-letter {
      position: relative;
      top: -23px;
      left: -9px;
      font-size: 0.85rem;
      background: rgba(13, 17, 28, 0.9);
      font-weight: normal;
      text-align: center;
      width: 0.9rem;

   }
   .champion-abilities div:not(:first-child) {
      margin-left: 10px;
   }

   .champion-image img {
      width: 100%;
      transform: scale(1.1);
   }

   .champion-wrapper {
      width: 1100px;
   }

   .champion-ready-main {
      margin-top: 10vh;
      display: flex;
      align-items: center;
      flex-direction: column;
   }

   .champion-body {
      margin-top: 30px;
      color: var(--color-font);
   }

   .champion-body h2 {
      color: var(--tint400);
      margin: 1rem;
      font-size: 1.1rem;
      font-style: italic;
      font-weight: normal;
   }
   
   .master-tabs {
      margin-top: 40px;
      border-bottom: 1px solid var(--tint400);
   }
   
   .master-tabs .tab {
      font-size: 0.85rem;
      text-align: center;
      color: var(--color-font);
      border-radius: 15px 15px 0 0;
      display: inline-block;
      padding: .5rem 1.5rem;
      border-bottom: 0;
      /* margin-bottom: -1px; */
   }
   .master-tabs .tab:not(:first-child) {
      margin-left: 15px;
   }

   .tab {
      display: flex;
      align-items: center;
      background: var(--tint100);
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      padding: 0.5rem 1.5rem 0.5rem 0.5rem;
      gap: 0.5rem;
      transition: 0.25s;
   }

   .tab-focus {
      border: 1px solid var(--tint400);
   }

   .tab:hover {
      background: var(--hoverButton);
   }
   
   .test {
      background: rgb(120, 161, 199);
      border: 1px solid rgb(63, 100, 201);
      width: 100%;
      text-align: center;
      margin: 1rem 0;
      border-radius: 15px;
   }

   
</style>