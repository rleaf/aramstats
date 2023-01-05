<script>
import UserLoading from '../components/User/UserLoading.vue'
import UserError from '../components/User/UserError.vue'
import UserReady from '../components/User/UserReady.vue'
import axios from 'axios'

   export default {
      components: {
         UserLoading,
         UserError,
         UserReady
      },
      data() {
         return {
            userInfo: this.$route.params,
            summonerInfo: null,
            userReadyRender: false,
            userErrorRender: false,
            activePull: false,
            errorStatusParent: Number,
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

      // watch: {
      //    summonerInfo(curr, prev) {
      //       if (this.summonerInfo === 'pulling') {
      //          return
      //       } else {
      //          // this.userReadyRender = true
      //       }
      //    }
      // },
      
      methods: {
         async lookup() {
            const url = `/api/summoners/${this.$route.params.region}/${this.$route.params.username}`

            await axios.get(url)
               .then(res => {
                  this.summonerInfo = res.data
                  if (res.data === 'pulling') {
                     return
                  } else {
                     this.userReadyRender = true
                  }
                  console.log(res, 'res')
               })
               .catch(e => {
                  this.errorStatusParent = e.response.status
                  this.userErrorRender = true
               })
         },
      }
   }
</script>

<template>
   <div>
      <UserLoading 
         v-if="!userReadyRender && !userErrorRender"/>
      <UserReady
         v-if="userReadyRender"
         :userInfo="this.summonerInfo"/>
      <UserError
         v-if="userErrorRender"
         :user="this.$route.params.username"
         :errorStatus="this.errorStatusParent"/>
   </div>
</template>

<style scoped>

</style>