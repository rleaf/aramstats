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
         table: {
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
         },
         containerFocus: false,
         championNames: null,
         champions: [],
         patch: null,
         step: -1,
      }
   },

   created() {
      if (localStorage.getItem('region')) this.region = localStorage.getItem('region')

      window.addEventListener('keydown', this.eventHandler)
   },

   beforeUnmount() {
      window.removeEventListener('keydown', this.eventHandler)
   },

   methods: {
      eventHandler(e) {
         if (e.ctrlKey && e.key === 'k') {
            e.preventDefault()
            this.$refs.input.focus()
            return
         }

         if (!(e.key === 'ArrowDown' || e.key === 'ArrowUp')) return
         e.preventDefault()

         if (this.filteredChamps.length) {
            if (!this.$refs.champions.children || !this.$refs.champions.children[this.step]) this.step = -1 
            if (this.step !== -1) this.$refs.champions.children[this.step].classList.remove('active')
            
            if (e.key === 'ArrowDown') {
               if (this.$refs.champions.children[this.step + 1]) {
                  this.step++
               } else {
                  this.step = 0
                  this.$refs.champions.children[this.step]
               }
            }

            if (e.key === 'ArrowUp') {
               if (this.$refs.champions.children[this.step - 1]) {
                  this.step--
               } else {
                  this.step = this.filteredChamps.length - 1
                  this.$refs.champions.children[this.filteredChamps.length - 1]
               }
            } 
            
            if (this.step !== -1) this.$refs.champions.children[this.step].classList.add('active')
         }
      },

      getImage(name) {
         return new URL(`../assets/champion_icons/${name}.png`, import.meta.url).href
      },

      blurInput() {
         this.$refs.input.blur()
         this.containerFocus = false
      }, 

      inputFocus() {
         
      },

      summonerSearch() {
         if (!this.input) return

         if (this.filteredChamps[this.step]) {
            this.$router.push({ name: 'champions', params: {champion: this.filteredChamps[this.step].back}})
            return
         }

         if (this.region === 'RG') {
            this.$refs.regionButton.classList.add('shake')
            setTimeout(() => {
               this.$refs.regionButton.classList.remove('shake')
            }, 1000)
            return
         }

         const identifiers = this.input.split('#')
         let _gameName = identifiers[0]
         let _tagLine = (identifiers.length === 2) ? identifiers[1] : this.table[this.region]

         this.$router.push({ name: `user`, params: {
            region: this.region,
            gameName: _gameName,
            tagLine: _tagLine
         }})
      },

      regionSelect() {
         localStorage.setItem('region',  this.region)
         this.$refs.input.focus()
      }, 
   },

   computed: {
      filteredChamps() {
         if (!this.input) {
            this.step = -1
            return 0
         }
         return this.store.champions.filter(champ => champ.front.toLowerCase().startsWith(this.input.toLowerCase())).slice(0, 5)
      },

   }
}

</script>

<template>
   <div class="search-main">
      <img src="../assets/svg/logo.svg" class="logo" alt="">
      <div ref="container" class="container" :class="{ focus: this.containerFocus}">
         <div>
            <input class="main-input" ref="input" type="text" spellcheck="false" autocomplete="off"
               @focus="this.containerFocus = true"
               @keyup.esc="this.blurInput()"
               @keyup.enter="summonerSearch"
               v-model="input">
            <span class="placeholder" v-show="!this.input">
               Summoner or Champion
               <kbd>Ctrl + K</kbd>
            </span>
            <div class="shadow" v-show="this.input && this.region !== 'RG' && !this.input.includes('#')">
               <p>{{ `${this.input}`}}</p>
               <!-- <p style="padding-left: 15px" v-if="filteredChamps.length === 1">Press enter to search {{ filteredChamps[0].front }}</p>
               <p v-else>#{{ this.table[this.region] }}</p> -->
               <p>#{{ this.table[this.region] }}</p>
            </div>
         </div>
         <select ref="regionButton" v-model="this.region" @change="regionSelect()">
            <option value="RG" hidden disabled>Region</option>
            <option v-for="region in Object.keys(this.table)" :value="region" :key="region">{{ region.toUpperCase() }}</option>
         </select>
      </div>
      <div class="champion-search" v-show="this.containerFocus && filteredChamps.length > 0">
         <div class="search-ux">
            <div>
               <kbd>↑</kbd> up <kbd>↓</kbd> down <kbd>Enter</kbd> search
            </div>
            <div>
               <kbd>Ctrl+K</kbd> focus <kbd>Esc</kbd> close 
            </div>
         </div>
         <div ref="champions">
            <router-link :to="{ name: 'champions', params: {champion: champ.back} }" v-for="champ in filteredChamps">
               <div class="img-wrapper">
                  <img :src="this.getImage(champ.image)" alt="" srcset="" rel="preload">
               </div>
               {{ champ.front }}
            </router-link>
         </div>
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
   background: var(--surface-container);
   font-size: 0.85rem;
   margin-top: 5px;
   width: calc(380px);
   border-radius: 3px;
   overflow: hidden;
   border: 1px solid var(--outline-variant);
}

.search-ux {
   display: flex;
   justify-content: space-between;
   color: var(--color-font);
   font-size: 0.75rem;
   padding: 2px 5px;
   padding-bottom: 4px;
   opacity: 0.5;
   border-bottom: 1px solid var(--outline-variant);
}

.search-ux kbd {
   border: 1px solid var(--outline-variant);
   border-radius: 5px;
   padding: 0px 3px;
}


.champion-search a {
   display: flex;
   align-items: center;
   gap: 10px;
   position: relative;
   z-index: 2;
   color: var(--color-font);
   text-decoration: none;
   padding: 3px;
   padding-left: 1.5rem;
   transition: 0.15s ease-in-out;
}

.champion-search a:hover, .champion-search a.active {
   background: var(--surface-container-high);
   color: var(--color-font-focus)
}


.img-wrapper {
   width: 30px;
   height: 30px;
   border: 1px solid var(--outline-variant);
   overflow: hidden;
}

.champion-search img {
   width: 100%;
   transform: scale(1.1);
}

.region-selection {
   margin-top: 1rem;
}

.region-selection > div {
   color: var(--panel-two-text);
   text-align: center;
   font-size: 0.85rem;
   margin: 0 .2rem;
   padding: 2px 6px;
   display: inline-block;
   background: var(--panel-two);
   border-radius: 5px;
   cursor: pointer;
   transition: 250ms ease-in-out;
}
.region-selection > div:hover {
   background: var(--panel-two-hover);
}

select {
   /* border: 1px solid transparent; */
   padding: 0 11px;
   margin-right: 10px;
   cursor: pointer;
   height: 30px;
   appearance: none;
   width: 80px;
   display: inline-block;
   color: var(--color-font);
   font-family: var(--font-main);
   font-size: 0.75rem;
   background: transparent;
   background: var(--surface-container-highest);
   background-image: url('../assets/svg/arrow3.svg');
   background-repeat: no-repeat;
   background-position: right 10px center;
   border-radius: 15px;
   cursor: pointer;
   font-weight: bold;
   border: none;
   transition: 250ms ease-in-out;
}

select:focus {
   outline: none;
}

select > option {
   font-weight: bold;
}

button.region {
   height: 30px;
   display: inline-block;
   color: var(--color-font);
   font-family: var(--font-main);
   font-size: 0.75rem;
   /* background: var(--surface-container-highest); */
   background: var(--surface-container-highest);
   border-radius: 15px;
   cursor: pointer;
   font-weight: bold;
   border: none;
   margin: 0;
   margin-right: 10px;
   padding: 3px 15px;
   transition: 250ms ease-in-out;
}

.shake {
   background-color: var(--error);
   color: var(--on-error);
   animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
}

select:hover {
   background-color: var(--surface-container-highest-hover);
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
   background: var(--surface-container);
   display: flex;
   justify-content: space-between;
   align-items: center;
   /* padding: 0.7rem 2rem; */
   border: 1px solid var(--outline-variant);
   border-radius: 50px;
   width: 420px;
   height: 45px;
   transition: 0.25s;
}

.shadow {
   position: absolute;
   width: inherit;
   z-index: -4;
   left: calc(2.5rem);
   top: 50%;
   transform: translateY(-50%);
   -webkit-user-select: none; /* Safari */        
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* IE10+/Edge */
   user-select: none; /* Standard */
}

.shadow p {
   display: inline-block;
   color: var(--on-surface);
   font-size: 0.95rem;
   opacity: 0.3;
   margin: 0;
}

.shadow p:first-child {
   white-space: nowrap;
   opacity: 0;
   max-width: 240px;
   padding-right: 2px;
}

.focus {
   /* background: var(--surface-container-low); */
   border-color: var(--outline);
}

input {
   display: inline-block;
   background: transparent;
   border: none;
   padding: 0;
   font-family: var(--font-main);
   font-size: 0.95rem;
   color: var(--on-surface);
   width: 240px;
   /* flex-grow: 3; */
   padding-left: 2.5rem;  
}

input:focus {
   outline: none;
   color: var(--on-surface);
   transition: 0.4s;
}

span.placeholder {
   z-index: 0;
   pointer-events: none;
   position: absolute;
   left: 2.5rem;
   font-size: 0.9rem;
   font-family: var(--font-main);
   color: var(--color-font-faded);

}

span.placeholder kbd {
   display: inline-flex;
   border: 1px solid var(--outline-variant);
   border-radius: 5px;
   font-family: var(--font-main);
   padding: 0px 5px;
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