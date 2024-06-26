<script>
import Dropdown from '../components/Dropdown.vue'
import champions from '../constants/champions'
import { superStore } from '../stores/superStore.js'


export default {
   components: {
      Dropdown,
   },

   data() {
      return {
         store: superStore(),
         input: '',
         tagLine: '',
         region: 'RG',
         inputAlert: false,
         alertMessage: '',
         regionOptions: ['na','euw','eune','kr','lan','las','oce','tr','ru','jp','br','vn','tw','th','sg','ph'],
         showRegions: false,
         containerFocus: false,
         championNames: null,
         champions: [],
         patch: null,
      }
   },

   created() {
      const localRegion = localStorage.getItem('region')
      if (localRegion) this.region = localRegion
   },

   methods: {
      getImage(name) {
         return new URL(`../assets/champion_icons/${name}.png`, import.meta.url).href
      },
      inputFocus() {
         this.containerFocus = true
         this.showRegions = false
      },

      summonerSearch() {
         if (!this.input) return

         const table = {
            'na': 'NA1',
            'euw': 'EUW',
            'eune': 'EUNE',
            'kr': 'KR1',
            'lan': 'LAN',
            'las': 'LAS',
            'oce': 'OCE',
            'tr': 'TR1',
            'ru': 'RU1',
            'jp': 'JP1',
            'br': 'BR1',
            'vn': 'VN2',
            'tw': 'TW2',
            'th': 'TH2',
            'sg': 'SG2',
            'ph': 'PH2',
         }
         if (this.region === 'RG') {
            this.$refs.regionButton.classList.add('shake')
            setTimeout(() => {
               this.$refs.regionButton.classList.remove('shake')
            }, 830)
            return
         }

         const identifiers = this.input.split('#')
         let _gameName = identifiers[0]
         let _tagLine = (identifiers.length === 2) ? identifiers[1] : table[this.region]

         this.$router.push({ name: `user`, params: {
            region: this.region,
            gameName: _gameName,
            tagLine: _tagLine
         }})
      },

      regionSelect(region) {
         this.region = region
         localStorage.setItem('region', this.region)
         this.$refs.input.focus()
         this.showRegions = false
      }, 
   },

   computed: {
      filteredChamps() {
         if (!this.input) return
         return this.store.champions.filter(champ => champ.front.toLowerCase().startsWith(this.input.toLowerCase())).slice(0, 5)
      }
   }
}

</script>

<template>
   <div class="search-main">
      <img src="../assets/svg/logo.svg" class="logo" alt="">
      <div ref="container" class="container" :class="{ focus: this.containerFocus}">
         <input ref="input" type="text" spellcheck="false" autocomplete="off"
            @focus="inputFocus"
            @keyup.enter="summonerSearch"
            placeholder="Summoner or Champion"
            v-model="input">
         <button ref="regionButton" class="region" @click="this.showRegions = true, this.containerFocus = false">
            {{ this.region.toUpperCase() }}
         </button>
      </div>
      <div class="region-selection" v-show="showRegions">
         <div v-for="region in this.regionOptions" :key="region" @click="regionSelect(region)">
            {{ region.toUpperCase() }}
         </div>
      </div>
      <div ref="champions" class="champion-search" v-show="this.containerFocus && this.input.length > 0">
         <router-link :to="{ name: 'champions', params: {champion: champ.back} }" v-for="champ in filteredChamps">
            <img :src="this.getImage(champ.image)" alt="" srcset="" rel="preload">
            {{ champ.front }}
         </router-link>
      </div>
   </div>
   <div class="back" @click="this.containerFocus = false" v-if="this.containerFocus"></div>
</template>

<style scoped>
.back {
   position: fixed;
   top: 0;
   left: 0;
   z-index: 1;
   width: 100%;
   height: 100vh;
}

.testo {
   width: 100%;
   height: 100%;
}

.transition-wrapper {
   overflow: hidden;
}

.champion-search {
   position: relative;
   background: var(--cold-blue-focus);
   font-size: 0.85rem;
   margin-top: 5px;
   width: calc(380px);
   border-radius: 5px;
   overflow: hidden;
}

.champion-search > a {
   display: flex;
   align-items: center;
   gap: 10px;
   position: relative;
   z-index: 2;
   color: var(--color-font);
   text-decoration: none;
   padding: 4px;
   margin: 4px 4px;
   padding-left: 1.5rem;
   border-radius: 5px;
   transition: 0.15s;
}

.champion-search > a:hover {
   background: var(--alpha-06);
   color: var(--color-font-focus)
}

.champion-search img {
   width: 32px;
}

.region-selection {
   margin-top: 1rem;
}

.region-selection > div {
   color: var(--color-font);
   text-align: center;
   font-size: 0.9rem;
   margin: 0 .2rem;
   padding: 3px 6px;
   display: inline-block;
   background: var(--light-13);
   border-radius: 5px;
   cursor: pointer;
   transition: 0.1s;
}
.region-selection > div:hover {
   background: var(--light-12);
   color: var(--color-font-focus)
}

button.region {
   right: 50px;
   display: inline-block;
   height: inherit;
   color: var(--color-font);
   font-family: var(--font-main);
   font-size: 0.9rem;
   background: var(--alpha-04);
   border-radius: 4px;
   cursor: pointer;
   border: none;
   margin: 0;
   padding: 2px 6px;
}

.shake {
   animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
}

button.region:hover {
   background: var(--alpha-06);
   transition: 0.1s ease-in-out;
}

img.logo {
   width: 250px;
   padding-bottom: 4rem;
   filter: var(--logo-filter);
}

.search-main {
   display: flex;
   flex-direction: column;
   margin-top: 20vh;
   width: 100%;
   align-items: center;
}
.container {
   position: relative;
   z-index: 2;
   background: var(--cell-panel);
   display: flex;
   align-items: center;
   padding: 0.7rem 2rem;
   border: 1px solid var(--cell-border);
   border-radius: 50px;
   width: 400px;
   transition: 0.25s;
}

.focus {
   background: var(--cold-blue-focus);
   border-color: var(--light700);
}

input {
   display: inline-block;
   background: transparent;
   border: none;
   padding-left: 1rem;
   font-size: 1rem;
   color: var(--color-font);
   width: 100%;
}

input:focus {
   outline: none;
   color: var(--color-font);
   transition: 0.4s;
}

button {
   height: 3rem;
   margin: 2px;
}

.notif {
   color: var(--color-font);
   text-align: center;
   padding: 0.5rem 1rem;
   border-radius: 5px;
   margin-top: 2rem;
   border: 1px var(--tint100) solid;
   font-size: 0.9rem;
}

.region-alert {
   background-color: #ffd4d4;
   margin-top: 0.5rem;
   padding: 0.2rem 0.5rem;
   font-size: 0.95rem;
   border: #f50d0d 1px solid;
   border-radius: 10px;
}

.fade-leave-active {
   transition: opacity 0.3s cubic-bezier(.25,.1,.25,1);
}

.fade-leave-to {
   opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
   transition: 0.5s cubic-bezier(.25,.1,.25,1);
}

.slide-enter {
   transform: translate(0, 100%)
}
.slide-leave-to {
   transform: translate(0, -100%)
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-3px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(3px, 0, 0);
  }
}
</style>