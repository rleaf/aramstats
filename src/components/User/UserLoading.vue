<script>
import axios from 'axios'

export default {
   data() {
      return {
         hover: null
      }
   },

   methods: {
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
   }
}
</script>

<template>
   <div class="loading-main">
      <div>
         <h2>
            Parsing summoner...
         </h2>
         <p>
            This will take a bit when parsing a new summoner (~5-20 min depending on load).
         </p>
         <!-- <p>
            If you're stuck, delete & re-pull summoner.
         </p>
         <p></p>
         <a class="purge" @mouseover="hover = true" @mouseleave="hover = false" @click="deleteSummoner()" >
            Delete
         </a> -->
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
   color: var(--color-font);
}

p {
   color: var(--color-font);
   width: 700px;
   line-height: 1.5;
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