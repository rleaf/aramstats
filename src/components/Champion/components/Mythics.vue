<script>
import { championParametersStore } from '../../../stores/championParameters'

   export default {
      data() {
         return {
            mythicTab: 0,
            tldrTab: 0,
            itemTab: 0,
            renderKey: 0,
            settings: false,
            parameters: championParametersStore(),
            noData: `No data with current settings/observations.`
         }
      },

      created() {
         this.checkStorage()
         this.computeTLDR()
      },

      methods: {
         checkStorage() {
            if (!localStorage.getItem('useLocalStorage')) return
            
            this.parameters.tldr.useLocalStorage = localStorage.getItem('useLocalStorage')
            this.parameters.tldr.coreThreshold = Number(localStorage.getItem('coreThreshold'))
            this.parameters.tldr.trailingDuplicates = (localStorage.getItem('trailingDuplicates') === 'true')
            this.parameters.tldr.trailingExtended = Number(localStorage.getItem('trailingExtended'))
            this.parameters.tldr.levelCutoff = Number(localStorage.getItem('levelCutoff'))
         },
         closeModal() {
            this.settings = false

            if (this.parameters.tldr.useLocalStorage) {
               localStorage.setItem('useLocalStorage', this.parameters.tldr.useLocalStorage)
               localStorage.setItem('coreThreshold', this.parameters.tldr.coreThreshold)
               localStorage.setItem('trailingDuplicates', this.parameters.tldr.trailingDuplicates)
               localStorage.setItem('trailingExtended', this.parameters.tldr.trailingExtended)
               localStorage.setItem('levelCutoff', this.parameters.tldr.levelCutoff)
            } else {
               // purge storage
               for (const p in this.parameters.tldr) {
                  localStorage.removeItem(p)
               }
            }

         },
         computeTLDR() {
            for (const i in this.mythicFilter) {
               const mythic = this.mythicFilter[i]
               mythic.tldr = {}
               mythic.tldr.builds = [[], []]
               mythic.tldr.runes = [[], []]
               mythic.tldr.levels = []
               mythic.tldr.levelOrder = []
               if (mythic.coreBuild) {
                  this.tldrBuilds(mythic, 0)
                  this.tldrBuilds(mythic, 1)
               }
               this.tldrRunes(mythic, 0)
               this.tldrRunes(mythic, 1)
               this.tldrLevels(mythic)
               this.tldrLevelOrder(mythic)
               // console.log(mythic.id, mythic.tldr.runes)
            }
         },
         getTreeStuff(tree, mode) {
            const o = this.champion.mythics[this.mythicFilter[this.mythicTab].id].primaryRunes[tree]
            if (o) {
               return (mode === 0) ? o.games : o.wins
            }
         },
         getRuneGames(tree, j, rune) {
            const o = this.champion.mythics[this.mythicFilter[this.mythicTab].id].primaryRunes[tree]
            if (o) {
               if (o[`row${j}`][rune]) {
                  return o[`row${j}`][rune].games
               }
            }
         },
         getRuneWins(tree, j, rune) {
            const o = this.champion.mythics[this.mythicFilter[this.mythicTab].id].primaryRunes[tree]
            if (o) { 
               if (o[`row${j}`][rune]) {
                  return o[`row${j}`][rune].wins
               }
            }
         },
         toggleVerbose(bool) {
            this.parameters.tldr.trailingDuplicates = bool

            for (const i in this.mythicFilter) {
               const mythic = this.mythicFilter[i]
               mythic.tldr.builds = [[], []]
               if (mythic.coreBuild) {
                  this.tldrBuilds(mythic, 0)
                  this.tldrBuilds(mythic, 1)
               }
            }
         },
         getItemName(i) {
            if (this.items !== null) return this.items[i].name
         },
         activeSkill(i, j) {
            return (this.mythicFilter[this.mythicTab].tldr.levels[this.tldrTab][0][i - 1] == j) ? true : false
         },

         activeSkillKey(i, j) {
            const table = {
               1: 'q',
               2: 'w',
               3: 'e',
               4: 'r',
            }
            if (this.mythicFilter[this.mythicTab].tldr.levels[this.tldrTab][0][i - 1] == j) {
               return i
            }
         },
         activeRune(id, idx) {
            return (this.mythicFilter[this.mythicTab].tldr.runes[this.tldrTab][idx].includes(id.toString())) ? true : false
         },

         flexRune(id, j) {
            if (this.mythicFilter[this.mythicTab].tldr.runes.length > 0) {
               return (this.mythicFilter[this.mythicTab].tldr.runes[this.tldrTab][3][j] == id) ? true : false
            }
            // return (this.mythicData[this.mythicTab].tldr.runes[this.tldrTab][3].includes(id.toString())) ? true : false
         },

         runeTree(i) {
            // const t = this.mythicData[this.mythicTab].runes[this.runesTab][0].split('|')[i]
            const t = this.mythicFilter[this.mythicTab].tldr.runes[this.tldrTab][0][i]
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

         tldrRunes(mythic, mode) {
            let runeCombination = [[], [], [], []]
            let runeWinrates = []

            let primaryTree
            let primaryTreeWinrate = 0

            let secondaryTree
            let secondaryTreeWinrate = 0

            // Get the primary tree
            let primaryRoller = 0
            for (const [lorax, v] of Object.entries(this.champion.mythics[mythic.id].primaryRunes)) {
               // highest winrate
               if (mode === 0) {
                  if ((v.games / mythic.games) >= this.parameters.tldr.coreThreshold && (v.wins / v.games) > primaryTreeWinrate) {
                     primaryTreeWinrate = (v.wins / v.games)
                     primaryTree = lorax
                  }
               } else {
                  if (v.games > primaryRoller) {
                     primaryTreeWinrate = (v.wins / v.games)
                     primaryRoller = v.games
                     primaryTree = lorax
                  }
               }
            }
            runeCombination[0].push(primaryTree)
            
            if (!primaryTree) {
               mythic.tldr.runes[mode] = undefined
               return
            }
            
            runeWinrates.push(primaryTreeWinrate)

            const primaryGames = this.champion.mythics[mythic.id].primaryRunes[primaryTree].games

            // Populate primary runes
            for (const [k, v] of Object.entries(this.champion.mythics[mythic.id].primaryRunes[primaryTree])) {
               if (k === 'games' || k === 'wins') continue
               let rune
               let winrate = 0
               if (mode === 0) {
                  for (const [k2, v2] of Object.entries(v)) {
                     if ((v2.games / primaryGames) >= this.parameters.tldr.coreThreshold && (v2.wins / v2.games) > winrate) {
                        winrate = (v2.wins / v2.games)
                        rune = k2
                     }
                  }
               } else {
                  let roller = 0
                  for (const [k2, v2] of Object.entries(v)) {
                     if (v2.games > roller) {
                        roller = v2.games
                        winrate = (v2.wins / v2.games)
                        rune = k2
                     }
                  }
               }

               runeCombination[1].push(rune)
               runeWinrates.push(winrate)
            }

            // Get the secondary tree
            for (const [lorax, v] of Object.entries(this.champion.mythics[mythic.id].secondaryRunes)) {
               if (lorax === primaryTree) continue
               if (mode === 0) {
                  if ((v.games / mythic.games) >= this.parameters.tldr.coreThreshold && (v.wins / v.games) > secondaryTreeWinrate) {
                     secondaryTreeWinrate = (v.wins / v.games)
                     secondaryTree = lorax
                  }

               } else {
                  let roller = 0
                  if (v.games > roller) {
                     secondaryTreeWinrate = (v.wins / v.games)
                     roller = v.games
                     secondaryTree = lorax
                  }
               }
            }

            runeWinrates.push(secondaryTreeWinrate)
            runeCombination[0].push(secondaryTree)

            // Populate secondary runes
            let secondaryBin = []
            const secondaryGames = this.champion.mythics[mythic.id].secondaryRunes[secondaryTree].games
            for (const [k, v] of Object.entries(this.champion.mythics[mythic.id].secondaryRunes[secondaryTree])) {
               if (k === 'games' || k === 'wins') continue
               let contender
               let roller = 0
               if (mode === 0) {
                  for (const [k2, v2] of Object.entries(v)) {
                     if ((v2.games / secondaryGames) >= this.parameters.tldr.coreThreshold && (v2.wins / v2.games) > roller) {
                        roller = (v2.wins / v2.games)
                        contender = k2
                     }
                  }
                  secondaryBin.push([contender, roller])
               } else {
                  let winrate = 0
                  for (const [k2, v2] of Object.entries(v)) {

                     if (v2.games > roller) {
                        roller = v2.games
                        winrate = (v2.wins / v2.games)
                        contender = k2
                     }
                  }
                  secondaryBin.push([contender, roller, winrate])
               }
            }

            if (secondaryBin.length > 2) {
               const val = secondaryBin.map(y => y[1])
               const idx = val.indexOf(Math.min(...val))
               secondaryBin.splice(idx, 1)
            }
            runeWinrates.push(...secondaryBin.map(o => o[o.length - 1]))
            runeCombination[2].push(...secondaryBin.map(o => o[0]))

            // Flex runes
            for (const v of Object.values(this.champion.mythics[mythic.id].flexRunes)) {
               let flexWinrate = 0
               let flexRune
               let roller = 0
               for (const [k2, v2] of Object.entries(v)) {
                  if (mode === 0) {
                     if ((v2.games / mythic.games) >= this.parameters.tldr.coreThreshold && (v2.wins / v2.games) > flexWinrate) {
                        flexWinrate = (v2.wins / v2.games)
                        flexRune = k2
                     }
                  } else {
                     if (v2.games > roller) {
                        roller = v2.games
                        flexWinrate = (v2.wins / v2.games)
                        flexRune = k2
                     }
                  }
               }

               runeCombination[3].push(flexRune)
               runeWinrates.push(flexWinrate)
            }

            const average = Math.round(runeWinrates.reduce((c, a) => c + a, 0) / runeWinrates.length * 10000) / 100
            runeCombination.push(average)

            mythic.tldr.runes[mode] = runeCombination
         },

         tldrRunesOld(mythic, mode) {
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
            for (const [lorax, v] of Object.entries(this.champion.mythics[mythic.id].primaryRunes)) {
               if ((v.games / mythic.games) >= this.parameters.tldr.coreThreshold && (v.wins / v.games) > primaryTreeWinrate) {
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
               mythic.tldr.runes[0] = undefined
               mythic.tldr.runes[1] = undefined
               return
            } // better err handling later
            maxRuneCombination[0].push(primaryTree)
            popularRuneCombination[0].push(popularTree)
            const primaryGames = this.champion.mythics[mythic.id].primaryRunes[primaryTree].games

            const getPrimaries = (tree, container, winrateContainer, mode) => {
               for (const [k, v] of Object.entries(this.champion.mythics[mythic.id].primaryRunes[tree])) {
                  if (k === 'games' || k === 'wins') continue
                  let rune
                  let winrate = 0
                  if (mode === 0) {
                     for (const [k2, v2] of Object.entries(v)) {
                        if ((v2.games / primaryGames) >= this.parameters.tldr.coreThreshold && (v2.wins / v2.games) > winrate) {
                           winrate = (v2.wins / v2.games)
                           rune = k2
                        }
                     }
                  } else {
                     let games = 0
                     for (const [k2, v2] of Object.entries(v)) {
                        if (v2.games > games) {
                           games = v2.games
                           winrate = (v2.wins / v2.games)
                           rune = k2
                        }
                     }
                  }

                  container[1].push(rune)
                  winrateContainer.push(winrate)
               }
            }

            const getSecondaryTree = (_primaryTree, winrateContainer, mode) => {
               let tree
               let winrate = 0
               if (mode === 0) {
                  for (const [lorax, v] of Object.entries(this.champion.mythics[mythic.id].secondaryRunes)) {
                     if (lorax === _primaryTree) continue
                     if ((v.games / mythic.games) >= this.parameters.tldr.coreThreshold && (v.wins / v.games) > winrate) {
                        winrate = (v.wins / v.games)
                        tree = lorax
                     }

                  }
               } else {
                  let iter = 0
                  for (const [lorax, v] of Object.entries(this.champion.mythics[mythic.id].secondaryRunes)) {
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

            const getSecondaries = (_secondaryTree, container, winrateContainer, mode) => {
               let bin = []
               // Secondary highest winrate
               if (mode === 0) {
                  let secondaryGames = this.champion.mythics[mythic.id].secondaryRunes[_secondaryTree].games
                  for (const [k, v] of Object.entries(this.champion.mythics[mythic.id].secondaryRunes[_secondaryTree])) {
                     if (k === 'games' || k === 'wins') continue
                     let contender
                     let iter = 0
                     for (const [k2, v2] of Object.entries(v)) {
                        if (v2.games / secondaryGames >= this.parameters.tldr.coreThreshold && (v2.wins / v2.games) > iter) {
                           iter = (v2.wins / v2.games)
                           contender = k2
                        }
                     }
                     bin.push([contender, iter])
                  }
               } else {
                  for (const [k, v] of Object.entries(this.champion.mythics[mythic.id].secondaryRunes[_secondaryTree])) {
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

            getPrimaries(primaryTree, maxRuneCombination, maxRuneWinrates, 0) // Get highest winrate or most popular primary runes
            const secondaryTreeMax = getSecondaryTree(primaryTree, maxRuneWinrates, 0) // Get highest winrate or most popular secondary tree
            maxRuneCombination[0].push(secondaryTreeMax)
            getSecondaries(secondaryTreeMax, maxRuneCombination, maxRuneWinrates, 0) // Get highest winrate or most popular secondary runes

            getPrimaries(popularTree, popularRuneCombination, popularRuneWinrates, 1)
            const secondaryTreePopular = getSecondaryTree(popularTree, popularRuneWinrates, 1)
            popularRuneCombination[0].push(secondaryTreePopular)
            getSecondaries(secondaryTreePopular, popularRuneCombination, popularRuneWinrates, 1)

            // Flex runes
            for (const v of Object.values(this.champion.mythics[mythic.id].flexRunes)) {
               let maxFlexWinrate = 0
               let maxFlexRune
               let popularFlexWins = 0
               let popularFlexWinrate = 0
               let popularFlexRune
               for (const [k2, v2] of Object.entries(v)) {
                  if ((v2.games / mythic.games) >= this.parameters.tldr.coreThreshold && (v2.wins / v2.games) > maxFlexWinrate) {
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

            mythic.tldr.runes[0] = maxRuneCombination
            mythic.tldr.runes[1] = popularRuneCombination
            // mythic.tldr.runes.push(maxRuneCombination, popularRuneCombination)
         },

         tldrBuilds(mythic, mode) {
            const sum = mythic.coreBuild.reduce((c, a) => c + a[1], 0)
            let core
            let container = []
            let blacklist = []

            if (mode === 0) {
               core = mythic.coreBuild.filter(o => (o[1] / sum) >= this.parameters.tldr.coreThreshold).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
               // core = mythic.coreBuild.sort((a, b) => b[1] - a[1])[0]
               if (!core) {
                  mythic.tldr.builds[mode] = undefined
                  return
               }
               blacklist = core[0].split('_')
   
               for (let u = 3; u < 6; u++) {
                  const trailSum = mythic.itemPosition[u].reduce((c, a) => c + a[1], 0)
                  const filtered = (this.parameters.tldr.trailingDuplicates) ? mythic.itemPosition[u] : mythic.itemPosition[u].filter(o => !blacklist.includes(o[0]))
                  const trailing = filtered.filter(o => (o[1] / trailSum) >= this.parameters.tldr.coreThreshold).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1])).slice(0, 3)
   
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
                  const filtered = (this.parameters.tldr.trailingDuplicates) ? mythic.itemPosition[u] : mythic.itemPosition[u].filter(o => !blacklist.includes(o[0]))
                  const trailing = filtered.sort((a, b) => b[1] - a[1]).slice(0, 3)
                  // const trailing = filtered.filter(o => (o[1] / trailSum) > this.parameters.tldr.trailingThreshold).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1])).slice(0, this.parameters.tldr.trailingExtended)
   
                  for (const v in trailing) {
                     blacklist.push(trailing[v][0])
                  }
   
                  container.push(trailing)
               }
            }

            mythic.tldr.builds[mode] = [core, container]
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
                  if (levels[0].slice(0, 3).match(uniqueReg)) {
                     const one = levels[0].slice(0, 3).match(uniqueReg)[0]
                     const two = discriminator[discriminator.length - 1]
                     preLevels += one + two.repeat(2)
                  } else {
                     // Only procs when levels 1-3 are identical (soraka triple pointing W).
                     preLevels = levels[0].slice(0, 3)
                  }
               } else {
                  // Standardize normal skill levels
                  preLevels += '123'
               }

               const datum = [preLevels + path, levels[1], levels[2]]

               if (cleanedData.length === 0) {
                  cleanedData.push(datum)
                  continue
               }
               // console.log(cleanedData)
               for (const w in cleanedData) {
                  if (cleanedData[w][0].includes(path) && path.length >= (this.parameters.tldr.levelCutoff - 3)) {
                     cleanedData[w][1] += levels[1]
                     cleanedData[w][2] += levels[2]
                     push = false
                     break
                  }
               }

               if (push && path.length >= this.parameters.tldr.levelCutoff) cleanedData.push(datum)
            }

            const popular = cleanedData.sort((a, b) => b[1] - a[1])[0]
            const max = cleanedData.filter(a => (a[1] / mythic.games) >= this.parameters.tldr.coreThreshold).sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
            mythic.tldr.levels.push(max, popular)
         },

         tldrLevelOrder(mythic) {
            const turkey = mythic.levelOrder
            const max = turkey.filter(o => (o[1] / mythic.games) >= this.parameters.tldr.coreThreshold)
               .sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
            const popular = turkey[0]
            mythic.tldr.levelOrder.push(max, popular)
         },

         refireMethods(mode, val) {
            if (mode === 0) this.parameters.tldr.coreThreshold = val
            if (mode === 1) this.parameters.tldr.levelCutoff = val

            this.computeTLDR()
         }
      },
      
      computed: {
         flexRunes() {
            return [[5008, 5005, 5007], [5008, 5002, 5003], [5001, 5002, 5003]]
         },
         getStartingItems() {
            const y = this.mythicFilter[this.mythicTab].startingItems
            // if (!y) return 'toad'
            if (this.tldrTab === 0) {
               const k = y.filter(a => (a[1] / this.mythicFilter[this.mythicTab].games) >= this.parameters.tldr.coreThreshold)
               .sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
               if (!k) return undefined
               return y.filter(a => (a[1] / this.mythicFilter[this.mythicTab].games) >= this.parameters.tldr.coreThreshold)
                  .sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
            } else {
               return y.sort((a, b) => b[1] - a[1])[0]
            }
         },

         getSpells() {
            const a = this.mythicFilter[this.mythicTab].spells
            if (this.tldrTab === 0) {
               return a.filter(r => (r[1] / this.mythicFilter[this.mythicTab].games) >= this.parameters.tldr.coreThreshold)
                  .sort((a, b) => (b[2] / b[1]) - (a[2] / a[1]))[0]
            } else {
               return a.sort((a, b) => b[1] - a[1])[0]
            }

         },
         getPrimaryRuneTable() {
            if (this.mythicFilter[this.mythicTab].tldr.runes[this.tldrTab][0]) {
               const t = this.mythicFilter[this.mythicTab].tldr.runes[this.tldrTab][0][0]
               return this.runesTable[t]
            }
         },

         getSecondaryRuneTable() {
            if (this.mythicFilter[this.mythicTab].tldr.runes[this.tldrTab].length != 0) {
               const t = this.mythicFilter[this.mythicTab].tldr.runes[this.tldrTab][0][1]
               return this.runesTable[t].slice(1, 4)
            }
         },

         getFlexRunes() {
            if (this.mythicFilter[this.mythicTab].tldr.runes.length > 0) {
               const t = this.mythicFilter[this.mythicTab].tldr.runes[this.tldrTab][3]
               return t
            }
         },

         getRuneWinrate() {
            if (this.mythicFilter[this.mythicTab].tldr.runes[this.tldrTab]) {
               return `${this.mythicFilter[this.mythicTab].tldr.runes[this.tldrTab][4]}%`
            } else {
               return '-'
            }
         },
         mythicFilter() {
            return this.mythicData.filter(e => e.id != '0')
         },
      },

      props: {
         patch: null,
         mythicData: null,
         champion: null,
         items: null,
         runes: null,
         runesTable: null,
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
            <div class="tldr-toggle">
               <div class="tab" @click="this.settings = true">Settings</div>
            </div>
            <div v-if="this.settings" class="modal">
               <div class="settings">
                  <div class="local">
                     <svg @click="this.parameters.tldr.useLocalStorage = !this.parameters.tldr.useLocalStorage" fill="none">
                        <rect x="0.5" y="0.5" rx="13"/>
                        <circle :class="{ 'storage-active': this.parameters.tldr.useLocalStorage }" cx="25%" cy="50%" r="22%" rx="12"/>
                     </svg>
                     <p>Save settings to local storage? Data auto-purges when toggled off.</p>
                  </div>
                  <div class="cog">
                     <div class="cog-head">
                        <h4>Duplicate items</h4>
                        <p>"I have this <u>on</u> because I want to see duplicate items in the build path."</p>
                     </div>
                     <div class="tab" :class="{ 'tab-focus': this.parameters.tldr.trailingDuplicates }" @click="this.toggleVerbose(true)">On</div>
                     <div class="tab" :class="{ 'tab-focus': !this.parameters.tldr.trailingDuplicates }" @click="this.toggleVerbose(false)">Off</div>
                  </div>
                  <div class="cog">
                     <div class="cog-head">
                        <h4>Trailing items count</h4>
                        <p>"I only want to see <u>2</u> items per slot in trailing items."</p>
                     </div>
                     <div class="tab" :class="{ 'tab-focus': this.parameters.tldr.trailingExtended === 2 }" @click="this.parameters.tldr.trailingExtended = 2">2</div>
                     <div class="tab" :class="{ 'tab-focus': this.parameters.tldr.trailingExtended === 3 }" @click="this.parameters.tldr.trailingExtended = 3">3</div>
                  </div>
                  <div class="cog">
                     <div class="cog-head">
                        <h4>Highest winrate threshold</h4>
                        <p>"I only want to see the highest winrate datum/combination that <br> is greater than or equal to <u>5%</u> of that data's sample space."</p>
                     </div>
                     <div class="tab" :class="{ 'tab-focus': this.parameters.tldr.coreThreshold === 0.02 }" @click="this.refireMethods(0, 0.02)">2%</div>
                     <div class="tab" :class="{ 'tab-focus': this.parameters.tldr.coreThreshold === 0.05 }" @click="this.refireMethods(0, 0.05)">5%</div>
                     <div class="tab" :class="{ 'tab-focus': this.parameters.tldr.coreThreshold === 0.10 }" @click="this.refireMethods(0, 0.10)">10%</div>
                     <div class="tab" :class="{ 'tab-focus': this.parameters.tldr.coreThreshold === 0.15 }" @click="this.refireMethods(0, 0.15)">15%</div>
                  </div>
                  <div class="cog">
                     <div class="cog-head">
                        <h4>Level cutoff</h4>
                        <p>"I want to ignore games where the champion has not made it past level <u>10</u>."</p>
                     </div>
                     <div class="tab" :class="{ 'tab-focus': this.parameters.tldr.levelCutoff === 10 }" @click="this.refireMethods(1, 10)">10</div>
                     <div class="tab" :class="{ 'tab-focus': this.parameters.tldr.levelCutoff === 13 }" @click="this.refireMethods(1, 13)">13</div>
                     <div class="tab" :class="{ 'tab-focus': this.parameters.tldr.levelCutoff === 16 }" @click="this.refireMethods(1, 16)">16</div>
                     <div class="tab" :class="{ 'tab-focus': this.parameters.tldr.levelCutoff === 18 }" @click="this.refireMethods(1, 18)">18</div>
                  </div>
               </div>
            </div>
            <div class="modal-back" v-if="this.settings" @click="this.closeModal()"></div>
         </div>

      </div>
   </div>

   <div class="tldr-body-wrapper">
      <div class="tldr-tabs">
         <div class="tab" :class="{ 'tab-focus': this.mythicTab === i }"  @click="this.mythicTab = i" v-for="(mythic, i) in mythicFilter" :key="i">
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
               <div class="tldr-header">
                  <h1>Items</h1>
               </div>
               <div class="items">

                  <div class="item" v-if="mythicFilter[this.mythicTab].tldr.builds[this.tldrTab]" v-for="(item, i) in mythicFilter[this.mythicTab].tldr.builds[this.tldrTab]" :key="i">
                  
                     <div v-if="i === 0" class="core-items">
                        <h2>Core Items</h2>
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
                           <!-- <h2>Item {{ j + 4 }}</h2> -->
                           <div class="tldr-wrapper" v-for="(id, k) in item.slice(0, this.parameters.tldr.trailingExtended)" :key="k">
                              <img :src="itemImage(id[0])"  alt="">
                              <div class="image-sub">
                                 <h4> {{ winrate(id[1], id[2]) }} </h4>
                                 <h3> ({{ id[1] }}) </h3>
                              </div>
                           </div>
                        </div>
                     </div>
                  
                  </div>
                  <div class="no-data" v-else>
                     <!-- <img src="https://i.imgur.com/o90ZKCq.jpeg" alt=""> -->
                     {{this.noData }}
                  </div>
               </div>
            </div>
         
            <div class="tldr-runes-wrapper">
               <div class="tldr-header">
                  <h1>Runes</h1>
                  <div class="header-stats">
                     <h2>
                        {{ getRuneWinrate }}
                     </h2>
                     <h3>(Mean winrate)</h3>
                  </div>
               </div>
               <div v-if="mythicFilter[this.mythicTab].tldr.runes[this.tldrTab]" class="tldr-runes">
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
                  </div>

               </div>
               <div class="no-runes-data" v-else>
                  {{ this.noData }}
               </div>
            </div>
         </div>
         <div class="tldr-right">
         
            <div class="tldr-starting">
               <div class="tldr-header">
                  <h1>Starting</h1>
                  <div v-if="getStartingItems" class="header-stats">
                     <h2> {{ winrate(getStartingItems[1], getStartingItems[2]) }} </h2>
                     <h3> ({{ getStartingItems[1]  }}) </h3>
                  </div>
               </div>
               <div v-if="getStartingItems" class="starting">
                  <img :src="itemImage(id)" alt="" v-for="(id, i) in getStartingItems[0].split('_')" :key="i">
               </div>
               <div class="no-data" v-else>
                  {{ this.noData }}
               </div>
            </div>
         
            <div class="tldr-spells">
               <div class="tldr-header">
                  <h1>Spells</h1>
                  <div class="header-stats">
                     <h2>{{ winrate(getSpells[1], getSpells[2]) }}</h2>
                     <h3>({{ getSpells[1] }})</h3>
                  </div>
               </div>
               <div class="spells">
                  <img :src="this.spellImage(id)" alt="" v-for="(id, i) in getSpells[0].split('_')" :key="i">
               </div>
            </div>

            <div class="tldr-levels">
               <div class="tldr-header">
                  <h1>Leveling</h1>
                  <div class="header-stats">
                     <h2>{{ winrate(mythicFilter[this.mythicTab].tldr.levels[this.tldrTab][1], mythicFilter[this.mythicTab].tldr.levels[this.tldrTab][2]) }}</h2>
                     <h3>({{ mythicFilter[this.mythicTab].tldr.levels[this.tldrTab][1] }})</h3>
                  </div>
               </div>
               <div class="levels">
                  <div class="columns" v-for="i in 18" :key="i">
                     <div class="cell" :class="{ 'active-skill': activeSkill(i, j) }" v-for="j in 4" :key="j">
                        {{ activeSkillKey(i, j) }}
                     </div>
                  </div>
               </div>

            </div>

         </div>
      </div>
   </div>

</template>

<style scoped>

   .modal {
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: max-content;
      background: var(--cell-panel);
      border-radius: 15px;
      padding: 2rem;
      z-index: 2;
   }

   .local {
      display: flex;
      flex-direction: row-reverse;
      gap: 10px;
      align-items: center;
   }

   .local svg {
      width: 50px;
      height: 26px;
      overflow: hidden;
      cursor: pointer;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
   }
   
   .local rect {
      width: calc(100% - 1px);
      height: calc(100% - 1px);
      /* height: 100%; */
      stroke: var(--light-10);
      /* stroke-width: 2; */
   }

   .local circle {
      fill: var(--alpha-07);
      height: calc(100% - 8px);
      transition: 0.2s cubic-bezier(.25,.52,.64,.84);
   }

   .local p {
      /* display: inline-block; */
      color: var(--color-font-faded);
      font-size: 0.8rem;
      font-style: italic;
      width: 220px;
      margin: 0;
   }

   circle.storage-active {
      transform: translateX(50%);
      fill: var(--light-01); 
   }
   
   .cog {
      padding: 1rem 0;
   }

   .cog .tab {
      display: inline-block;
   }

   .cog .tab {
      margin-left: 10px;
   }

   .cog-head {
      display: block;
   }

   .cog-head p {
      margin-left: 0rem;
      font-size: 0.8rem;
      margin-top: 0.3rem;
      font-style: italic;
      color: var(--color-font-faded);
   }

   .modal h4 {
      font-weight: normal;
      margin: 0;
   }

   .modal .settings {
      font-size: 0.85rem;
   }
   
   .modal .tab {
      padding: 0.5rem 1rem;
      width: max-content;
      background: var(--alpha-06);
   }

   .modal-back {
      position: absolute;
      background-color: var(--black-alpha-9);
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
   }

   h3 {
      margin: 0;
      display: inline-block;
      color: var(--color-font-faded);
      font-weight: normal;
      font-style: italic;
      font-size: 1rem;
   }


   .tldr-body h2 {
      margin-bottom: 0.5rem;
      width: auto;
   }

   .tldr-body h1 {
      display: block;
   }
   
   h2 {   
      color: var(--color-font);
      font-size: 1.1rem;
      display: inline-block;
      font-style: italic;
      font-weight: 400;
      width: 116px;
      margin: 0;
      text-align: center;
   }
   .section-top {
      display: flex;
      height: 42px;
      align-items: center;
      flex-direction: row;
      margin-bottom: 3px;
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
   }
   .section-top-tabs .tab, .item-tabs .tab {
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
   }

   .tldr-body-wrapper {
      display: flex;
      margin-bottom: 40px;
      height: 437px;
   }
   .tldr-tabs {
      overflow-y: scroll;
      overflow-x: hidden;
      margin-right: 8px;
      padding-right: 5px;
   }

   .tldr-tabs .tab:not(:last-child) {
      margin-bottom: 0.25rem;
   }

   .tab-sub h4 {
      display: block;
      color: var(--color-font);
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
      background: var(--cold-blue);
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      padding: 0.5rem 1.5rem 0.5rem 0.5rem;
      gap: 0.5rem;
      transition: 0.25s;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
   }

   .tab-focus {
      border: 1px solid var(--cell-border);
      background: var(--cold-blue-focus);
      color: var(--color-font-focus);
   }
   
   .modal .tab-focus {
      border: 1px solid var(--cell-border);
      background: var(--alpha-07);
      color: var(--color-font-focus);   
   }
   
   .modal .tab:hover {
      background: var(--alpha-07);
   }
   .tab:hover {
      background: var(--cold-blue-focus);
   }

   .tldr-tabs img {
      width: 30px;
      border: 1px solid var(--cell-border);
   }

   .tldr-body {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 100%;
      gap: 20px;
      background: var(--cell-panel);
      border-radius: 15px;
   }

   .tldr-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 15px;
      margin-bottom: 0.8rem;
      padding-bottom: 0.3rem;
      border-bottom: 1px solid var(--cell-border);
   }

   .tldr-body h1 {
      display: inline-block;
      font-size: 0.95rem;
      margin: 0;
   }

   .header-stats {
      display: inline-block;
      font-size: 0.8rem;
   }
   
   .tldr-right h2 {
      display: block;
      text-align: center;
      margin-top: 0;
      font-size: 0.9rem;
      color: var(--color-font);
   }
   .header-stats h2 {
      display: inline-block;
      margin: 0;
      font-size: 0.8rem;
   }

   .header-stats h3 {
      margin-left: 0.3rem;
      font-size: 0.75rem;
   }

   .tldr-left {
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      gap: 10px;
      margin-top: 20px;
   }
   
   .tldr-right {
      display: flex;
      margin-bottom: 20px;
      justify-content: space-around;
   }

   .tldr-items {
      display: flex;
      flex-direction: column;
      min-width: 360px;
   }
   
   .tldr-items .items {
      display: flex;
      align-items: center;
      gap: 10px;
      
   }

   .tldr-items h2 {
      margin-top: 0;
      font-size: 0.9rem;
   }

   .tldr-levels {
      display: flex;
      flex-direction: column;
   }
   
   .tldr-levels .levels {  
      display: flex;
      gap: 3px;
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
      background: var(--cell-backdrop);
      border-radius: 3px;
      text-align: center;
      line-height: 1.3rem;
      font-size: 0.7rem;
      border: 1px solid transparent;
      content: '1';
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
   }

   .tldr-levels .active-skill {
      border: 1px solid var(--light-10);
      background: var(--alpha-08);
   }


   .tldr-runes {
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
   }

   .tldr-secondary-flex-runes {
      display: flex;
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
      border: 1px solid var(--cell-border);
   }

   .tldr-flex-runes img.active-rune {
      filter: saturate(1.25);
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid var(--cell-border);
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

   .tldr-spells {
      display: flex;
      flex-direction: column;
   }

   .spells img {
      border: 1px solid var(--tint400);
      width: 34px;
      margin: 0 5px;
   }

   .tldr-starting {
      display: flex;
      flex-direction: column;
      /* min-width: 184px; */
   }
   
   .starting img {
      width: 34px;
      border: 1px solid var(--tint400);
      margin: 0 5px;
   }
   
   .trailing-items {
      display: flex;
      gap: 15px;
   }

   .trailing-items .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 75px;
      padding: 0.5rem .5rem;
      border-radius: 8px;
      gap: 10px;
   }

   .no-data, .no-runes-data {
      color: var(--tint400);
      font-style: italic;
      font-size: 0.9rem;
   }

   .no-runes-data {
      min-width: 398px;
      min-height: 170px;
   }

   .trailing-items .item:nth-child(1),
   .trailing-items .item:nth-child(3) {
      /* background: var(--hoverButton); */
      background: var(--alpha-00);
      
   }

   .trailing-items .item img {
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 34px;
      border: 1px solid var(--tint400);
   }   
   .item h2 {
      font-size: 0.85rem;
      /* font-style: normal; */
      color: var(--tint400);
   }
</style>