<script>
   import { superStore } from '../stores/superStore.js'

   export default {
      inheritAttrs: false,
      data() {
         return {
            store: superStore(),
            day: false,
            input: '',
            regionFocus: false,
            region: 'RG',
            regionOptions: ['na', 'euw', 'eune', 'kr', 'lan', 'las', 'oce', 'tr', 'ru', 'jp', 'br', 'vn', 'tw', 'th', 'sg', 'ph'],
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
            }
         }
      },

      created() {
      },
      
      mounted() {
         const localRegion = localStorage.getItem('region')
         if (localRegion) this.region = localRegion
         if (JSON.parse(localStorage.getItem('theme'))) this.theme()
      },

      methods: {
         trackIterate(e) {
            if (!(e.key === 'ArrowDown' || e.key === 'ArrowUp')) return

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
         theme() {
            this.day = !this.day
            document.querySelector('body').classList.toggle('day')
            localStorage.setItem('theme', JSON.stringify(this.day))
         },

         regionSelect() {
            localStorage.setItem('region', this.region)
            this.$refs.input.focus()
         },
         // selectRegion(region) {
         //    localStorage.setItem('region', region)
         //    this.region = region
         //    this.regionFocus = false
         //    this.$refs.input.focus()
         // },
         focusInput() {
            this.store.focus = true
            this.$refs.input.focus()
         },
         terminate() {
            this.regionFocus = false
            this.store.focus = false
            this.input = ''
         },
         getImage(name) {
            return new URL(`../assets/champion_icons/${name}.png`, import.meta.url).href
         },
         champSearch() {
            this.store.focus = false
            this.input = ''
         },
         showRegions() {
            this.regionFocus = true
         },
         summonerSearch() {
            if (!this.input) return

            if (this.region === 'RG') {
               this.$refs.regionButton.classList.add('shake')
               setTimeout(() => {
                  this.$refs.regionButton.classList.remove('shake')
               }, 830)
               return
            }

            const identifiers = this.input.split('#')
            let _gameName = identifiers[0]
            let _tagLine = (identifiers.length === 2) ? identifiers[1] : this.table[this.region]

            this.$router.push({
               name: `user`, params: {
                  region: this.region,
                  gameName: _gameName,
                  tagLine: _tagLine
               }
            })
            this.input = ''
            this.store.focus = false
            this.$refs.input.blur()
         }
      },

      computed: {
         navSearch() {
            return (this.$route.name != 'home') ? true : false
         },
         filteredChamps() {
            if (!this.input) {
               // this.step = -1
               return 0
            }
            return this.store.champions.filter(champ => champ.front.toLowerCase().startsWith(this.input.toLowerCase())).slice(0, 5)
         }
      },

      props: {
         champions: null,
      }
   }

</script>

<template>
   
   <nav>
      <div class="left">
         <router-link class="nav-route" to="/">Home</router-link>
         <router-link class="nav-route" to="/champions">Champions</router-link>
      </div>

      <div v-if="navSearch">
         <!-- <div :class="{'focus': this.store.focus}" class="nav-search"> -->
         <div class="nav-search">
            <div>
               <input ref="input" @focus="this.focusInput()" type="text" spellcheck="false" autocomplete="off"
               placeholder="Summoner or Champion"
               @keyup.enter="this.summonerSearch()"
               v-model="input">
               <div class="shadow" v-show="this.input && this.region !== 'RG' && !this.input.includes('#')">
                  <p>{{ `${this.input}`}}</p>
                  <p>#{{ this.table[this.region] }}</p>
               </div>
            </div>
            <select ref="regionButton" v-if="this.region" v-model="this.region" @change="regionSelect()">
               <option value="RG" hidden disabled>Region</option>
               <option v-for="region in Object.keys(this.table)" :value="region" :key="region">{{ region.toUpperCase() }}</option>
            </select>
            <!-- <button ref="regionButton" @click="this.regionFocus = true">{{ this.region.toUpperCase() }}</button> -->
         </div>
         <!-- <div class="regions" v-if="this.regionFocus">
            <button v-for="region in this.regionOptions" @click="this.selectRegion(region)">
               {{ region.toUpperCase() }}
            </button>
         </div> -->
         <!-- <div class="champion-search" v-if="this.store.focus && !this.regionFocus">
            <router-link @click="this.champSearch()" :to="{ name: 'champions', params: { champion: champ.back } }" v-for="champ in filteredChamps">
               <img :src="this.getImage(champ.image)" alt="" srcset="" rel="preload">
               {{ champ.front }}
            </router-link>ww
         </div> -->
         <div class="champion-search" v-show="this.store.focus && this.filteredChamps.length">
            <div class="search-ux">
               <kbd>↑</kbd>/<kbd>↓</kbd>/<kbd>Enter</kbd> key friendly
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

         <div v-if="this.store.focus || this.regionFocus" class="bg" @click="this.terminate()"></div>
      </div>
      
      <div class="right">
         <!-- <div class="toad">
         </div> -->
         <button @click="this.theme()" :class="{day: this.day}">
            <div class="theme"></div>
         </button>
         <router-link class="nav-route" to="/updates">Updates</router-link>
         <router-link class="nav-route" to="/versions">Versions</router-link>
         <router-link class="nav-route" to="/about">About</router-link>
      </div>
   </nav>
   <router-view :key="$route.fullPath"/>
</template>

<style scoped>
.region-alert {
   position: absolute;
   transform: translateX(calc(203px - 50%));
   background: var(--alpha-04);
   border-radius: 5px;
   margin-top: 5px;
   padding: 4px 6px;
   color: var(--color-font);
   font-size: 0.85rem;
}

.bg {
   position: fixed;
   top: 0;
   left: 0;
   z-index: 0;
   width: 100%;
   height: 100vh;
}
.regions {
   position: absolute;
   padding-top: 10px;
   z-index: 1;
   transform: translateX(-50%);
   left: 50%;
}
.regions button {
   background: var(--light-13);
   color: var(--color-font);
   padding: 2px 4px;
   border-radius: 4px;
   font-size: 0.9rem;
   transition: 0.25s ease-in-out;
}

.shake {
   animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
}

.regions button:hover {
   color: var(--color-font-focus);
   background: var(--light-12);
}

.search-ux {
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

.champion-search {
   z-index: 1;
   display: flex;
   position: relative;
   width: 380px;
   margin-top: 5px;
   transform: translateX(calc(203px - 50%));
   flex-direction: column;
   position: absolute;
   background: var(--surface-container);
   border: 1px solid var(--outline-variant);
   border-radius: 5px;
}

.champion-search a {
   display: flex;
   align-items: center;
   text-decoration: none;
   color: var(--color-font);
   gap: 10px;
   /* border-radius: 5px; */
   font-size: 0.85rem;
   padding: 3px;
   transition: 0.15s ease-in-out;
}

.champion-search a:hover, .champion-search a.active {
   background: var(--surface-container-high);
   color: var(--color-font-focus)
}

.img-wrapper {
   width: 24px;
   height: 24px;
   border: 1px solid var(--outline-variant);
   overflow: hidden;
}

.champion-search img {
   width: 100%;
   transform: scale(1.1);
}

.nav-search {
   display: flex;
   position: relative;
   justify-content: space-between;
   align-items: center;
   z-index: 1;
   background-color: var(--surface-container);
   height: 25px;
   width: 400px;
   color: var(--color-font);
   border-radius: 50px;
   border: 1px solid var(--outline-variant);
   padding: 3px 2px;
   transition: 0.25s ease-in-out;
   opacity: 0.6;
   overflow: hidden;
}

nav .left, nav .right {
   flex-grow: 1;
   flex-basis: 0;
}

/* .focus {
   opacity: 1;
   background: var(--cold-blue-focus);
} */

.nav-search input {
   width: 200px;
   color: var(--color-font);
   font-family: var(--font-main);;
   background: none;
   border: none;
   font-size: 0.8rem;
   padding: 5px 12px;
}

.shadow {
   position: absolute;
   width: inherit;
   z-index: -4;
   left: 14px;
   top: calc(50% - 1px);
   transform: translateY(-50%);
   -webkit-user-select: none; /* Safari */        
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* IE10+/Edge */
   user-select: none; /* Standard */
}

.shadow p {
   display: inline-block;
   color: var(--on-surface);
   font-size: 0.8rem;
   opacity: 0.3;
   margin: 0;
}

.shadow p:first-child {
   opacity: 0;
   max-width: 200px;
   padding-right: 2px;
}

::placeholder {
  color: var(--color-font-faded);
  opacity: 1; /* Firefox */
}

.nav-search input:focus {
   outline: none;
}

select {
   /* border: 1px solid transparent; */
   padding: 0 11px;
   margin-right: 5px;
   border-radius: 15px;
   cursor: pointer;
   height: 20px;
   appearance: none;
   width: 65px;
   display: inline-block;
   color: var(--color-font);
   font-family: var(--font-main);
   font-size: 0.7rem;
   line-height: 0.7rem;
   background: transparent;
   background: var(--surface-container-highest);
   background-image: url('../assets/svg/arrow3.svg');
   background-repeat: no-repeat;
   background-position: right 10px center;
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

select:hover {
   background-color: var(--surface-container-highest-hover);
   transition: 0.1s ease-in-out;
}

.nav-search button {
   background: var(--alpha-04);
   color: var(--color-font-faded);
   font-size: 0.8rem;
   padding: 2px 5px;
   border-radius: 3px;
   transition: 0.1s ease-in-out;
}
.nav-search button:hover {
   background: var(--alpha-06);
   color: var(--color-font-focus);
}

nav {
   display: flex;
   justify-content: space-between;
   height: 5rem;
   width: 100%;
   align-items: center;
   align-items: center;
}

.toad {
   overflow: hidden;
}

svg {
   margin: 0 0.5rem;
}

.right svg rect {
   fill: tomato;
}

nav .left {
   display: flex;
   padding-left: 2rem;
}

nav .right {
   display: flex;
   justify-content: flex-end;
   align-items: center;
   padding-right: 2rem;
}

.text, .theme {
   display: inline-block;
   vertical-align: middle;
}

a.nav-route {
   margin: 0 0.5rem;
   padding: 0.4rem 0.7rem;
   font-size: 0.9rem;
   text-decoration: none;
   color: var(--color-font);
   border-radius: 4px;
   transition: 0.2s ease-in-out;
}

a:hover {
   background: var(--cold-blue-focus);
   color: var(--color-font-focus);
}


button {
   background: none;
   outline: none;
   border: none;
   cursor: pointer;
   padding: 0;
   margin-right: 0.5rem;
}

.theme {
   background-color: var(--color-font);
   width: 27px;
   height: 27px;
   mask-image: var(--theme-icon);
   mask-position: center;
   mask-size: var(--theme-mask-size);
   mask-repeat: no-repeat;
   transition: 0.25s ease-in-out;
   -webkit-mask-image: var(--theme-icon);
   -webkit-mask-position: center;
   -webkit-mask-size: var(--theme-mask-size);
   -webkit-mask-repeat: no-repeat;
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