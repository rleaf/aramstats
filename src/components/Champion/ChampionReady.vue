<script>
import champions from '../../constants/champions'

export default {
   data() {
      return {
         name: champions.humanName[this.champion._id],
         backName: champions.imageName[this.champion._id]
      }

   },

   created() {
      console.log(this.champion)
   },

   methods: {
      
   },

   computed: {
      champIcon() {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/${this.backName}.png`
      },   
   },
   
   props: {
      champion: null,
      patch: null
   }
}
</script>

<template>
   <div class="champion-ready-main">
      <div class="header">
         <div class="image">
            <img :src="champIcon" alt="">
         </div>
         <div class="lhs-header">
            <h1 class="name">{{ this.name }}</h1>
            <!-- <p class="name">{{ this.name }}</p> -->
            <!-- <p></p> -->
         </div>
      </div>
   </div>
</template>

<style scoped>

.champion-ready-main {
   display: flex;
   align-items: center;
   flex-direction: column;
}

.header {
   display: flex;
   color: var(--color-font);
   padding-top: 10vh;
}

.lhs-header {
   padding-left: 1.5rem;
}

.name {
   font-size: 2.8rem;
   margin: 0;
   font-family: var(--header-font);
}


.image {
   width: 100px;
   height: 100px;   
   overflow: hidden;
}

.image img {
   width: 100%;
   transform: scale(1.2);
}
</style>