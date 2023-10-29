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
         title: '',
         tab: 0,
         items: null,
         runes: null,
         mythicBuilds: [
            /* 
            0: itemId
            1: games
            2: wins
            3: [[i0], [i1], [i2], [i3], [i4], [i5]]
            4: core build
            5: levelOrder
            6: skillPath
            7: spells
            8: starting items
            9: runes
            */
         ],
      }
   },

   created() {
      console.log(this.backName)
      console.log(this.champion)
      this.getChampData()
      this.getMythicClusters()
      this.getItems()
      this.getRunes()
   },
   
   mounted() {

   },
      
   methods: {
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
            console.log(this.runes, 'roons')
         })
      },
      
      winrate(total, win) {
         return `${Math.round( win / total * 1000) / 10}%`
      },

      getMythicClusters() {
         const iter = (i, obj, container) => {
            for (const [k, v] of Object.entries(obj)) {
               container.push([k, v.games, v.wins])
            }
            container.sort((a, b) => b[1] - a[1])
            this.mythicBuilds[i].push(container)
         }
         
         for (const k in this.champion.mythics) {
            if (k === '0') continue
            this.mythicBuilds.push([k, this.champion.items[k].games, this.champion.items[k].wins])
         }
         this.mythicBuilds.sort((a, b) => b[1] - a[1])

         
         for (const i in this.mythicBuilds) {
            let item = this.mythicBuilds[i][0]
            // let _itemPosition = [[], [], [], [], [], []]
            let _itemPosition = [[], [], []]
            let _levelOrder = []
            let _skillPath = []
            let _runes = []
            let _spells = []
            let _startingItems = []
            let _coreBuild = []

            for (const [pos, v] of Object.entries(this.champion.mythics[item].items).slice(3)) {
               for (const [k2, v2] of Object.entries(v)) {
                  _itemPosition[pos - 3].push([k2, v2.games, v2.wins])
               }
               _itemPosition[pos - 3].sort((a, b) => b[1] - a[1])
            }
            this.mythicBuilds[i].push(_itemPosition)

            // for (const [pos, v] of Object.entries(this.champion.mythics[item].items)) {
            //    for (const [k2, v2] of Object.entries(v)) {
            //       _itemPosition[pos].push([k2, v2.games, v2.wins])
            //    }
            //    _itemPosition[pos].sort((a, b) => b[1] - a[1])
            // }
            // this.mythicBuilds[i].push(_itemPosition)

            iter(i, this.champion.mythics[item].coreBuild, _coreBuild)
            iter(i, this.champion.mythics[item].levelOrder, _levelOrder)
            iter(i, this.champion.mythics[item].skillPath, _skillPath)
            iter(i, this.champion.mythics[item].spells, _spells)
            iter(i, this.champion.mythics[item].startingItems, _startingItems)
            iter(i, this.champion.mythics[item].runes, _runes)
         }
         console.log('potato', this.mythicBuilds)
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
         if (this.items !== null) {
            return this.items[i].name
         }
      },

      itemImage(Id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${Id}.png`
      },

      toggleItemBin(Id) {
         const idx = this.itemBin.indexOf(Id)
         if (idx === -1) {
            this.itemBin.push(Id)
         }
         else {
            this.itemBin.splice(idx, 1)
         }
      },

      runeImage(path) {
         return `https://ddragon.leagueoflegends.com/cdn/img/${path}`
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

      // getRunes() {
      //    return new URL(`../assets/runes/${runeId}.png`, import.meta.url).href
      // }
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
               <div class="tldr-body-wrapper">
                  <div class="tldr-tabs">
                     <div class="tab" @click="this.tab = i" v-for="(mythic, i) in this.mythicBuilds" :key="i">
                        <img :src="itemImage(mythic[0])" alt="">
                        <div class="tab-sub">
                           <h4> {{ winrate(mythic[1], mythic[2]) }} </h4>
                           <h3> ({{ mythic[1] }}) </h3>
                        </div>
                        <!-- {{ this.getItemName(mythic[0]) }} -->
                     </div>
                  </div>
                  <div class="tldr-body">
                     <div class="tldr-left">
                        <div class="tldr-runes">

                           <div class="tldr-runes-primary">

                           </div>
                           <div class="tldr-runes-secondary">

                           </div>
                           <div class="tlder-runes-tertiary">

                           </div>

                        </div>
                        <div class="tldr-misc">
                           spells & level order go here?
                        </div>
                     </div>
                     <div class="tldr-right">
                        <div class="tldr-items">
                           <div class="core-items">
      
                              <h2>Core</h2>
                              <div class="item-set" v-for="(set, i) in this.mythicBuilds[this.tab][4].slice(0, 2)" :key="i">
                                 <img :src="itemImage(img)" alt="" v-for="(img, j) in set[0].split('_')" :key="j">
                                 <div class="image-sub">
                                    <h4> {{ winrate(set[1], set[2]) }} </h4>
                                    <h3> ({{ set[1] }}) </h3>
                                 </div>
                              </div>
      
                           </div>
                           <div class="trailing-items">
      
                              <div class="item" v-for="i in 3" :key="i">
                                 <h2>{{ i + 3}}</h2>
                                 <div class="tldr-wrapper" v-for="item in this.mythicBuilds[this.tab][3][i-1].slice(0, 3)" :key="item[0]">
                                    <img :src="itemImage(item[0])" alt="">
                                    <div class="image-sub">
                                       <h4> {{ winrate(item[1], item[2]) }} </h4>
                                       <h3> ({{ item[1] }}) </h3>
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
               <!-- <div class="tldr-tabs">
                  <div class="tab" @click="this.tab = i" v-for="(mythic, i) in this.mythicBuilds" :key="i">
                     <img :src="itemImage(mythic[0])" alt="">
                     {{ this.getItemName(mythic[0]) }}
                  </div>
               </div> -->
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
            <!-- <div class="builds" v-if="this.tab === 1">
            </div>

            <div class="items" v-if="this.tab === 2">
            </div> -->
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

   .tldr-tabs .tab {
      display: flex;
      align-items: center;
      background: var(--tint100);
      border-radius: 10px;
      cursor: pointer;
      padding: 0.5rem 1.5rem 0.5rem 0.5rem;
      margin-left: 1rem;
      gap: 0.5rem;
      transition: 0.25s;
   }

   .tldr-tabs .tab:not(:last-child) {
      margin-bottom: 0.25rem;
   }

   .tab h4 {
      display: block;
      color: var(--tint500);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .tab h3 {
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
      flex-direction: column;
   }
   
   .tldr-right {
      display: flex;
      flex-direction: column;
   }

   .tldr-items {
      display: flex;
      flex-direction: row;
   }

   .image-sub {
      text-align: center;
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
      gap: 30px;
      /* width: 545px; */
   }

   .trailing-items .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 71px;
   }

   .tldr-items h4 {
      display: inline-block;
      color: var(--tint500);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
   }
   
   .tldr-items h3 {
      display: inline-block;
      color: var(--tint400);
      text-align: center;
      font-weight: normal;
      margin: 0;
      font-size: 0.75rem;
      margin-left: 0.3rem;
      /* font-style: italic; */
   }

   .trailing-items .item img {
      display: block;
      margin-left: auto;
      margin-right: auto;
      /* margin: auto; */
      /* text-align: center; */
      width: 34px;
      border: 1px solid var(--tint400);
   }   
   .item h2 {
      font-size: 1rem;
   }

   .item-bin {
      /* margin: 1rem 0; */
      /* text-align: center; */
      padding: 1rem 0;
      border-radius: 15px;
      background: var(--tint100);
      justify-content: center;
      /* align-items: center; */
      width: 100%;
   }

   .item-bin img {
      width: 40px;
      /* filter: brightness(0.8) saturate(0.5); */
   }


</style>