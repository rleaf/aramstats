<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
   <nav>
      <div class="left">
         <RouterLink to="/">Home</RouterLink>
      </div>
      <div class="right">
         <RouterLink to="/about">About</RouterLink>
      </div>
   </nav>
   <RouterView />
</template>

<style scoped>

nav {
   height: 5rem;
   width: 100%;
   display: flex;
   justify-content: space-between;
   align-items: center;
}

nav .left {
   padding-left: 2rem;
}

nav .right {
   padding-right: 2rem;
}

a {
   padding-left: 0.5rem;
   padding-right: 0.5rem;
   font-size: 1.1rem;
   text-decoration: none;
   color: var(--color-font);
   transition: 0.4s;
}

a:hover {
   color: #ffffff;
}

</style>