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
            This will take a bit when parsing a new summoner. Feel free to close this page and check back later
            otherwise this page will refresh automatically.
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
   /* align-items: center; */
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