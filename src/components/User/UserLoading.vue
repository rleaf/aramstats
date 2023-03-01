<script>

export default {
   data() {
      return {

      }
   },  
}
</script>

<template>
   <div class="loading-main">
      <div>
         <div>
            <h2>
               Parsing summoner...
            </h2>
         </div>
         <p>
            This will take a bit when parsing a new summoner.
         </p>
         <p>
            Ballpark 5-20 min.
         </p>
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
   width: 500px;
   line-height: 1.5;
}
</style>