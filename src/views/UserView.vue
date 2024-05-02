<script>
import UserLoading from '../components/User/UserLoading.vue'
import UserError from '../components/User/UserError.vue'
import UserReady from '../components/User/UserReady.vue'
import axios, { CanceledError } from 'axios'

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
            poll: null,
            patch: null,
            unique: 0,
            key: 0,
            status: null,
         }
      },

      created() {
         this.checkSummoner()
      },
      
      mounted() {
         this.getCurrentPatch()
      },


      methods: {
         async checkSummoner() {
            try {
               decodeURI(this.$route.params.gameName)
            } catch (e) {
               this.response = 'Summoner does not exist.'
               this.status = 404
               return
            }

            const url = `/api/summoners/check/${this.$route.params.region}/${this.$route.params.gameName}/${this.$route.params.tagLine}`

            try {
               const res = await axios.get(url, {
                  signal: AbortSignal.timeout(10000),
               })
               this.status = res.status
               this.response = res.data
            } catch (e) {
               if (!(e instanceof CanceledError)) {
                  this.response = e.response.data
                  this.status = e.response.status
               }
            }

            if (this.status === 200 && (this.response && this.response.parse.status !== 'Complete')) {
               this.poll = setInterval(() => {
                  this.unique++
                  this.lookup()
               }, 30000)
            }
         },

         async getCurrentPatch() {
            const url = 'https://ddragon.leagueoflegends.com/api/versions.json'

            try {
               this.patch = (await axios.get(url)).data[0]
            } catch (e) {
               console.log(e, 'getCurrentPatch')
            }
         },

         async initParse() {
            this.response = null
            this.status = null
            this.poll = setInterval(() => {
               this.unique++
               this.lookup()
            }, 30000)

            this.lookup()
         },

         async lookup() {
            const url = `/api/summoners/${this.$route.params.region}/${this.$route.params.gameName}/${this.$route.params.tagLine}`
            if (!this.regionOptions.includes(this.$route.params.region)) {
               this.status = 404
               return
            }

            try {
               const res = await axios.get(url, {
                  params: { rand: this.unique },
                  signal: AbortSignal.timeout(10000),
               })
               this.status = res.status
               this.response = res.data
            } catch (e) {
               if (!(e instanceof CanceledError)) {
                  this.response = e.response.data
                  this.status = e.response.status
               }

               clearInterval(this.poll)
            }
            
            if (this.status === 200 && this.response.parse.status === 'Complete') clearInterval(this.poll)
         },
      },

   }
</script>

<template :key="this.key">
   <p class="searching" v-if="!this.status">
      Searching for summoner...
   </p>
   <UserLoading 
      v-else-if="this.status === 200 && (this.response && this.response.parse.status !== 'Complete')"
      :response="this.response"/>
   <UserReady
      v-else-if="this.status === 200 && (this.response && this.response.parse.status === 'Complete')"
      :_data="this.response"
      :patch="this.patch"/>
   <UserError v-else
      :user="{
            name: this.$route.params.gameName,
            tagLine: this.$route.params.tagLine,
            region: this.$route.params.region
      }"
      :response="this.response"
      :status="this.status"
      @initParse="this.initParse"/>
</template>

<style scoped>
.searching {
   display: flex;
   flex-direction: column;
   align-items: center;
}

p.searching {
   color: var(--color-font);
   margin-top: 20vh;
   font-size: 0.9rem;
   text-align: center;
}
</style>