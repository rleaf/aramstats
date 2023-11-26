<script>
import Dropdown from '../components/Dropdown.vue'
import champions from '../constants/champions'

export default {
   components: {
      Dropdown,
   },

   data() {
      return {
         input: '',
         tagLine: '',
         region: 'rg',
         inputAlert: false,
         alertMessage: '',
         regionOptions: ['na','euw','eune','kr','lan','las','oce','tr','ru','jp','br','vn','tw','th','sg','ph'],
         showRegions: false,
         containerFocus: false,
         championNames: null,
         champions: [],
      }
   },

   created() {

      const localRegion = localStorage.getItem('region')
      if (localRegion) this.region = localRegion

      for (const champion of champions.names) {
         let x = {}
         x.back = (champion[1] === "MonkeyKing") ? 'wukong' : champion[1].toLowerCase()
         x.front = champion[2]
         x.image = `https://ddragon.leagueoflegends.com/cdn/13.20.1/img/champion/${champion[1]}.png`
         this.champions.push(x)
      }
   },

   methods: {
      inputFocus() {
         this.containerFocus = true
         this.showRegions = false
      },

      summonerSearch() {
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
         if (this.input === '' || !this.regionOptions.includes(this.region)) {
            const str = 'Enter a summoner name and/or region.'
            this.showAlert(str)
            return
         }

         const identifiers = this.input.split('#')
         let _gameName = identifiers[0]
         let _tagLine
         if (identifiers.length === 2) {
            _tagLine = identifiers[1]
         } else {
            if (!this.regionOptions.includes(this.region)) {
               const str = `Click a region or enter a tagLine. Having a region selected will default to that region's tagline.`
               this.showAlert(str)
               return
            }

            _tagLine = table[this.region]
         }

         this.$router.push({ name: `user`, params: {
            region: this.region,
            gameName: encodeURI(_gameName),
            tagLine: _tagLine
         }})
      },

      showAlert(str) {
         this.alertMessage = str
         this.inputAlert = true
         setTimeout(() => {
            this.inputAlert = false
         }, 1200)
      },

      regionSelect(region) {
         
         this.region = region
         localStorage.setItem('region', this.region)
         this.$refs.input.focus()
         this.showRegions = false
      },
      
      focusContainer() {
         console.log(this.$refs.container)
         this.containerFocus = true
         console.log(this.containerFocus)
      }
   },

   computed: {
      filteredChamps() {
         if (!this.input) return
         return this.champions.filter(champ => champ.front.toLowerCase().startsWith(this.input.toLowerCase())).slice(0, 5)
      }
   }
}

</script>

<template>
   <div class="search-main">
      <img src="../assets/logo.svg" class="logo" alt="">
      <div ref="container" class="container" :class="{ focus: this.containerFocus}">
         <input ref="input" type="text" spellcheck="false" autocomplete="off"
            @focus="inputFocus"
            @keyup.enter="summonerSearch"
            placeholder="Summoner or Champion"
            v-model="input">
         <button class="region" @click="this.showRegions = true, this.containerFocus = false">
            {{ this.region.toUpperCase() }}
         </button>
      </div>
      <div class="region-selection" v-show="showRegions">
         <div v-for="region in this.regionOptions" :key="region" @click="regionSelect(region)">
            {{ region.toUpperCase() }}
         </div>
      </div>
      <transition name="fade">
         <div class="region-alert" v-show="inputAlert">
            {{ this.alertMessage }}
         </div>
      </transition>
      <div ref="champions" class="champion-search" v-show="this.containerFocus && this.input.length > 0">
         <router-link :to="{ name: 'champions', params: {champion: champ.back} }" v-for="champ in filteredChamps">
            <img :src="champ.image" alt="" srcset="" rel="preload">
            {{ champ.front }}
         </router-link>
      </div>
      <!-- <div class="transition-wrapper">
         <transition name="slide">
         </transition>
      </div> -->
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
   /* background: var(--color-background); */
   background: #1f263f;
   color: var(--color-font-unfocused);
   font-size: 0.8rem;
   /* height: 205px; */
   margin-top: 5px;
   /* border: 1px solid var(--light700); */
   /* border-radius: 5px; */
   /* padding: 0.5rem 0; */
   width: calc(380px);
}

.champion-search h3 {
   font-size: 0.9rem;
   /* font-weight: normal; */
   /* text-decoration: underline; */
   color: var(--light400);
   width: auto;
   /* background: var(--hoverButton); */
   padding: 1rem 0.8rem;
   margin: 0;
}

.champion-search > a {
   display: flex;
   align-items: center;
   gap: 0.5rem;
   position: relative;
   z-index: 2;
   color: var(--color-font-unfocused);
   text-decoration: none;
   padding: 0.3rem 1rem;
   padding-left: 1.5rem;
   transition: 0.25s;
}


.champion-search > a:hover {
   background: var(--hoverButton);
   color: var(--color-font)
}

.champion-search img {
   width: 33px;
}

.region-selection {
   margin-top: 1rem;
}

.region-selection > div {
   color: var(--color-font);
   text-align: center;
   font-size: 0.9rem;
   margin: 0 .2rem;
   padding: .2rem .4rem;
   display: inline-block;
   background: var(--tint200);
   border-radius: 5px;
   cursor: pointer;
}
.region-selection > div:hover {
   transition: 0.1s;
   background: var(--tint300);
}

button.region {
   right: 50px;
   display: inline-block;
   height: inherit;
   color: var(--color-font);
   font-family: var(--font-main);
   font-size: 0.9rem;
   background: none;
   font-size: 1rem;
   border-radius: 5px;
   cursor: pointer;
   border: none;
   padding: 0.2rem 0.4rem;
}

button.region:hover {
   background: var(--tint200);
   transition: 0.1s ease-in-out;
}

img.logo {
   width: 250px;
   padding-bottom: 2rem;
   filter: drop-shadow(3px 5px 2px rgba(0, 0, 0, 0.4));
}

@media (prefers-color-scheme: light) {
   img.logo {
      filter: brightness(0) saturate(100%) invert(18%) sepia(9%) saturate(2305%) hue-rotate(184deg) brightness(105%) contrast(92%);
   }
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
   background: var(--color-background);
   display: flex;
   align-items: center;
   padding: 0.7rem 2rem;
   border: 2px solid var(--tint100);
   border-radius: 50px;
   width: 380px;
   transition: 0.25s;
}

.focus {
   background: var(--searchHover);
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
</style>