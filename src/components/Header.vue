<script>
import updates from '../constants/updates'
export default {
   data() {
      return {
         msg: updates[0].title,
      }
   }
}
</script>

<template>
   <div class="header-main">
      <RouterLink to="/updates">{{ this.msg }}</RouterLink>
   </div>
</template>

<style scoped>
   .header-main {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 35px;
      background: var(--alpha-06);
      /* background: rgba(82, 32, 32, 0.5); */
   }

   a, p {
      color: var(--color-font);
      font-size: 0.85rem;
   }
</style>