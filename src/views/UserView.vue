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
            userReadyRender: false,
            activePull: false
         }
      },
      // beforeRouteEnter(to, from, next) {
      //    if (from.name == 'home') {
      //       next(x => {
      //          x.proc = true
      //       })
      //    } else {
      //       next()
      //    }
      // },
      
      mounted() {
         this.lookup()
      },
      
      methods: {
         async lookup() {
            const url = `http://localhost:5000/api/summoners/${this.$route.params.region}/${this.$route.params.username}`

            await axios.get(url)
               .then((res) => {
                  this.summonerInfo = res.data
               })
               .then(() => {
                  this.userReadyRender = true
                  console.log('weee', this.userReadyRender)
               })
               .catch((e) => {
                  console.log(e)
               })
         },
      }
   }
</script>

<template>
   <div>
      <!-- {{ this.$route.params.username }} -->
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