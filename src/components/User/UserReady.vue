<script>
export default {
   data() {
      return {
         
      }
   },

   mounted() {
      console.log(this.userInfo);
   },

   props: {
      userInfo: Array
   }

}
</script>

<template>
   <div>
      {{ this.userInfo[0] }}
   </div>
</template>

<style scoped>

</style>