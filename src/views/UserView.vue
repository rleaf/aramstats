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
            response: null,
            userReadyRender: false,
            userErrorRender: false,
            errorStatusParent: Number,
         }
      },
      
      created() {
         this.lookup()
         // this.matchHistory()
      },

      methods: {
         async lookup() {
            const url = `/api/summoners/${this.$route.params.region}/${this.$route.params.username}`

            try {
               const res = await axios.get(url)
               this.response = res.data
               console.log(this.response, 'response')
               this.userReadyRender = true
            } catch (e) {
               this.errorStatusParent = e.response.status
               this.userErrorRender = true
            }

         },

         async matchHistory() {
            const url = `/api/history/${this.$route.params.region}/${this.$route.params.username}`
            
            try {
               const res = await axios.get(url)
               this.history = res.data
            } catch (e) {
               console.log('e', e)
            }
         }
      }
   }
</script>

<template>
   <div>
      <UserLoading 
         v-if="!userReadyRender && !userErrorRender"/>
      <UserReady
         v-if="userReadyRender"
         :userInfo="this.response"/>
      <UserError
         v-if="userErrorRender"
         :user="this.$route.params.username"
         :errorStatus="this.errorStatusParent"/>
   </div>
</template>

<style scoped>

</style>