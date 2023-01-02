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
            userDNERender: false,
            activePull: false,
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
      
      created() {
         this.lookup()
      },

      watch: {
         // summonerInfo(curr, prev) {
         //    if (this.summonerInfo === 'pulling') {
         //       return
         //    } else {
         //       // this.userReadyRender = true
         //    }
         // }
      },
      
      methods: {
         async lookup() {
            const url = `/api/summoners/${this.$route.params.region}/${this.$route.params.username}`
            let data

            await axios.get(url)
               .then(res => {
                  this.summonerInfo = res.data
                  this.userReadyRender = true
               })
               .catch(e => {
                  if (e.response.status == 404) {
                     this.userDNERender = true
                  }
               })
         },
      }
   }
</script>

<template>
   <div>
      <UserLoading 
         v-if="!userReadyRender && !userDNERender"/>
      <UserReady
         v-if="userReadyRender"
         :userInfo="this.summonerInfo"/>
      <UserDNE
         v-if="userDNERender"
         :user="this.$route.params.username"/>
   </div>
</template>

<style scoped>

</style>