<script>
import axios from 'axios'
import champions from '../../constants/champions'

export default {
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
            trailingDuplicates: false,
            trailingExtended: 2,
         },
         title: '',
         mythicTab: 0,
         tldrTab: 0,
         items: null,
         runesTable: {
            8100: [[8112, 8124, 8128, 9923], [8126, 8139, 8143], [8136, 8120, 8138], [8135, 8134, 8105, 8106]],
            8300: [[8351, 8360, 8369], [8306, 8304, 8313], [8321, 8316, 8345], [8347, 8410, 8352]],
            8000: [[8005, 8008, 8021, 8010], [9101, 9111, 8009], [9104, 9105, 9103], [8014, 8017, 8299]],
            8400: [[8437, 8439, 8465], [8446, 8463, 8401], [8429, 8444, 8473], [8451, 8453, 8242]],
            8200: [[8214, 8229, 8230], [8224, 8226, 8275], [8210, 8234, 8233], [8237, 8232, 8236]]
         },
         runes: null,
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
      activeRune(id) {
         // console.log(this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][0], id, this.mythicData[this.mythicTab].tldr.runes[this.runesTab][0].includes(id))
         // if (this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][0].includes(id)) {
         //    return true
         // } else {
         //    return false
         // }
         return (this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][0].includes(id.toString())) ? true : false
      },

      flexRune(id, j) {
         return (this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][0].split('|')[4].split('_')[j] == id) ? true : false
      },

      runeTree(i) {
         // const t = this.mythicData[this.mythicTab].runes[this.runesTab][0].split('|')[i]
         const t = this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][0].split('|')[i]
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
            // console.log('roons', this.runes)
         })
      },
      
      winrate(total, win) {
         return `${Math.round( win / total * 1000) / 10}%`
      },

      tldrRunes(mythic) {
         const sum = mythic.runes.reduce((c, a) => c + a[1], 0)

         const winrate = mythic.runes.filter(o => (o[1] / sum) > this.parameters.thresholds.core).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
         const popular = mythic.runes[0]

         mythic.tldr.runes.push(winrate, popular)

         /* 
            Parse individual rune winrate???
         */
         
         // let winrateStr = '_'
         // let popularStr = '_'
         // // Keystone
         // for (const p in this.champion.mythics[item].primaryRunes) {
         //    const rowSum = Object.values(this.champion.mythics[item].primaryRunes[p]).reduce((c, a) => c + a.games, 0)

         //    const topRowRune = Object.entries(this.champion.mythics[item].primaryRunes[p])
         //       .filter(o => (o[1].games / rowSum) > this.parameters.thresholds.core)
         //       .sort((a, b) => (b[1].wins / b[1].games) - (a[1].wins / a[1].games))[0][0]

         //       winrateStr += topRowRune + '_'
         // }
         // console.log(winrateStr)

         // Get most popular rune combination

      },

      tldrBuilds(mythic, mode) {
         const sum = mythic.coreBuild.reduce((c, a) => c + a[1], 0)
         let core
         if (!mode) {
            /* 
               Some champs like jarvan present too uniform of a distribution to use this.parameters.thresolds.core (0.10) as a demarcation; needs to be set dynamically.
               Can compute variance of the of the top ~4 highest playrate and then use that as a weight for threshold?
            */
            core = mythic.coreBuild.filter(o => (o[1] / sum) > .05).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
         } else {
            core = mythic.coreBuild[0]
         }

         let container = []
         let blacklist = []
         blacklist = core[0].split('_')

         for (let u = 3; u < 6; u++) {
            const trailSum = mythic.itemPosition[u].reduce((c, a) => c + a[1], 0)
            const filtered = (this.parameters.trailingDuplicates) ? mythic.itemPosition[u] : mythic.itemPosition[u].filter(o => !blacklist.includes(o[0]))
            const trailing = filtered.filter(o => (o[1] / trailSum) > this.parameters.thresholds.trail).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1])).slice(0, this.parameters.trailingExtended)

            for (const v in trailing) {
               blacklist.push(trailing[v][0])
            }

            container.push(trailing)
         }

         mythic.tldr.builds.push([core, container])
      },

      getMythicClusters() {
         
         const iter = (mythic, obj, name, container) => {
            for (const [k, v] of Object.entries(obj)) {
               container.push([k, v.games, v.wins])
            }
            container.sort((a, b) => b[1] - a[1])
            mythic[name] = container
         }

         const runeIter = (obj) => {
            let container = []
            for (const [k, v] of Object.entries(obj)) {
               container.push([k, v.games, v.wins])
            }
            container.sort((a, b) => b[1] - a[1])
            return container
         }

         for (const k in this.champion.mythics) {
            if (k === '0') continue
            const mythicWrapper = {
               id: k,
               games: this.champion.items[k].games,
               wins: this.champion.items[k].wins
            }
            this.mythicData.push(mythicWrapper)
         }

         this.mythicData.sort((a, b) => b.games - a.games)

         for (const i in this.mythicData) {
            const mythic = this.mythicData[i]
            let item = mythic.id
            let _itemPosition = [[], [], [], [], [], []]
            let _positionMeta = [[], [], [], [], [], []]
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
               _positionMeta[pos].push(sum)
            }

            mythic.itemPosition = _itemPosition
            mythic.positionMeta = _positionMeta

            iter(mythic, this.champion.mythics[item].coreBuild, 'coreBuild', _coreBuild)
            iter(mythic, this.champion.mythics[item].levelOrder, 'levelOrder', _levelOrder)
            iter(mythic, this.champion.mythics[item].skillPath, 'skillPath', _skillPath)
            iter(mythic, this.champion.mythics[item].spells, 'spells', _spells)
            iter(mythic, this.champion.mythics[item].startingItems, 'startingItems', _startingItems)
            iter(mythic, this.champion.mythics[item].runes, 'runes', _runes)

            // mythic.runeTotals = {
            //    keystone: {},
            //    primary: {}, 
            //    secondary: {},
            //    tertiary: {
            //       offense: {},
            //       flex: {},
            //       defense: {},
            //    },
            // }
            // mythic.runeTotals = {
            //    keystone: this.champion.mythics[item].runesTotals.keystone,
            //    primary: this.champion.mythics[item].runesTotals.primary,
            //    secondary: this.champion.mythics[item].runesTotals.secondary,
            //    tertiary: {
            //       offense: this.champion.mythics[item].runesTotals.tertiary.offense,
            //       flex: this.champion.mythics[item].runesTotals.tertiary.flex,
            //       defense: this.champion.mythics[item].runesTotals.tertiary.defense,
            //    },
            // }

            // mythic.runeTotals.keystone = runeIter(this.champion.mythics[item].runesTotals.keystone)
            // mythic.runeTotals.primary = runeIter(this.champion.mythics[item].runesTotals.primary)
            // mythic.runeTotals.secondary = runeIter(this.champion.mythics[item].runesTotals.secondary)
            // mythic.runeTotals.tertiary.offense = runeIter(this.champion.mythics[item].runesTotals.tertiary.offense)
            // mythic.runeTotals.tertiary.flex = runeIter(this.champion.mythics[item].runesTotals.tertiary.flex)
            // mythic.runeTotals.tertiary.defense = runeIter(this.champion.mythics[item].runesTotals.tertiary.defense)

            /* 
               TLDR
            */
            mythic.tldr = {}
            mythic.tldr.builds = []
            mythic.tldr.runes = []
            
            this.tldrBuilds(mythic, 0)
            this.tldrBuilds(mythic, 1)
            this.tldrRunes(mythic)
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

      getItemName(i) {
         if (this.items !== null) return this.items[i].name
      },

      itemImage(Id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${Id}.png`
      },

      toggleItemBin(Id) {
         const idx = this.itemBin.indexOf(Id)
         (idx === -1) ? this.itemBin.push(Id) : this.itemBin.splice(idx, 1)
         // if (idx === -1) {
         //    this.itemBin.push(Id)
         // }
         // else {
         //    this.itemBin.splice(idx, 1)
         // }
      },

      runeEndpointImage(path) {
         return `https://ddragon.leagueoflegends.com/cdn/img/${path}` 
      },

      runeImage(id) {
         return new URL(`../../assets/runes/${id}.png`, import.meta.url).href
      },
      
      flexRuneImage(id) {
         return new URL(`../../assets/runes/flex/${id}.png`, import.meta.url).href
      }

   },

   computed: {
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

         <div class="champion-body">
            <div class="tldr section">

               <h2>tldr</h2>
               <div class="tldr-top">
                  <div class="tldr-top-tabs">
                     <div class="tab" @click="this.tldrTab = 0">
                        Highest winrate
                     </div>
                     <div class="tab" @click="this.tldrTab = 1">
                        Most popular
                     </div>
                  </div>
               </div>

               <div class="tldr-body-wrapper">
                  <div class="tldr-tabs">
                     <div class="tab" @click="tabClick(mythic.id)" v-for="mythic in this.mythicData" :key="mythic[0]">
                        <img rel="preload" :src="itemImage(mythic.id)" alt="">
                        <div class="tab-sub">
                           <h4> {{ winrate(mythic.games, mythic.wins) }} </h4>
                           <h3> ({{ mythic.games }}) </h3>
                        </div>
                     </div>
                  </div>

                  <div class="tldr-body">
                     <div class="tldr-left">

                        <!-- <div class="runes-tab-wrapper">
                            <div class="tldr-runes-tab" @click="this.runesTab = i" v-for="(runes, i) in this.mythicData[this.mythicTab].runes.slice(0, 3)">
                              <div class="rune-images">
                                 <img class="main" rel="preload" :src="runeImage(runes[0].split('|')[1].split('_')[0])" alt="">
                                 <img class="secondary" rel="preload" :src="runeImage(runes[0].split('|')[2])" alt="">
                              </div>
                              <div class="tab-sub">
                                 <h4> {{ winrate(runes[1], runes[2]) }} </h4>
                                 <h3> ({{ runes[1] }}) </h3>
                              </div>
                           </div>
                        </div> -->
                        
                        <div class="tldr-runes-wrapper">

                           <div class="tldr-primary-runes">
                              <div class="tldr-rune-row" v-for="(row, i) in this.runeTree(0)" :key="i">
                                 <img rel="preload" :class="{ 'active-rune': activeRune(rune) }" :src="runeImage(rune)" alt="" v-for="(rune, j) in row" :key="j">
                              </div>
                           </div>
                           
                           <div class="tldr-minors">
                              <div class="tldr-secondary-runes">
                                 <div class="tldr-rune-row" v-for="(row, i) in this.runeTree(2).slice(1, 4)" :key="i">
                                    <img rel="preload" :class="{ 'active-rune': activeRune(rune) }" :src="runeImage(rune)" alt="" v-for="(rune, j) in row" :key="j">
                                 </div>
                              </div>
                              <div class="tldr-flex-runes">
                                 <div class="tldr-rune-row" v-for="(row, i) in flexRunes" :key="i">
                                    <img rel="preload" :class="{ 'active-rune': flexRune(rune, i) }" :src="flexRuneImage(rune)" alt="" v-for="(rune, j) in row" :key="j">
                                 </div>
                              </div>
                           </div>
                        </div>


                        <div class="tldr-misc">
                           spells & level order go here?
                        </div>
                     </div>
                     <div class="tldr-right">
                        <div class="tldr-items">
                           <!-- <div class="core-items">
      
                              <h2>Core</h2>
                              <div class="item-set" v-for="(set, i) in this.mythicData[this.mythicTab][4].slice(0, 2)" :key="i">
                                 <img :src="itemImage(img)" alt="" v-for="(img, j) in set[0].split('_')" :key="j">
                                 <div class="image-sub">
                                    <h4> {{ winrate(set[1], set[2]) }} </h4>
                                    <h3> ({{ set[1] }}) </h3>
                                 </div>
                              </div>
      
                           </div> -->
                           <div class="item" v-for="(item, i) in this.mythicData[this.mythicTab].tldr.builds[this.tldrTab]" :key="i">
                              
                              <div v-if="i === 0" class="core-items">
                                 <h2>Core</h2>
                                 <div class="tldr-wrapper">
                                    <img :src="itemImage(id)" alt="" v-for="id in item[0].split('_')" :key="id">
                                    <div class="image-sub">
                                       <h4> {{ winrate(item[1], item[2]) }} </h4>
                                       <h3> ({{ item[1] }}) </h3>
                                    </div>
                                 </div>
                              </div>
                                 
                              <div v-else class="trailing-items">
                                 <div class="item" v-for="(item, j) in item" :key="j">
                                    <h2>{{ j + 4  }}</h2>
                                    <div class="tldr-wrapper" v-for="(id, k) in item" :key="k">
                                       <img :src="itemImage(id[0])"  alt="">
                                       <div class="image-sub">
                                          <h4> {{ winrate(id[1], id[2]) }} </h4>
                                          <h3> ({{ id[1] }}) </h3>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              
                           </div>
                        </div>
                        <div class="tldr-abilities">
                           abilities go here?
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            <div class="builds section">
               <h2>Builds</h2>
               <div class="item-bin">
                  <img :src="itemImage(i)" @click="this.toggleItemBin(i)" rel="preload" v-for="i in Object.keys(this.champion.items)">
               </div>

            </div>

            <div class="abilities section">
               <h2>Abilities</h2>
               
            </div>

            <div class="runes section">
               <h2>Runes</h2>
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
      /* justify-content: space-between; */
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
      /* border-radius: 100%; */
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

   .champion-body-tabs {
      margin-top: 50px;
      color: var(--color-font);
      border-bottom: 1px solid var(--tint400);
      width: 100%;
   }

   .champion-body-tabs div:first-child {
   /* margin-left: 0.8rem; */
   }

   .champion-body-tabs div:not(:first-child) {
      margin: 0 1rem;
   }

   .champion-body {
      margin-top: 50px;
      color: var(--color-font);
   }

   .champion-body h2 {
      color: var(--tint400);
      margin: 1rem;
      font-size: 1.1rem;
      font-style: italic;
      font-weight: normal;
   }
   
   .section > h2 {   
      color: var(--light400);
      display: inline-block;
      width: 113px;
      margin: 1rem 0;
      text-align: center;
   }
   
   .tldr-top {
      display: inline-block;
      flex-direction: row;
   }
   
   .tldr-top-tabs {
      display: flex;
      flex-direction: row;
      gap: 10px;
   }
   .tldr-top-tabs .tab {
      font-size: 0.85rem;
      padding: 0.5rem 1rem;

   }

   .tldr-body-wrapper {
      display: flex;
   }

   .tldr-tabs {
      /* width: 100px; */
      overflow-y: scroll;
      overflow-x: hidden;
      height: 300px;
      margin-right: 8px;
      padding-right: 5px;
   }

   .tab {
      display: flex;
      align-items: center;
      background: var(--tint100);
      border-radius: 10px;
      cursor: pointer;
      padding: 0.5rem 1.5rem 0.5rem 0.5rem;
      gap: 0.5rem;
      transition: 0.25s;
   }

   .tldr-tabs .tab:not(:last-child) {
      margin-bottom: 0.25rem;
   }

   .tab-sub h4 {
      display: block;
      color: var(--tint500);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .tab-sub h3 {
      display: block;
      color: var(--tint400);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }

   .tldr-tabs::-webkit-scrollbar {
      width: 4px;
   }

   /* Track */
   .tldr-tabs::-webkit-scrollbar-track {
      border-radius: 5px;
   }

   /* Handle */
   .tldr-tabs::-webkit-scrollbar-thumb {
      background: var(--tint200);
      border-radius: 5px;
      
   }

   /* Handle on hover */
   .tldr-tabs::-webkit-scrollbar-thumb:hover {
      background: var(--tint300);
      transition: 0.25s;
   }

   .tldr-tabs img {
      width: 30px;
      border: 1px solid var(--tint400);
   }

   .tab:hover {
      background: var(--hoverButton);
   }

   .tldr-body {
      display: flex;
      width: 100%;
      background: var(--tint100);
      border-radius: 15px;
      justify-content: space-evenly;
   }

   .tldr-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-direction: column;
   }
   
   .tldr-right {
      display: flex;
      flex-direction: column;
   }

   .tldr-items {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
   }

   .runes-tab-wrapper {
      margin-top: 10px;
      display: flex;
      gap: 10px;
   }

   .tldr-runes-tab {
      display: flex;
      align-items: center;
      background: var(--hoverButton);
      border-radius: 8px;
      padding: 0.15rem .35rem;
      cursor: pointer;
   }
   .rune-images {
      position: relative;
      width: 35px;
      height: 24px;
   }

   .tldr-runes-tab img {
      width: 24px;
   }

   .tldr-runes-tab img.main {
      filter: drop-shadow(0px 0px 2px rgba(0,0,0,1));
   }

   .tldr-runes-tab img.secondary {
      position: absolute;
      filter: drop-shadow(0px 0px 2px rgba(0,0,0,.8)) saturate(1.25);
      bottom: 0;
      left: 16px;
      width: 18px;
   }

   .tldr-runes-wrapper {
      display: flex;
      gap: 40px;
      /* align-items: center; */
   }

   .tldr-primary-runes {
      width: 120px;
      display: flex;
      flex-direction: column;
      gap: 8px;
   }

   .tldr-minors {
      display: flex;
      flex-direction: column;
      gap: 15px;
      align-items: center;
   }

   .tldr-secondary-runes {
      display: flex;
      width: 110px;
      flex-direction: column;
      gap: 8px;
   }
   .tldr-flex-runes {
      display: flex;
      width: 110px;
      flex-direction: column;
      gap: 3px;
   }

   .tldr-rune-row {
      display: flex;
      justify-content: space-around;
   }
   .tldr-primary-runes .tldr-rune-row:first-child img {
      width: 36px;
      border: none;
   }

   .tldr-flex-runes img {
      width: 25px;
      background: rgba(0, 0, 0, 0.15);
      border-radius: 100%;
      filter: saturate(0);
   }
   
   .tldr-secondary-runes img {
      width: 30px;
      filter: saturate(0);
      border-radius: 100%;
      border: 1px solid var(--color-background);
   }
   
   .tldr-primary-runes img {
      width: 30px;
      filter: saturate(0);
      border-radius: 100%;
      border: 1px solid var(--color-background);
   }
   .tldr-primary-runes img.active-rune, .tldr-secondary-runes img.active-rune {
      filter: saturate(1);
      border: 1px solid var(--tint400);
   }

   .tldr-flex-runes img.active-rune {
      filter: saturate(1.25);
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid var(--tint400);
   }

   .image-sub {
      text-align: center;
   }

   .image-sub h4 {
      display: inline-block;
      color: var(--tint500);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .image-sub h3 {
      display: inline-block;
      color: var(--tint400);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
      margin-left: 0.3rem;
      /* font-style: italic; */
   }

   .core-items {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
   }

   .core-items img {
      margin: 0 10px;
      width: 34px;
      border: 1px solid var(--tint400);
   }

   
   .trailing-items {
      display: flex;
      gap: 10px;
   }

   .trailing-items .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 71px;
      gap: 5px;
   }

   .trailing-items .item img {
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 34px;
      border: 1px solid var(--tint400);
   }   
   .item h2 {
      font-size: 1rem;
   }

   .item-bin {
      padding: 1rem 0;
      border-radius: 15px;
      background: var(--tint100);
      justify-content: center;
      width: 100%;
   }

   .item-bin img {
      width: 40px;
   }


</style>