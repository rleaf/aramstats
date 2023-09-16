<script>
import Dropdown from '../components/Dropdown.vue'
import regions from '../constants/regions'

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
      }
   },

   methods: {

      onEnter() {
         if (this.region == '' || this.input == '') {
            this.alertMessage = 'Enter a summoner name and/or region.'
            this.inputAlert = true
            setTimeout(() => {
               this.inputAlert = false
            }, 800)

            return
         }

         this.$router.push({ name: `user`, params: {
            region: this.region,
            username: encodeURI(this.input),
         }})
         

         // push region into localstorage
         // localStorage.setItem('region', this.region)
      },

      regionSelect(region) {
         this.region = region
         this.showRegions = false
      },
   },
}

</script>

<template>
   <div class="search">
      <img src="../assets/logo.svg" class="logo" alt="">
      <div class="container">
         <input type="text" v-on:keyup.enter="onEnter" placeholder="Summoner Name" v-model="input">
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
   </div>
</template>

<style scoped>

.region-selection {
   margin-top: 1rem;
}

.region-selection > div {
   color: var(--color-font);
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
   display: inline-block;
   color: var(--color-font);
   font-family: var(--font-main);
   background: transparent;
   font-size: 1rem;
   border-radius: 5px;
   border: none;
   padding: 1rem;
   width: 80px;
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
   /* display: inline-block; */
   /* background-color: var(--search-bar); */
   border: 2px solid var(--tint100);
   border-radius: 50px;
}

input {
   display: inline-block;
   background: transparent;
   border: none;
   padding: 1rem 4rem;
   font-size: 1rem;
   color: var(--color-font);
   /* color: var(--color-font-search); */
   /* width: 300px; */
}

input:focus {
   outline: none;
   /* background-color: var(--tint100); */
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
   border: #f50d0d 1px solid;
   transition: 1s;
}

.fade-leave-active {
   transition: opacity 0.6s ease;
}

.fade-leave-to {
   opacity: 0;
}
</style>