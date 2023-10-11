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

   created() {
      const localRegion = localStorage.getItem('region')
      if (localRegion) this.region = localRegion
   },

   methods: {
      onEnter() {
         if (this.region.length === 0 || this.input == '') {
            this.alertMessage = 'Enter a summoner name and/or region.'
            this.inputAlert = true
            setTimeout(() => {
               this.inputAlert = false
            }, 1000)
         }

         this.$router.push({ name: `user`, params: {
            region: this.region,
            username: encodeURI(this.input),
         }})
      },

      regionSelect(region) {
         this.region = region
         localStorage.setItem('region', this.region)
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
}

/* Thinking */
/* .container:focus-within {
   box-shadow: 0 0 10px var(--hoverButton);
   transition: 0.25s;
} */

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
   border: #f50d0d 1px solid;
   border-radius: 10px;
   transition: 1s;
}

.fade-leave-active {
   transition: opacity 0.6s cubic-bezier(.25,.1,.25,1);
}

.fade-leave-to {
   opacity: 0;
}
</style>