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
            poll: null,
            patch: null,
            unique: 0,
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
            const url = `/api/summoners/check/${this.$route.params.region}/${this.$route.params.gameName}/${this.$route.params.tagLine}`

            try {
               const res = await axios.get(url)
               this.status = res.status
               this.response = res.data
            } catch (e) {
               this.response = e.response.data
               this.status = e.response.status
            }

            console.log(this.response, 'response')
            console.log(this.status, 'status')
            if (this.status === 200) {
               this.poll = setInterval(() => {
                  this.unique++
                  this.lookup()
               }, 20000)

               this.lookup()
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
            }, 20000)

            this.lookup()
         },

         async lookup() {
            const url = `/api/summoners/${this.$route.params.region}/${this.$route.params.gameName}/${this.$route.params.tagLine}`
            if (!this.regionOptions.includes(this.$route.params.region)) {
               this.status = 404
               return
            }

            try {
               this.response = (await axios.get(url, {
                  params: {
                     rand: this.unique
                  }
               })).data
            } catch (e) {
               this.status = e.response.status
               clearInterval(this.poll)
            }

            
            if (this.response.parse.status === 'Complete') clearInterval(this.poll)
         },
      },

   }
</script>

<template>
   
   <!-- <UserLoading 
      v-else-if="!this.response || this.response.parse.status !== 'Complete'"
      :response="this.response"/> -->
   <UserLoading 
      v-if="this.status === 200 && (!this.response || this.response.parse.status !== 'Complete')"
      :response="this.response"/>
   <UserReady
      v-else-if="this.status === 200 && this.response.parse.status === 'Complete'"
      :_data="this.response"
      :patch="this.patch"/>
   <UserError v-else
      :user="{
            name: this.$route.params.gameName,
            tagLine: this.$route.params.tagLine,
            region: this.$route.params.region
      }"
      :response="this.response"
      :error="this.status"
      @initParse="this.initParse">
   </UserError>
</template>

<style scoped>
.new-user {
   display: flex;
   flex-direction: column;
   align-items: center;
   color: var(--color-font);
   margin-top: 20vh;
}

.new-user p {
   width: 500px;
   font-size: 0.9rem;
   text-align: center;
}

.new-user a {
   color: var(--color-font-focus);
   text-decoration: underline;
   transition: 150ms ease-in-out;
}

</style>