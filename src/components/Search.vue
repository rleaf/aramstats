<script>
import Dropdown from '../components/Dropdown.vue'
import regions from '../constants/regions'
import champions from '../constants/champions'

export default {
   components: {
      Dropdown,
   },

   data() {
      return {
         input: '',
         region: 'rg',
         inputAlert: false,
         alertMessage: String,
         regionOptions: regions,
         showRegions: false,
         containerFocus: false,
         championNames: null,
      }
   },

   created() {
      const localRegion = localStorage.getItem('region')
      if (localRegion) this.region = localRegion

      this.championNames = champions.names.map((name) => {
         return (name in champions.table) ? champions.table[name] : name
      })

      console.log(this.championNames)
   },

   methods: {
      inputFocus() {
         this.containerFocus = true
         this.showRegions = false
      },
      championSearch() {
         console.log('tomatoes')
      },

      summonerSearch() {
         if (this.region === 'rg' || this.input == '') {
            this.alertMessage = 'Enter a summoner name and/or region.'
            this.inputAlert = true
            setTimeout(() => {
               this.inputAlert = false
            }, 1200)
            return
         }

         this.$router.push({ name: `user`, params: {
            region: this.region,
            username: encodeURI(this.input),
         }})
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
         // console.log(champions)
         // const currentPatch = '13.20.1'
         // const url = `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${this.data[i].name}.png`
         // console.log(this.region, this.region.length)
         if (this.input.length === 0) return
         return this.championNames.filter(champ => champ.toLowerCase().startsWith(this.input.toLowerCase())).slice(0, 5)
      }
   }
}

</script>

<template>
   <div class="search">
      <img src="../assets/logo.svg" class="logo" alt="">
      <div ref="container" class="container" :class="{ focus: this.containerFocus}">
         <input ref="input" type="text" spellcheck="false"
            @focus="inputFocus"
            @blur="this.containerFocus = false"
            @keyup.enter.exact="summonerSearch"
            @keyup.shift.enter="championSearch"
            placeholder="Summoner Name"
            v-model="input">
         <button class="region" @click="this.showRegions = true">
            {{ this.region.toUpperCase() }}
         </button>
         <!-- <Dropdown 
            :options="options"
            @region-emit="regionSelect" 
            /> -->
      </div>
      <div class="region-selection" v-show="showRegions">
         <div v-for="region in this.regionOptions" :key="region" @click="regionSelect(region)">
            {{ region.toUpperCase() }}
         </div>
      </div>
      <Transition name="fade">
         <div class="region-alert" v-show="inputAlert">
            {{ this.alertMessage }}
         </div>
      </Transition>
      <!-- <div class="champion-search" v-show="this.containerFocus"> -->
      <div class="champion-search">
         <div v-for="champ in filteredChamps">
            <!-- <img :src="" alt="" srcset=""> -->
            {{ champ }}
         </div>
      </div>
   </div>
</template>

<style scoped>

.champion-search > div {
   padding: 0.3rem 0; 
}
.champion-search {
   background: var(--color-background);
   color: var(--color-font-unfocused);
   font-size: 0.95rem;
   margin-top: 5px;
   border-radius: 5px;
   width: calc(380px + 4rem);
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
.search {
   display: flex;
   flex-direction: column;
   margin-top: 20vh;
   width: 100%;
   align-items: center;
}

.container {
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
   /* background: rgba(255, 255, 255, 0.308); */
   color: var(--color-font);
   text-align: center;
   padding: 0.5rem 1rem;
   border-radius: 5px;
   margin-top: 2rem;
   border: 1px var(--tint100) solid;
   font-size: 0.9rem;
   /* width: 30%; */
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
</style>