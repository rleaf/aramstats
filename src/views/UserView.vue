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

      // computed: {
      //    summonerData() {
      //       this.lookup()
      //    }
      // },

      watch: {
         summonerInfo(curr, prev) {
            console.log('new summonerInfo')
            if (this.summonerInfo === 'pulling') {
               console.log('pulling')
               return
            } else {
               console.log('summonerInfo is good')
               this.userReadyRender = true
            }

            console.log(curr)
            console.log(prev)
         }
      },
      
      methods: {
         async lookup() {
            const url = `http://localhost:5000/api/summoners/${this.$route.params.region}/${this.$route.params.username}`
            let data

            await axios.get(url)
               .then(res => data = res.data)
               .catch(e => console.log(e))

            return data
            // await axios.get(url)
            //    .then(res => {
            //       if(res.data === 'pulling') {
            //          return
            //       } else {
            //          this.summonerInfo = res.data
            //          this.userReadyRender = true
            //       }
            //    })
            //    .then(() => {
            //       console.log('weee', this.userReadyRender)
            //    })
            //    .catch(e => console.log(e))
         },
      }
   }
</script>

<template>
   <div>
      <!-- {{ this.$route.params.username }} -->
      <UserLoading 
         v-if="!userReadyRender"
         :messages="this.summonerInfo"/>
      <UserReady
         v-if="userReadyRender"
         :userInfo="this.summonerInfo"
         />
   </div>
</template>

<style scoped>

</style>