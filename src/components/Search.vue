<script>
import Dropdown from '../components/Dropdown.vue'

export default {
   components: {
      Dropdown
   },
   data() {
      return {
         input: '',
         region: '',
         inputAlert: false,
         alertMessage: String
      }
   },

   methods: {
      async onEnter() {
         // Put route handling here
         // Check if input field is empty
         // Check if summoner exists....etc...
         // Route to according page....etc...
         if (this.region == '' || this.input == '') {
            this.alertMessage = 'Enter a summoner name and/or region.'
            this.inputAlert = true
            setTimeout(() => {
               this.inputAlert = false
            }, 800)

            return
         }
         this.$router.push({path: `/${this.region.toLowerCase()}/${this.input}`})
         // try {
         //    const user = await this.lookup()
         //    if(user) {
         //       this.$router.push(
         //          {path: `/${this.region.toLowerCase()}/${this.input}`}
         //       )
         //       console.log(user)
         //    }
         // } catch (err) {
         //    console.log(err);
         // }
      },

      // async lookup() {
      //    const url = 'http://localhost:5000/api/users'
      //    try {
      //       const res = await axios.get(url)
      //       // console.log(res.data)
      //       return res.data
      //    } catch (err) {
      //       console.log(err)
      //    }
      // },

      regionSelect(region) {
         this.region = region
      }
   },
}

</script>

<template>
   <div class="search">
      <h1>League of Legends ARAM</h1>
      <div class="container">
         <input type="text" v-on:keyup.enter="onEnter" placeholder="Summoner Name" v-model="input">
         <!-- <button>Search</button> -->
         <Dropdown 
         :options="[
            {id: 1, region: 'NA'},
            {id: 2, region: 'EUW'},
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
.search {
   display: flex;
   flex-direction: column;
   margin-top: 20vh;
   width: 100vw;
   align-items: center;
}

.container {
   /* display: inline-block; */
   background-color: var(--light1);
   border-radius: 5px;
}

input {
   display: inline-block;
   background-color: var(--light1);
   border: none;
   border-radius: 5px;
   padding: 1rem;
   font-size: 1rem;
   color: var(--dark3);
   /* width: 300px; */
}

input:focus {
   outline: none;
   background-color: var(--light1);
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