<script>
import UserLoading from '../components/User/UserLoading.vue'
import UserDNE from '../components/User/UserDNE.vue'
import UserReady from '../components/User/UserReady.vue'
import axios from 'axios'

   export default {
      components: {
         UserLoading,
         UserDNE,
         UserReady
      },
      data() {
         return {
            userInfo: this.$route.params,
            summonerInfo: null,
            userReadyRender: false
         }
      },
      created() {
         this.lookup()
      },

      mounted() {
      },
      
      methods: {
         async lookup() {
            const url = `http://localhost:5000/api/summoners/${this.$route.params.region}/${this.$route.params.username}`
            try {
               const res = await axios.get(url)
               this.summonerInfo = res.data.shift()
               this.userReadyRender = true
            } catch (err) {
               console.log(err)
            }
            console.log(document.cookie)
         },
      }
   }
</script>

<template>
   <div>
      {{ this.$route.params.username }}
      <UserLoading 
         v-if="!userReadyRender"/>
      <UserReady
         v-if="userReadyRender"
         :userInfo="this.summonerInfo"
         />
   </div>
</template>

<style scoped>

</style>