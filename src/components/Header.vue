<script>

</script>

<template>
   <div class="header-main">
      <RouterLink to="/updates">Redesigning backend. Intending to wipe all data.</RouterLink>
      <!-- <p>Working on fix for those stuck on the "Parsing summoner..." page.</p> -->
   </div>
</template>

<style scoped>
   .header-main {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 35px;
      background: var(--hoverButton);
      width: 100%;
      transition: 0.25s;
   }

   a, p {
      color: var(--color-font);
      font-size: 0.85rem;
   }

</style>