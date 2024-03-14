<script>
export default {
   data() {
      return {
         link: null,
      }
      
   }, 
}
</script>

<template>
<div class="wip-main">
   🚧 This page is being redesigned. Check <router-link :to="{name: 'updates'}">Updates</router-link> for more. 🚧
</div>
</template>

<style scoped>
   .wip-main {
      color: var(--color-font);
      text-align: center;
      background: var(--cell-panel);
      border: 1px solid var(--cell-border);
      padding: 0.7rem 4rem;
      font-size: 0.8rem;
      margin: 0 auto;
      margin-top: 20px;
      width: 480px;
      border-radius: 15px;
   }

   .wip-main a {
      color: var(--color-font);

   }
</style>