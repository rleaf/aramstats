<script>
import { superStore } from '../stores/superStore'

export default {
   data() {
      return {
         store: superStore(),
         containerFocus: false,
         input: '',
         region: 'RG',
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
      }
   },

   created() {
      if (localStorage.getItem('region')) this.region = localStorage.getItem('region')

      window.addEventListener('keydown', this.trackIterate)
   },

   beforeUnmount() {
      window.removeEventListener('keydown', this.trackIterate)
   },

   methods: {
      trackIterate(e) {
         if (!(e.key === 'ArrowDown' || e.key === 'ArrowUp') || !this.containerFocus) return
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

      regionSelect() {
         localStorage.setItem('region', this.region)
         this.$refs.input.focus()
      },

      getImage(name) {
         return new URL(`../assets/champion_icons/${name}.png`, import.meta.url).href
      },

      summonerSearch() {
         if (!this.input) return

         if (this.filteredChamps[this.step]) {
            this.$router.push({ name: 'champions', params: {champion: this.filteredChamps[this.step].back}})
            this.containerFocus = false
            this.$refs.input.blur()
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

         this.containerFocus = false
         this.$refs.input.blur()
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
   <div>
      <div class="nav-search" :class="{ focus: this.containerFocus }">
         <div>
            <input ref="input" type="text" spellcheck="false" autocomplete="off"
            placeholder="Summoner or Champion"
            @focus="this.containerFocus = true"
            @keyup.enter="this.summonerSearch()"
            v-model="input">
            <div class="shadow" v-show="this.input && this.region !== 'RG' && !this.input.includes('#')">
               <p>{{ `${this.input}`}}</p>
               <p>#{{ this.table[this.region] }}</p>
            </div>
         </div>
         <select ref="regionButton" v-model="this.region" @change="regionSelect()">
            <option value="RG" hidden disabled>Region</option>
            <option v-for="region in Object.keys(this.table)" :value="region" :key="region">{{ region.toUpperCase() }}</option>
         </select>
      </div>
      <div class="champion-search" v-show="this.containerFocus && this.filteredChamps.length">
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
      <div class="back" @click="this.containerFocus = false" v-if="this.containerFocus"></div>
      <!-- <div v-if="this.store.focus || this.regionFocus" class="bg" @click="this.terminate()"></div> -->
   </div>
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

.focus {
   border-color: var(--outline);
}

.nav-search input {
   width: 260px;
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
   white-space: nowrap;
   max-width: 260px;
   padding-right: 2px;
}

::placeholder {
  color: var(--color-font-faded);
  opacity: 1; /* Firefox */
}

.nav-search input:focus {
   outline: none;
}

.shake {
   background-color: var(--error);
   color: var(--on-error);
   animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
}

select {
   /* border: 1px solid transparent; */
   padding: 0 11px;
   margin-right: 5px;
   border-radius: 15px;
   cursor: pointer;
   height: 20px;
   appearance: none;
   width: 75px;
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