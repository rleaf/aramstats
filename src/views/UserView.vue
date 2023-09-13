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
            currentPatch: null,
            status: null,
            check: null
         }
      },
      
      watch: {
         status(c, _) {
            if ((c && c.current === c.queue) || this.userReadyRender) this.$router.go()
         },

         userReadyRender(c, _) {
            if (c) clearInterval(this.check)
         },

         // response(c, _) {
         //    if (Object.hasOwn(c, 'name')) this.userReadyRender = true
         // }
      },
      
      created() {
         this.lookup()
         this.getCurrentPatch()
         
         // this.matchHistory()

         this.check = setInterval(() => {
            this.lookup()
         }, 30000)
      },

      methods: {
         async getCurrentPatch() {
            const url = 'https://ddragon.leagueoflegends.com/api/versions.json'

            try {
               // this.currentPatch = (await axios.get(url)).data[0].split('.').slice(0, 2).join('.')
               this.currentPatch = (await axios.get(url)).data[0]
            } catch (e) {
               console.log(e, 'getCurrentPatch')
            }
         },

         async lookup() {
            const url = `/api/summoners/${this.$route.params.region}/${this.$route.params.username}`

            try {
               const res = await axios.get(url)
               if (res.data.active) {
                  this.status = res.data
               } else {
                  this.response = res.data
                  // console.log(this.response, 'res')
                  this.userReadyRender = true
               }
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
         v-if="!userReadyRender && !userErrorRender"
         :status="this.status"/>
      <UserReady
         v-if="userReadyRender"
         :response="this.response"
         :currentPatch="this.currentPatch"/>
      <UserError
         v-if="userErrorRender"
         :user="this.$route.params.username"
         :errorStatus="this.errorStatusParent"/>
   </div>
</template>

<style scoped>

</style>