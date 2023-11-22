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
            regionOptions: ['na', 'euw', 'eune', 'kr', 'lan', 'las', 'oce', 'tr', 'ru', 'jp', 'br', 'vn', 'tw', 'th', 'sg', 'ph'],
            response: null,
            responseStatus: null,
            error: null,
            currentPatch: null,
            poll: null,
            unique: 0,
         }
      },

      created() {
         this.lookup()
         // Consider long polling https://javascript.info/long-polling
         // setTimeout(() => {
         //    if (!this.responseStatus) {
         //       this.unique++
         //       this.lookup()
         //    }
         // }, 5000)

         this.poll = setInterval(() => {
            this.unique++
            this.lookup()
         }, 30000)
      },
      
      mounted() {
         this.getCurrentPatch()
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

         lookup() {
            const url = `/api/summoners/${this.$route.params.region}/${this.$route.params.gameName}/${this.$route.params.tagLine}`
            if (!this.regionOptions.includes(this.$route.params.region)) {
               this.responseStatus = 2
               this.error = 404
               return
            }

            axios.get(url, {
               params: {
                  rand: this.unique
               }
            })
            .then((res) => {
               this.response = res.data
               
               if (this.response.active) {
                  this.responseStatus = 0
               } else {
                  this.responseStatus = 1
                  clearInterval(this.poll)
               }
            })
            .catch((e) => {
               clearInterval(this.poll)
               this.error = e.response.status
               this.responseStatus = 2
            })
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
         v-if="!responseStatus"
         :status="this.response"
         :responseStatus="this.responseStatus"/>
      <UserReady
         v-if="responseStatus === 1"
         :response="this.response"
         :currentPatch="this.currentPatch"/>
      <UserError
         v-if="responseStatus === 2"
         :user="{
            name: this.$route.params.gameName,
            tagLine: this.$route.params.tagLine,
            region: this.$route.params.region
         }"
         :error="error"/>
   </div>
</template>

<style scoped>

</style>