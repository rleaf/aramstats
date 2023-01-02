<script>
export default {
   data() {
      return {

      }
   },

   props: {
      user: String
   }
}
</script>

<template>
   <div class="dne-main">
      <div>
         <h2>
            Summoner <i>{{ this.user }}</i> does not exist.
         </h2>
         <p>
            :(
         </p>
      </div>
   </div>
</template>

<style scoped>
.dne-main {
   display: flex;
   width: 100%;
   justify-content: center;
   margin-top: 20vh;
}

h2 {
   font-weight: normal;
   color: var(--color-font);
   text-align: center;
}

p {
   color: var(--color-font);
   text-align: center;
   width: 500px;
   line-height: 1.5;
}
</style>