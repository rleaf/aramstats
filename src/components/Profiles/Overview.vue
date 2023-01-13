<script>

export default {
   components: {

   },
   data() {
      return {

      }
   },

   props: {
      data: null
   }
}
</script>

<template>
   <div class="overview-main">
      <div class="wip">soon.tm</div>

   </div>
</template>

<style scoped>
.overview-main {
      background: var(--profile-panel);
      height: 350px;
      border-radius: 5px;
   }

   .wip {
      text-align: center;
      padding-top: 150px;
      color: var(--color-font);
   }
</style>