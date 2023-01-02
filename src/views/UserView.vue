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
            .then((res) => this.summonerInfo = res)
      },

      watch: {
         summonerInfo(curr, prev) {
            if (this.summonerInfo === 'pulling') {
               return
            } else {
               this.userReadyRender = true
            }
         }
      },
      
      methods: {
         async lookup() {
            const url = `/api/summoners/${this.$route.params.region}/${this.$route.params.username}`
            console.log('url', url)
            let data

            await axios.get(url)
               .then(res => data = res.data)
               .catch(e => console.log('error', e))

            return data
         },
      }
   }
</script>

<template>
   <div>
      <UserLoading 
         v-if="!userReadyRender"/>
      <UserReady
         v-if="userReadyRender"
         :userInfo="this.summonerInfo"/>
   </div>
</template>

<style scoped>

</style>