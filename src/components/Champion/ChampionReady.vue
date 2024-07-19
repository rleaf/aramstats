<script>
import axios from 'axios'
import champions from '../../constants/champions'
import { superStore } from '../../stores/superStore'
import Tldr from './components/Tldr.vue'
import Items from './components/Items.vue'
import Runes from './components/Runes.vue'
import StartingSpells from './components/StartingSpells.vue'
import DataTooltip from '../DataTooltip.vue'

export default {
   components: {
      Tldr,
      Items,
      Runes,
      StartingSpells,
      DataTooltip
   },
   data() {
      return {
         championCDN: null,
         abilities: [],
         name: champions.humanName[this.champion._id],
         backName: champions.imageName[this.champion._id],
         patchAlert: false,
         itemTooltip: false,
         itemData: null,
         store: superStore(),
      }

   },

   created() {
      document.title = `${this.name} | ARAM Stats`
      this.getChampData()

      if (this.champion.patch !== this.activePatch) {
         this.patchAlert = true

         setTimeout(() => {
            this.patchAlert = false
         }, 2000);
      }

   },

   methods: {
      getChampData() {
         // const url = `https://ddragon.leagueoflegends.com/cdn/${this.store.patches[0]}/data/en_US/champion/${this.backName}.json`
         const url = `https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions/${this.backName}.json`
         axios.get(url, { params: { 'Access-Control-Allow-Origin': 'http://localhost:5173' }}).then(res => {
         // axios.get(url).then(res => {
            this.championCDN = res.data.data[this.backName]
            this.abilities.push(this.championCDN.passive.image.full)
            for (const spell of this.championCDN.spells) {
               this.abilities.push(spell.image.full)
            }
         })
      },

      getAbilityImages(name, idx) {
         return (idx === 0) ? `https://ddragon.leagueoflegends.com/cdn/${this.store.patches[0]}/img/passive/${name}` :
            `https://ddragon.leagueoflegends.com/cdn/${this.store.patches[0]}/img/spell/${name}`
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

      scrollTo(val) {
         const top = document.querySelector(`#${val}`).offsetTop
         window.scrollTo({
            top: top
            // behavior: 'smooth'
         })
      },

      cleanPatch(patch) {
         return patch.split('.').slice(0, 2).join('.')
      },

      patchChange(patch) {
         this.$router.push({ query: { patch: this.cleanPatch(patch) } })
      }
   },

   computed: {
      champIcon() {
         return `https://ddragon.leagueoflegends.com/cdn/${this.store.patches[0]}/img/champion/${this.backName}.png`
      },

      background() {
         const img = new URL(`../../assets/champion_splash/${this.backName.toLowerCase()}.webp`, import.meta.url).href
         return `radial-gradient(ellipse at top, rgba(var(--color-background-rgb), 0.8), rgba(var(--color-background-rgb), 1) 73%), no-repeat -10% 25%/100% url('${img}')`
         // return `linear-gradient(to right, rgba(var(--cell-panel-rgb), 1.0), rgba(var(--cell-panel-rgb), 0.9) 10%, rgba(var(--cell-panel-rgb), .8) 60%, rgba(var(--cell-panel-rgb), .7) 90%), no-repeat -20% 15%/100% url('${img}')`
      },

      championWinrate() {
         return `${Math.round((this.champion.wins / this.champion.games) * 1000) / 10}%`
      },

      activePatch() {
         const o = new URLSearchParams(window.location.search).get('patch')
         return (o) ? o : this.cleanPatch(this.store.patches[0])
      },

      title() {
         return (this.championCDN) ? this.championCDN.title : ''
      }
   },
   
   props: {
      champion: null,
      keyProp: null,
   }
}
</script>

<template>
   <DataTooltip v-if="this.store.tooltip.active" :champCDN="this.championCDN" />
   <div class="champion-ready-main">
      <Transition name="fade">
         <div v-if="this.patchAlert" class="alert">
            Patch data unavailable, defaulting to latest.
         </div>
      </Transition>
      <div class="gradient-bg" :style="{ background: background }"></div>
      <div class="header">
         <div class="header-titles">

            <div class="header-lhs">
               <div class="header-lhs-image">
                  <img :src="champIcon" alt="">
               </div>
               <div class="header-lhs-one">
                  <div class="name">{{ this.name }}</div>
                  <div class="title">{{ this.title }}</div>
                  <div class="champion-abilities">
                     <div v-for="(id, i) in this.abilities"
                        @mouseenter="this.store.setTooltipData($event, id, 'spells', i)"
                        @mouseleave="this.store.tooltip.active = false"
                        :key="i">
                        <img :src="getAbilityImages(id, i)" rel="preload">
                        <div class="spell-letter">
                           {{ abilityLetter(i) }}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div class="header-rhs">
               <div>
                  <h2>Rank</h2>
                  {{ this.champion.rank }}
               </div>
               <div>
                  <h2>Pickrate</h2>
                  {{ this.champion.pickRate }}%
               </div>
               <div>
                  <h2>Winrate</h2>
                  {{ championWinrate }}
                  <h2>{{ this.champion.games }} games</h2>
               </div>
            </div>

         </div>

         <div class="settings">
            <div>
               <div class="setting-header">{{ this.champion.patch }}</div>
               <div class="setting-content">
                  <a @click="patchChange(p)" v-for="p in this.store.patches" :key="p">{{ this.cleanPatch(p) }}</a>
               </div>
            </div>
            <div>
               <div class="setting-header">Global*</div>
               <div class="setting-content">
                  <div class="message">
                     *Currently, only global is available. Check <router-link class="about" :to="{ name: 'about' }">about</router-link>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div class="champion-body">
         <Tldr  @scroll="scrollTo" :champion="this.champion" :patch="this.store.patches[0]" />
         <Items :champion="this.champion" :patch="this.store.patches[0]" :itemData="this.itemData"/>
         <Runes :champion="this.champion" :patch="this.store.patches[0]" />
         <StartingSpells :champion="this.champion" :patch="this.store.patches[0]" :abilities="this.abilities"/>
      </div>
   </div>
</template>

<style scoped>
.fade-leave-active {
   transition: opacity 1000ms ease-in-out;
}

.fade-leave-to {
   opacity: 0;
}

.alert {
   font-size: 0.9rem;
   color: var(--color-font-focus);
   position: absolute;
   text-align: center;
   left: 50%;
   margin-top: 10vh;
   transform: translateX(-50%);
   padding: 0.6rem 0.8rem;
   border: 1px solid var(--ice-blue);
   background: var(--cell-panel);
   border-radius: 3px;
   z-index: 5;
   width: 300px;
}

.gradient-bg {
   position: absolute;
   z-index: -5;
   margin-top: 5vh;
   width: inherit;
   height: 400px;
}
.champion-ready-main {
   display: flex;
   flex-direction: column;
   margin: 0 auto;
   width: 1100px;
}

.header {
   margin-bottom: 5vh;
}

.header-titles {
   margin-top: 5vh;
   padding-top: 5vh;
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   color: var(--color-font);
   border-top: 1px solid var(--cell-border);
   background: radial-gradient(ellipse at top, var(--cell-panel), var(--cell-panel-rgb) 25%);
}

.header-rhs {
   display: flex;
   gap: 80px;
}

.header-rhs h2 {
   margin: 0;
   color: var(--color-font-faded);
   font-size: 0.9rem;
   font-weight: normal;
}

.header-rhs div {
   color: var(--color-font);
   font-size: 1.5rem;
   font-weight: bold;
}

.settings {
   display: flex;
   gap: 20px;
   font-size: 0.9rem;
   color: var(--color-font);
   margin-top: 5vh;
}

.settings > div {
   display: block;
   width: auto;
}

.header-lhs {
   display: flex;
   /* flex-direction: column; */
}

.settings .setting-content {
   display: none;
   position: absolute;
   /* flex-wrap: wrap; */
   flex-direction: column;
   /* justify-content: space-between; */
   background-color: var(--cell-panel);
   border-radius: 3px;
   /* padding-top: 10px; */
   /* width: 130px; */
   /* box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); */
   z-index: 1;
}

.setting-content > a {
   /* margin: 2px; */
   display: inline-block;
   cursor: pointer;
   min-width: 45px;
   padding: 0.4rem 0.8rem;
}

.setting-content > a:hover {
   background: var(--alpha-01);
   border-radius: 3px;
   /* padding: 2px 5px; */
}

.setting-content .message {
   padding: 0.4rem 0.8rem;
   font-size: 0.8rem;
   /* font-style: italic; */
}

a.about {
   color: var(--color-font);

}

.settings > div:hover .setting-content {
   display: flex;
}

.settings > div .setting-header {
   display: block; 
   text-align: center;
   background: var(--cell-panel);
   border: none;
   color: var(--color-font);
   /* font-family: var(--header-font); */
   font-weight: bold;
   /* font-size: 0.8rem; */
   cursor: pointer;
   min-width: 45px;
   border-radius: 3px;
   padding: 0.4rem 0.8rem;
   margin-bottom: 5px;
}

.header-lhs-one {
   padding-left: 1.5rem;
}

.name {
   display: inline-block;
   font-size: 2.8rem;
   margin: 0;
   font-family: var(--header-font);
}

.title {
   display: inline-block;
   margin: 0;
   padding-left: 0.7rem;
   font-size: 1.2rem;
   font-family: var(--header-font);
   /* font-style: italic; */
   color: var(--color-font-faded);
}

.champion-abilities {
   padding-top: 5px;
   height: 38px;
}
.champion-abilities img {
   width: 36px;
   border: 1px solid var(--cell-border);
}

.champion-abilities > div {
   display: inline-block;
}

.champion-abilities div:not(:first-child) {
   margin-left: 10px;
}

.spell-letter {
   position: relative;
   top: -23px;
   left: -9px;
   font-size: 0.85rem;
   background: var(--color-background);
   text-align: center;
   width: 1rem;
}

.header-lhs-image {
   width: 100px;
   height: 100px;   
   overflow: hidden;
   border: 1px solid var(--cell-border);
}

.header-lhs-image img {
   width: 100%;
   /* object-fit: cover; */
   transform: scale(1.2);
}
</style>