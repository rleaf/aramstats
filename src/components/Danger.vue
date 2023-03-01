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
               await axios.get(url)
            } catch (e) {
               console.log('delete', e)
            }
            this.$router.push({ name: `home` })
         }
      }
   }
}
</script>

<template>
   <div class="danger-zone">
      <span style="color: var(--color-font); padding-right: 15px; font-size: 0.9rem;">old data? -></span> 
      <a class="purge" @mouseover="hover = true" @mouseleave="hover = false" @click="deleteSummoner()" >
         Delete
      </a>
      <div class="purge-wrapper" >
      </div>
      <span v-if="hover" class="purge-tooltip">
         If you're seeing missing information, it is hopefully only because I made changes since the
         last time you parsed your summoner.
         <br><br>
         Older parses in the database may not store recently added stats and/or the 
         frontend may not be able to properly read recent variations made to the API.
         Click this if you'd like to delete your summoner from the database.
         You will have to search your profile again.
         <br><br>
         <u>Night Owl</u> on NA will always be UTD for reference.
         <br><br>
         Confirmation will appear after clicking.
      </span>
   </div>   
</template>

<style scoped>
.danger-zone {
   position: relative;
   display: flex;
   margin-left: auto;
   align-items: center;
   padding-top: 38px;
}

.danger-zone a {
   font-size: 1rem;
   color: var(--color-font);
   border: 1px solid var(--color-font);
   border-radius: 5px;
   cursor: pointer;
   padding: 4px 9px;
}

.purge-tooltip {
   position: absolute;
   top: 75px;
   right: 0;
   padding: 0.5rem .7rem;
   border-radius: 5px;
   width: 500px;
   font-size: 0.9rem;
   background: var(--profile-panel);
   box-shadow: 3px 3px 5px 2px var(--profile-tab);
   color: var(--color-font);
}
</style>