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
   <div>
      {{ `User ${this.user} does not exist.`}}
   </div>
</template>

<style scoped>

</style>