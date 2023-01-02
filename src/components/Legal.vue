<script>
export default {
   data() {
      return {
         msg: `Aramstats.lol isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.`,
      }
   }
}
</script>

<template>
   <div class="legal">
      {{ this.msg }}
   </div>
</template>

<style scoped>
.legal {
   color: var(--color-font);
   text-align: center;
   position: absolute;
   max-width: 800px;
   font-size: 0.9rem;
   bottom: 2rem;
}
</style>