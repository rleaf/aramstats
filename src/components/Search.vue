<script>
import Dropdown from '../components/Dropdown.vue'

export default {
   components: {
      Dropdown
   },
   data() {
      return {
         input: ''
      }
   },

   props: {
      // input: String
   },

   methods: {
      onEnter: function() {
         this.$router.push(`/na/${this.input}`)
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
         <Dropdown />
         <!-- <Dropdown
            :options="[
               {id: 1, name: 'NA'},
               {id: 2, name: 'EUW'},
            ]"
            :disabled="false"/> -->
      </div>
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
   /* background-color: transparent; */
   /* border: 0; */
   height: 3rem;
   margin: 2px;

}
</style>