<script>
import Dropdown from '../components/Dropdown.vue'

export default {
   components: {
      Dropdown,
   },

   data() {
      return {
         input: '',
         region: '',
         inputAlert: false,
         alertMessage: String,
         callProc: true
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

         // const inputURI = encodeURI(this.input)
         // this.$router.push({path: `/${this.region.toLowerCase()}/${inputURI}`})
         this.$router.push({ name: `user`, params: {
            region: this.region.toLowerCase(),
            username: encodeURI(this.input),
         }})

         this.callProc = true
      },

      regionSelect(region) {
         this.region = region
      }
   },
}

</script>

<template>
   <div class="search">
      <!-- <h1>ARAM Stats</h1> -->
      <img src="../assets/logo.svg" class="logo" alt="">
      <div class="container">
         <input type="text" v-on:keyup.enter="onEnter" placeholder="Summoner Name" v-model="input">
         <!-- <button>Search</button> -->
         <Dropdown 
         :options="[
            {id: 1, region: 'NA'},
            {id: 2, region: 'EUW'},
            {id: 3, region: 'EUNE'},
            {id: 4, region: 'LAN'},
            {id: 5, region: 'LAS'},
            {id: 6, region: 'OCE'},
            {id: 7, region: 'KR'},
         ]"
            @region-emit="regionSelect" 
            />
         </div>
         <Transition name="fade">
            <div class="region-alert" v-show="inputAlert">
               {{ this.alertMessage }}
            </div>
         </Transition>
   </div>
</template>

<style scoped>
img.logo {
   width: 250px;
   padding-bottom: 2rem;
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
   background-color: var(--search-bar);
   border-radius: 5px;
}

input {
   display: inline-block;
   background-color: var(--search-bar);
   border: none;
   border-radius: 5px;
   padding: 1rem;
   font-size: 1rem;
   color: var(--color-font-search);
   /* width: 300px; */
}

input:focus {
   outline: none;
   background-color: var(--search-bar);
   transition: 0.4s;
}

button {
   height: 3rem;
   margin: 2px;
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