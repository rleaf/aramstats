<script setup>

</script>

<template>
   <div class="search">
      <h1>League of Legends ARAM</h1>
      <input type="text" placeholder="Summoner Name">
      <button>Search</button>
   </div>
</template>

<style scoped>
.search {
   display: flex;
   flex-direction: column;
   margin-top: 20vh;
   width: 100vw;
   align-items: center;
}

input {
   width: 300px;
   background-color: var(--dark2);
   border: none;
   border-radius: 5px;
   padding: 1rem;
   font-size: 1rem;
   color: var(--light1);
}

input:focus {
   outline: none;
   background-color: var(--test);
   transition: 0.4s;
}
</style>