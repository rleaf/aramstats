<script>
   export default {
      data() {
         return {
            mythicTab: 0,
            tldrTab: 0,
            itemTab: 0,
            renderKey: 0,
            runesTable: {
               8100: [[8112, 8124, 8128, 9923], [8126, 8139, 8143], [8136, 8120, 8138], [8135, 8134, 8105, 8106]],
               8300: [[8351, 8360, 8369], [8306, 8304, 8313], [8321, 8316, 8345], [8347, 8410, 8352]],
               8000: [[8005, 8008, 8021, 8010], [9101, 9111, 8009], [9104, 9105, 9103], [8014, 8017, 8299]],
               8400: [[8437, 8439, 8465], [8446, 8463, 8401], [8429, 8444, 8473], [8451, 8453, 8242]],
               8200: [[8214, 8229, 8230], [8224, 8226, 8275], [8210, 8234, 8233], [8237, 8232, 8236]]
            },      
         }
      },

      created() {
         for (const i in this.mythicData) {
            const mythic = this.mythicData[i]

            mythic.tldr = {}
            mythic.tldr.builds = []
            mythic.tldr.runes = []
            mythic.tldr.levels = []
            mythic.tldr.levelOrder = []
            if (mythic.coreBuild) {
               this.tldrBuilds(mythic, 0)
               this.tldrBuilds(mythic, 1)
            }
            this.tldrRunes(mythic, mythic.id)
            this.tldrLevels(mythic)
            this.tldrLevelOrder(mythic)
         }
      },

      methods: {
         getTreeStuff(tree, mode) {
            const o = this.champion.mythics[this.mythicData[this.mythicTab].id].primaryRunes[tree]
            if (o) {
               return (mode === 0) ? o.games : o.wins
            }
         },
         getRuneGames(tree, j, rune) {
            const o = this.champion.mythics[this.mythicData[this.mythicTab].id].primaryRunes[tree]
            if (o) {
               if (o[`row${j}`][rune]) {
                  return o[`row${j}`][rune].games
               }
            }
         },
         getRuneWins(tree, j, rune) {
            const o = this.champion.mythics[this.mythicData[this.mythicTab].id].primaryRunes[tree]
            if (o) { 
               if (o[`row${j}`][rune]) {
                  return o[`row${j}`][rune].wins
               }
            }
         },
         toggleVerbose() {
            this.parameters.trailingDuplicates = true
            this.renderKey ++
         },
         getItemName(i) {
            if (this.items !== null) return this.items[i].name
         },
         activeSkill(i, j) {
            return (this.mythicData[this.mythicTab].tldr.levels[this.tldrTab][0][i - 1] == j) ? true : false
         },

         activeSkillKey(i, j) {
            const table = {
               1: 'q',
               2: 'w',
               3: 'e',
               4: 'r',
            }
            if (this.mythicData[this.mythicTab].tldr.levels[this.tldrTab][0][i - 1] == j) {
               return i
            }
            // (this.mythicData[this.mythicTab].tldr.levels[this.tldrTab][0][i-1] == j) ? true : false
         },
         activeRune(id, idx) {
            return (this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][idx].includes(id.toString())) ? true : false
         },

         flexRune(id, j) {
            if (this.mythicData[this.mythicTab].tldr.runes.length > 0) {
               return (this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][3][j] == id) ? true : false
            }
            // return (this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][3].includes(id.toString())) ? true : false
         },

         runeTree(i) {
            // const t = this.mythicData[this.mythicTab].runes[this.runesTab][0].split('|')[i]
            const t = this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][0][i]
            return this.runesTable[t]
         },
         runeEndpointImage(path) {
            return `https://ddragon.leagueoflegends.com/cdn/img/${path}`
         },

         runeImage(id) {
            return new URL(`../../../assets/runes/${id}.png`, import.meta.url).href
         },

         spellImage(id) {
            return new URL(`../../../assets/spells/${id}.webp`, import.meta.url).href
         },

         flexRuneImage(id) {
            return new URL(`../../../assets/runes/flex/${id}.png`, import.meta.url).href
         },
         itemImage(Id) {
            return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${Id}.png`
         },

         winrate(total, win) {
            return `${Math.round(win / total * 1000) / 10}%`
         },

         tldrRunes(mythic, item) {
            // const sum = mythic.runes.reduce((c, a) => c + a[1], 0)
            // const winrate = mythic.runes.filter(o => (o[1] / sum) > this.parameters.thresholds.core).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
            // const popular = mythic.runes[0]
            // mythic.tldr.runes.push(winrate, popular)


            let maxRuneCombination = [[], [], [], []] // trees, primary, secondary, flex
            let maxRuneWinrates = [] // primary tree, ...primary runes, secondary tree, ...secondary runes, flex runes

            let popularRuneCombination = [[], [], [], []]
            let popularRuneWinrates = []

            let primaryTree
            let popularTree

            let popularTreeWinrate = 0
            let primaryTreeWinrate = 0

            let popularTreeGames = 0

            // Get the primary tree for the highest winrate and the most popular
            for (const [lorax, v] of Object.entries(this.champion.mythics[item].primaryRunes)) {
               if ((v.games / mythic.games) >= this.parameters.thresholds.core && (v.wins / v.games) > primaryTreeWinrate) {
                  primaryTreeWinrate = (v.wins / v.games)
                  primaryTree = lorax
               }

               if (v.games > popularTreeGames) {
                  popularTreeWinrate = (v.wins / v.games)
                  popularTreeGames = v.games
                  popularTree = lorax
               }
            }
            maxRuneWinrates.push(primaryTreeWinrate)
            popularRuneWinrates.push(popularTreeWinrate)


            if (!primaryTree) {
               // mythic.tldr.runes.push([[], [], [], [], []], [[], [], [], [], []])
               return
            } // better err handling later
            maxRuneCombination[0].push(primaryTree)
            popularRuneCombination[0].push(popularTree)
            const primaryGames = this.champion.mythics[item].primaryRunes[primaryTree].games

            const getPrimaries = (tree, container, winrateContainer) => {
               for (const [k, v] of Object.entries(this.champion.mythics[item].primaryRunes[tree])) {
                  if (k === 'games' || k === 'wins') continue
                  let rune
                  let winrate = 0

                  if (tree = popularTree) {
                     let games = 0
                     for (const [k2, v2] of Object.entries(v)) {
                        if (v2.games > games) {
                           games = v2.games
                           winrate = (v2.wins / v2.games)
                           rune = k2
                        }
                     }
                  } else {
                     for (const [k2, v2] of Object.entries(v)) {
                        if ((v2.games / primaryGames) >= this.parameters.thresholds.core && (v2.wins / v2.games) > winrate) {
                           winrate = (v2.wins / v2.games)
                           rune = k2
                        }
                     }
                  }

                  container[1].push(rune)
                  winrateContainer.push(winrate)
               }
            }

            const getSecondaryTree = (_primaryTree, winrateContainer) => {
               let tree
               let winrate = 0
               if (_primaryTree === primaryTree) {
                  for (const [lorax, v] of Object.entries(this.champion.mythics[item].secondaryRunes)) {
                     if (lorax === _primaryTree) continue
                     if ((v.games / (mythic.games - primaryGames)) >= this.parameters.thresholds.core && (v.wins / v.games) > winrate) {
                        winrate = (v.wins / v.games)
                        tree = lorax
                     }

                  }
               } else {
                  let iter = 0
                  for (const [lorax, v] of Object.entries(this.champion.mythics[item].secondaryRunes)) {
                     if (lorax === _primaryTree) continue
                     if (v.games > iter) {
                        winrate = (v.wins / v.games)
                        iter = v.games
                        tree = lorax
                     }
                  }
               }
               winrateContainer.push(winrate)
               return tree
            }

            const getSecondaries = (_secondaryTree, container, winrateContainer) => {
               /* 
                  this is so ugly. pls fix
               */

               let bin = []
               // Secondary highest winrate
               if (_secondaryTree === secondaryTreeMax) {
                  let secondaryGames = this.champion.mythics[item].secondaryRunes[_secondaryTree].games
                  for (const [k, v] of Object.entries(this.champion.mythics[item].secondaryRunes[_secondaryTree])) {
                     if (k === 'games' || k === 'wins') continue
                     let contender
                     let iter = 0
                     for (const [k2, v2] of Object.entries(v)) {
                        if (v2.games / secondaryGames >= this.parameters.thresholds.core && (v2.wins / v2.games) > iter) {
                           iter = (v2.wins / v2.games)
                           contender = k2
                        }
                     }
                     bin.push([contender, iter])
                  }
               } else {
                  for (const [k, v] of Object.entries(this.champion.mythics[item].secondaryRunes[_secondaryTree])) {
                     if (k === 'games' || k === 'wins') continue
                     let contender
                     let iter = 0
                     let winrate = 0
                     for (const [k2, v2] of Object.entries(v)) {
                        if (v2.games > iter) {
                           iter = v2.games
                           winrate = (v2.wins / v2.games)
                           contender = k2
                        }
                     }
                     bin.push([contender, iter, winrate])
                  }
               }

               if (bin.length > 2) {
                  const val = bin.map(y => y[1])
                  const idx = val.indexOf(Math.min(...val))
                  bin.splice(idx, 1)
               }

               winrateContainer.push(...bin.map(x => x[x.length - 1]))
               container[2].push(...bin.map(x => x[0]))
            }


            getPrimaries(primaryTree, maxRuneCombination, maxRuneWinrates) // Get highest winrate or most popular primary runes
            const secondaryTreeMax = getSecondaryTree(primaryTree, maxRuneWinrates) // Get highest winrate or most popular secondary tree
            maxRuneCombination[0].push(secondaryTreeMax)
            getSecondaries(secondaryTreeMax, maxRuneCombination, maxRuneWinrates) // Get highest winrate or most popular secondary runes

            getPrimaries(popularTree, popularRuneCombination, popularRuneWinrates)
            const secondaryTreePopular = getSecondaryTree(popularTree, popularRuneWinrates)
            popularRuneCombination[0].push(secondaryTreePopular)
            getSecondaries(secondaryTreePopular, popularRuneCombination, popularRuneWinrates)

            // Flex runes
            for (const v of Object.values(this.champion.mythics[item].flexRunes)) {
               let maxFlexWinrate = 0
               let maxFlexRune
               let popularFlexWins = 0
               let popularFlexWinrate = 0
               let popularFlexRune
               for (const [k2, v2] of Object.entries(v)) {
                  if ((v2.games / mythic.games) >= this.parameters.thresholds.core && (v2.wins / v2.games) > maxFlexWinrate) {
                     maxFlexWinrate = (v2.wins / v2.games)
                     maxFlexRune = k2
                  }

                  if (v2.games > popularFlexWins) {
                     popularFlexWinrate = (v2.wins / v2.games)
                     popularFlexWins = v2.games
                     popularFlexRune = k2
                  }
               }
               maxRuneWinrates.push(maxFlexWinrate)
               popularRuneWinrates.push(popularFlexWinrate)


               maxRuneCombination[3].push(maxFlexRune)
               popularRuneCombination[3].push(popularFlexRune)
            }
            const maxAverage = Math.round(maxRuneWinrates.reduce((c, a) => c + a, 0) / maxRuneWinrates.length * 10000) / 100
            const popularAverage = Math.round(popularRuneWinrates.reduce((c, a) => c + a, 0) / popularRuneWinrates.length * 10000) / 100

            maxRuneCombination.push(maxAverage)
            popularRuneCombination.push(popularAverage)

            mythic.tldr.runes.push(maxRuneCombination, popularRuneCombination)
         },

         tldrBuilds(mythic, mode) {
            /* 
               make nice later. is ugly
            */
            const sum = mythic.coreBuild.reduce((c, a) => c + a[1], 0)
            let core
            let container = []
            let blacklist = []

            if (mode === 0) {
               /* 
                  Some champs like jarvan present too uniform of a distribution to use this.parameters.thresolds.core (0.10) as a demarcation; needs to be set dynamically.
                  Can compute variance of the of the top ~4 highest playrate and then use that as a weight for threshold?
               */
               core = mythic.coreBuild.filter(o => (o[1] / sum) >= .02).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
               // core = mythic.coreBuild.sort((a, b) => b[1] - a[1])[0]
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
            } else {
               core = mythic.coreBuild[0]
               blacklist = core[0].split('_')
   
               for (let u = 3; u < 6; u++) {
                  // const trailSum = mythic.itemPosition[u].reduce((c, a) => c + a[1], 0)
                  const filtered = (this.parameters.trailingDuplicates) ? mythic.itemPosition[u] : mythic.itemPosition[u].filter(o => !blacklist.includes(o[0]))
                  const trailing = filtered.sort((a, b) => b[1] - a[1]).slice(0, this.parameters.trailingExtended)
                  // const trailing = filtered.filter(o => (o[1] / trailSum) > this.parameters.thresholds.trail).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1])).slice(0, this.parameters.trailingExtended)
   
                  for (const v in trailing) {
                     blacklist.push(trailing[v][0])
                  }
   
                  container.push(trailing)
               }
            }


            mythic.tldr.builds.push([core, container])
         },

         tldrLevels(mythic) {
            const reg = /(.).*\1/
            const uniqueReg = /(.)(?<!\1.+)(?!.*\1)/
            const data = [...mythic.skillPath]
            let cleanedData = []

            for (const s in data.sort((a, b) => b[0].length - a[0].length)) {
               const levels = data[s]
               const path = levels[0].slice(3)
               const discriminator = levels[0].slice(0, 3).match(reg)
               let push = true
               let preLevels = ''

               if (this.champion.id === 221) preLevels += '1' // Zeri starts w/ point in q
               if (this.champion.id === 268) preLevels += '2' // Azir starts w/ point in w

               if (discriminator) {
                  // Standardize abnormal starting skill levels
                  const one = levels[0].slice(0, 3).match(uniqueReg)[0]
                  const two = discriminator[discriminator.length - 1]
                  preLevels += one + two.repeat(2)
               } else {
                  // Standardize normal skill levels
                  preLevels += '123'
               }

               const datum = [preLevels + path, levels[1], levels[2]]

               if (cleanedData.length === 0) {
                  cleanedData.push(datum)
                  continue
               }

               for (const w in cleanedData) {
                  if (cleanedData[w][0].includes(path) && path.length >= this.parameters.levelCutoff) {
                     cleanedData[w][1] += levels[1]
                     cleanedData[w][2] += levels[2]
                     push = false
                     break
                  }
               }

               if (push && path.length >= this.parameters.levelCutoff) cleanedData.push(datum)
            }

            const popular = cleanedData.sort((a, b) => b[1] - a[1])[0]
            const max = cleanedData.filter(a => (a[1] / mythic.games) >= this.parameters.thresholds.core).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
            mythic.tldr.levels.push(max, popular)
         },

         tldrLevelOrder(mythic) {
            const turkey = mythic.levelOrder
            const max = turkey.filter(o => (o[1] / mythic.games) >= this.parameters.thresholds.core)
               .sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
            const popular = turkey[0]
            mythic.tldr.levelOrder.push(max, popular)
         },
      },
      
      computed: {
         flexRunes() {
            return [[5008, 5005, 5007], [5008, 5002, 5003], [5001, 5002, 5003]]
         },
         getStartingItems() {
            const y = this.mythicData[this.mythicTab].startingItems
            if (this.tldrTab === 0) {
               return y.filter(a => (a[1] / this.mythicData[this.mythicTab].games) >= this.parameters.thresholds.core)
                  .sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
            } else {
               return y.sort((a, b) => b[1] - a[1])[0]
            }
         },

         getSpells() {
            const a = this.mythicData[this.mythicTab].spells
            if (this.tldrTab === 0) {
               return a.filter(r => (r[1] / this.mythicData[this.mythicTab].games) >= this.parameters.thresholds.core)
                  .sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
            } else {
               return a.sort((a, b) => b[1] - a[1])[0]
            }

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
         },
         // this.mythicData[this.mythicTab].tldr.builds[this.tldrTab]() {
         //    console.log(this.mythicData[this.mythicTab].tldr.builds[this.tldrTab])
         //    return this.mythicData[this.mythicTab].tldr.builds[this.tldrTab]
         // }
      },

      props: {
         patch: null,
         mythicData: null,
         champion: null,
         parameters: null,
         items: null,
         runes: null
      }
   }

</script>

<template>
   <div class="section-top">
      <h2>tldr</h2>
      <div class="section-top-right-wrapper">

         <div class="section-top-right">
            <div class="section-top-tabs">
               <div class="tab" :class="{ 'tab-focus': this.tldrTab === 0 }" @click="this.tldrTab = 0">
                  Highest winrate
               </div>
               <div class="tab" :class="{ 'tab-focus': this.tldrTab === 1 }" @click="this.tldrTab = 1">
                  Most popular
               </div>
            </div>
            <!-- <div class="tldr-toggle">
               <div @click="this.toggleVerbose()" class="tab">Verbose</div>
            </div> -->
         </div>

      </div>
   </div>

   <div class="tldr-body-wrapper">
      <div class="tldr-tabs">
         <div class="tab" :class="{ 'tab-focus': this.mythicTab === i }"  @click="this.mythicTab = i" v-for="(mythic, i) in this.mythicData" :key="i">
            <img rel="preload" :src="itemImage(mythic.id)" alt="">
            <div class="tab-sub">
               <h4> {{ winrate(mythic.games, mythic.wins) }} </h4>
               <h3> ({{ mythic.games }}) </h3>
            </div>
         </div>
      </div>

      <div class="tldr-body">
         <div class="tldr-left">

            <div class="tldr-items">
               <div class="item" v-for="(item, i) in this.mythicData[this.mythicTab].tldr.builds[this.tldrTab]" :key="i + this.renderKey">
               
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
                     <div class="item" v-for="(item, j) in item" :key="j + this.renderKey">
                        <h2>{{ j + 4 }}</h2>
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
         
            <div class="tldr-runes-wrapper">
               <div class="tldr-runes-right">
                  <div class="tldr-rune-row" v-for="(row, i) in getPrimaryRuneTable" :key="i">
                     <img rel="preload" :class="{ 'active-rune': activeRune(rune, 1) }" :src="runeImage(rune)" alt="" v-for="(rune, j) in row" :key="j">
                  </div>
               </div>
            
               <div class="tldr-runes-left">
                  <div class="tldr-secondary-flex-runes">
                     <div class="tldr-secondary-runes">
                        <div class="tldr-rune-row" v-for="(row, i) in getSecondaryRuneTable" :key="i">
                           <img rel="preload" :class="{ 'active-rune': activeRune(rune, 2) }" :src="runeImage(rune)" alt="" v-for="(rune, j) in row" :key="j">
                        </div>
                     </div>
                     <div class="tldr-flex-runes">
                        <div class="tldr-rune-row" v-for="(row, i) in flexRunes" :key="i">
                           <img rel="preload" :class="{ 'active-rune': flexRune(rune, i) }" :src="flexRuneImage(rune)" alt="" v-for="(rune, j) in row" :key="j">
                        </div>
                     </div>
                  </div>
                  <div class="tldr-rune-winrate">
                     Mean winrate: 
                     <h4>
                        {{ getRuneWinrate }}%
                     </h4>
                  </div>
                  <div class="tldr-level-winrate">
                     Leveling:
                     <h4>{{ winrate(this.mythicData[this.mythicTab].tldr.levels[this.tldrTab][1], this.mythicData[this.mythicTab].tldr.levels[this.tldrTab][2]) }}</h4>
                     <h3>({{ this.mythicData[this.mythicTab].tldr.levels[this.tldrTab][1] }})</h3>
                  </div>
               </div>
            </div>
         </div>
         <div class="tldr-right">
         
            <div class="tldr-starting">
               <h2>
                  Starting
               </h2>
               <img :src="itemImage(id)" alt="" v-for="(id, i) in getStartingItems[0].split('_')" :key="i">
               <div class="image-sub">
                  <h4> {{ winrate(getStartingItems[1], getStartingItems[2]) }} </h4>
                  <h3> ({{ getStartingItems[1] }}) </h3>
               </div>
            </div>
         
            <div class="tldr-spells">
               <h2>
                  Spells
               </h2>
               <img :src="this.spellImage(id)" alt="" v-for="(id, i) in getSpells[0].split('_')" :key="i">
               <div class="image-sub">
                  <h4> {{ winrate(getSpells[1], getSpells[2]) }} </h4>
                  <h3> ({{ getSpells[1] }}) </h3>
               </div>
            </div>

            <div class="tldr-levels">
               <div class="columns" v-for="i in 18" :key="i">
                  <div class="cell" :class="{ 'active-skill': activeSkill(i, j) }" v-for="j in 4" :key="j">
                     {{ activeSkillKey(i, j) }}
                  </div>
               </div>

            </div>

         </div>
      </div>
   </div>

   <div class="mythic-item-wrapper">
      <div class="section-top">

         <h2>not tldr</h2>
         <div class="section-top-right-wrapper">
   
            <div class="section-top-right">
               <div class="section-top-tabs">
                  <div :class="{ 'tab-focus': this.itemTab === 0 }" @click="this.itemTab = 0" class="tab">Runes</div>
                  <div :class="{ 'tab-focus': this.itemTab === 1 }" @click="this.itemTab = 1" class="tab">Items</div>
                  <div :class="{ 'tab-focus': this.itemTab === 2 }" @click="this.itemTab = 2" class="tab">Starting Items</div>
               </div>
               <!-- <div class="tldr-toggle">
               <div @click="this.toggleVerbose()" class="tab">Verbose</div>
            </div> -->
            <h3>({{ getItemName(this.mythicData[this.mythicTab].id) }})</h3>
            </div>
   
         </div>
      </div>
      <!-- <div class="item-tabs-wrapper">
         <div class="item-tabs">
         </div>
      </div> -->
      <div class="mythic-items">

         <div class="items-body">

            <div v-if="this.itemTab === 0" class="runes">
               <div class="rune-tree" v-for="(tree, i) in Object.entries(this.runesTable)" :key="i">
                  <img rel="preload" :src="runeImage(tree[0])" alt="">
                  <div class="image-sub">
                     <h4 v-if="this.getTreeStuff(tree[0], 0)">{{ winrate(this.getTreeStuff(tree[0], 0), this.getTreeStuff(tree[0], 1))}}</h4>
                     <h4 v-else>-</h4>
                     <h3>{{ this.getTreeStuff(tree[0], 0) || '-' }}</h3>
                  </div>
                  <div class="rune-row" :class="{ 'keystone-row': j === 0}" v-for="(row, j) in tree[1]" :key="j">
                     <div class="rune"  v-for="(rune, k) in row" :key="k">
                        <img rel="preload" :class="{ 'keystones': j === 0 }" :src="runeImage(rune)" alt="">
                        <div class="image-sub-block">
                           <h4 v-if="this.getRuneGames(tree[0], j, rune)">{{ this.winrate(this.getRuneGames(tree[0], j, rune), this.getRuneWins(tree[0], j, rune)) }}</h4>
                           <h4 v-else>-</h4>
                           <h3>{{ this.getRuneGames(tree[0], j, rune) || '-' }}</h3>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
            <div v-if="this.itemTab === 1" class="all-items">
               <div class="item-row" v-for="i in 6" :key="i">
                  <h2>
                     {{ i }}
                  </h2>
                  <div class="item" v-for="(id, j) in this.mythicData[this.mythicTab].itemPosition[i-1]" :key="j">
                     <img rel="preload" :src="itemImage(id[0])" alt="">
                     <div class="image-sub-block">
                        <h4 class="block-header"> {{ winrate(id[1], id[2]) }} </h4>
                        <h3> ({{ id[1] }}) </h3>
                     </div>
                  </div>
               </div>
            </div>
            
            <div v-if="this.itemTab === 2">
               <div class="item-row" v-for="(el, i) in this.mythicData[this.mythicTab].startingItems" :key="i">
                  <div class="image-sub-block">
                     <h4> {{ winrate(el[1], el[2]) }} </h4>
                     <h3> ({{ el[1] }}) </h3>
                  </div>
                  <div v-if="el[0] != '0000'" class="item" v-for="(id, j) in el[0].split('_')" :key="j">
                     <img :src="itemImage(id)" alt="">
                  </div>
                  <div v-else style="margin-left: 20px;" class="null">
                     No starting item
                  </div>
               </div>

            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
   .rune img {
      width: 35px;
   }
   .rune-row {
      display: flex;
      gap: 8px;
      justify-content: center;
   }
   .keystone-row {
      gap: 2px;
   }
   img.keystones {
      width: 45px;
      margin-bottom: -5px;
   }
   .runes {
      display: flex;
      justify-content: space-evenly;
   }

   .rune-tree {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
   }

   .rune-tree > img {
      width: 35px;
      /* margin-bottom: 10px; */
      /* padding-bottom: -10px; */
   }
   .item-row {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

   }
   .item {
      display: inline-block;
      text-align: center;
   }

   .item img {
      width: 34px;
      margin: 0 5px;
      border: 1px solid var(--tint400);
   }

   
   .mythic-items {
      padding: 30px 0;
      background: var(--tint100);
      border-radius: 15px;
   }

   .item-tabs-wrapper {
      display: inline-block;
   }

   .item-tabs {
      display: flex;
   }

   h3 {
      margin: 0;
      display: inline-block;
      color: var(--tint400);
      font-weight: normal;
      font-style: italic;
      font-size: 1rem;
   }

   .mythic-item-wrapper > h2 {
      width: 200px;
   }   
   
   h2 {   
      color: var(--light400);
      font-size: 1.1rem;
      display: inline-block;
      font-style: italic;
      font-weight: 400;
      width: 116px;
      margin: 0;
      text-align: center;
   }
   .section-top {
      /* display: flex; */
      flex-direction: row;
      margin-bottom: 8px;
   }

   .tldr-toggle {
      font-size: 0.85rem;
      text-align: center;
   }

   .tldr-toggle .tab {
      padding: 0.5rem 1rem;
   }

   .section-top-right-wrapper {
      display: inline-block;
      width: calc(100% - 120px);
   }

   .section-top-right {
      display: flex;
      justify-content: space-between;
      align-items: center;
   }
   .section-top-tabs, .item-tabs {
      display: flex;
      flex-direction: row;
      gap: 10px;
      /* margin-left: 116px; */
   }
   .section-top-tabs .tab, .item-tabs .tab {
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
   }

   .tldr-body-wrapper {
      display: flex;
      margin-bottom: 40px;
   }
   .tldr-tabs {
      overflow-y: scroll;
      overflow-x: hidden;
      height: 326px;
      margin-right: 8px;
      padding-right: 5px;
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
   .tldr-tabs::-webkit-scrollbar-thumb:hover {
      background: var(--tint300);
      transition: 0.25s;
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

   .tldr-tabs img {
      width: 30px;
      border: 1px solid var(--tint400);
   }

   .tldr-body {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 20px;
      background: var(--tint100);
      border-radius: 15px;
   }

   .tldr-left {
      display: flex;
      margin: 0 50px;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-top: 20px;
   }
   
   .tldr-right {
      display: flex;
      margin: 0 50px;
      margin-bottom: 20px;
      justify-content: space-between;
      /* flex-direction: column; */
   }

   .tldr-items {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
   }

   .tldr-items h2 {
      margin-top: 0;
      font-size: 0.9rem;
   }

   .tldr-levels {
      display: flex;
      gap: 3px;
      /* margin-bottom: 20px; */
   }

   .tldr-levels .legend {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      gap: 3px;
      width: 20px;
   }

   .tldr-levels .legend div {
      height: 22px;
   }

   .tldr-levels .columns {
      display: flex;
      flex-direction: column;
      gap: 3px;
   }

   .tldr-levels .cell {
      width: 18px;
      height: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      text-align: center;
      line-height: 1.3rem;
      font-size: 0.7rem;
      border: 1px solid transparent;
      content: '1'
   }

   .tldr-levels .active-skill {
      border: 1px solid var(--tint400);
      background: rgba(255, 255, 255, 0.25);
      /* background: var(--color-background); */
   }

   .tldr-runes-wrapper {
      display: flex;
      gap: 40px;
   }

   .tldr-runes-right {
      text-align: center;
      width: 130px;
      display: flex;
      flex-direction: column;
      gap: 10px;
   }

   .tldr-runes-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 10px;
      /* align-items: center; */
   }

   .tldr-secondary-flex-runes {
      display: flex;
      /* flex-direction: column; */
      gap: 8px;
   }
   .tldr-secondary-runes, .tldr-flex-runes {
      display: flex;
      width: 110px;
      flex-direction: column;
      gap: 5px;
   }

   .tldr-runes-left h4 {
      margin: 0;
      display: inline-block;
      font-size: 0.75rem;
      font-weight: normal;
   }
   
   .tldr-runes-left h3 {
      font-size: 0.75rem;
      margin: 0;
      color: var(--tint400);
      margin-left: 0.3rem;
      display: inline-block;
      font-weight: normal;
   }

   .tldr-rune-winrate {
      text-align: left;
      font-size: 0.9rem;
   }
   .tldr-level-winrate {
      text-align: left;
      font-size: 0.9rem;
   }

   .tldr-rune-row {
      display: flex;
      justify-content: space-around;
   }
   .tldr-runes-right .tldr-rune-row:first-child img {
      width: 43px;
      border: none;
   }

   .tldr-flex-runes img {
      width: 28px;
      background: rgba(0, 0, 0, 0.15);
      border-radius: 100%;
      filter: saturate(0);
   }
   
   .tldr-secondary-flex-runes img {
      width: 28px;
      filter: saturate(0);
      border-radius: 100%;
      border: 1px solid var(--color-background);
      
   }
   
   .tldr-runes-right img {
      width: 30px;
      filter: saturate(0);
      border-radius: 100%;
      border: 1px solid var(--color-background);
   }
   .tldr-runes-right img.active-rune, .tldr-secondary-flex-runes img.active-rune {
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
   .image-sub-block {
      text-align: center;
   }

   .image-sub-block h4 {
      display: block;
      color: var(--tint500);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .image-sub-block h3 {
      display: block;
      color: var(--tint400);
      text-align: center;
      font-weight: normal;
      margin-top: 0.2rem;
      font-size: 0.75rem;
   }

   .core-items {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
   }

   .core-items img {
      width: 34px;
      border: 1px solid var(--tint400);
      margin: 0 5px;
   }

   .tldr-right h2 {
      display: block;
      text-align: center;
      margin-top: 0;
      font-size: 0.9rem;
      color: var(--light300);
   }

   .tldr-spells img {
      border: 1px solid var(--tint400);
      width: 34px;
      margin: 0 5px;
   }
   
   .tldr-starting img {
      width: 34px;
      border: 1px solid var(--tint400);
      margin: 0 5px;
   }
   
   .trailing-items {
      display: flex;
      gap: 4px;
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
      font-size: 0.95rem;
      color: var(--light200);
   }
</style>