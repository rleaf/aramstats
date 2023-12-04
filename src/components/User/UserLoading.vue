<script>
import axios from 'axios'

export default {
   data() {
      return {
         hover: null,
         
      }
   },

   mounted() {
      // if (this.response) this.status = this.response.pull

      // setTimeout(() => {
      //    console.log('yee')
      //    this.lookup()
      // }, 5000);
      
      // this.check = setInterval(() => {
      //    console.log('yoo')
      //    this.lookup()
      // }, 90000)
   },

   beforeUnmount() {
      // clearInterval(this.check)
   },

   methods: {
      async lookup() {
         const url = `/api/summoners/${this.$route.params.region}/${this.$route.params.username}`

         try {
            const res = await axios.get(url)
            this.status = res.data.pull
            this.userReadyRender = true
         } catch (e) {
            console.log(e, 'e')
            this.errorStatusParent = e.response.status
            this.userErrorRender = true
         }

      },

      async deleteSummoner() {
         const url = `/api/summoners/delete/${this.$route.params.region}/${this.$route.params.username}`
         const text = `
         Remove summoner from database?
         `

         if (confirm(text)) {
            try {
               await axios.delete(url)
            } catch (e) {
               console.log('delete error', e)
            }
            this.$router.push({ name: `home` })
         }
      }
   },

   computed: {
      queue() {
         if (this.status) {
            return `${this.status.current} / ${this.status.queue}`
         } else {
            return `0 / TBD`
         }
      }
   },

   props: {
      status: null,
      responseStatus: null
   }
}
</script>

<template>
   <div class="loading-main">
      <div class="active" v-if="responseStatus === 0">
         <div>
            <h2>
               Parsing summoner...
            </h2>
            <p>
               This will take a bit when parsing a new summoner (~5-20 min depending on load).
            </p>
            <div class="queue">
               <p>
                  {{ queue }} matches completed
               </p>
               <p class="sub">
                  I update every 30 seconds (or refresh browser).
               </p>
            </div>
         </div>
      </div>
      <div class="null" v-else>
         <div>
            <h2>
               Searching for summoner...
            </h2>
         </div>
      </div>
   </div>
</template>

<style scoped>
.loading-main {
   display: flex;
   width: 100%;
   justify-content: center;
   margin-top: 20vh;
   text-align: center;
}

h2 {
   font-weight: normal;
   font-size: 1rem;
   color: var(--color-font);
}

p {
   color: var(--color-font);
   width: 700px;
   font-size: 0.95rem;
}

.queue p {
   font-weight: 500;
}

p.sub {
   font-size: 0.9rem;
   font-weight: normal;
   font-style: italic;
   color: var(--color-font-faded);
}

a {
   transition: 0.1s;
   font-size: 1rem;
   color: var(--color-font);
   border: 1px solid var(--color-font);
   border-radius: 5px;
   cursor: pointer;
   padding: 4px 9px;
}

a.purge:hover {
   color: #ec3838;
   border-color: #ec3838;
}

</style>