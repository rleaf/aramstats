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
            error: null,
            patch: null,
            poll: null,
            unique: 0,
         }
      },

      created() {
         this.lookup()
         // Consider long polling https://javascript.info/long-polling
         // setTimeout(() => {
         //       this.unique++
         //       this.lookup()
         //    }
         // }, 5000)

         this.poll = setInterval(() => {
            this.unique++
            this.lookup()
         }, 20000)
      },
      
      mounted() {
         this.getCurrentPatch()
      },

      methods: {
         async getCurrentPatch() {
            const url = 'https://ddragon.leagueoflegends.com/api/versions.json'

            try {
               // this.currentPatch = (await axios.get(url)).data[0].split('.').slice(0, 2).join('.')
               this.patch = (await axios.get(url)).data[0]
            } catch (e) {
               console.log(e, 'getCurrentPatch')
            }
         },

         async lookup() {
            const url = `/api/summoners/${this.$route.params.region}/${this.$route.params.gameName}/${this.$route.params.tagLine}`
            if (!this.regionOptions.includes(this.$route.params.region)) {
               this.error = 404
               return
            }

            try {
               this.response = (await axios.get(url, {
                  parms: {
                     rand: this.unique
                  }
               })).data
            } catch (e) {
                this.error = e.response.status
                clearInterval(this.poll)
            }
            
            console.log(this.response, 'toads')
            console.log(this.response.parse.status, 'toads2')
            if (this.response.parse.status === 'Complete') console.log('yeeeee')
            
            if (this.response.status === 'Complete') clearInterval(this.poll)
         },
      },

      computed: {
        getStatus() {
            if (this.response) return this.response.status
        }
      }
   }
</script>

<template>
    <div>
        <UserLoading 
            v-if="!this.response || this.response.parse.status !== 'Complete'"
            :response="this.response"/>
        <UserReady
            v-else-if="this.response.parse.status === 'Complete'"
            :_data="this.response"
            :patch="this.patch"/>
        <UserError
            v-else
            :user="{
                name: this.$route.params.gameName,
                tagLine: this.$route.params.tagLine,
                region: this.$route.params.region
            }"
            :error="this.error"/>
   </div>
</template>

<style scoped>

</style>