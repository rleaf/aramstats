<script>

export default {
   data() {
      return {
         showModal: false
      }
   },


}
</script>

<template>
   <img @click="this.showModal = true" class="settings" src="@/assets/svg/ellipses.svg" alt="">
   <div v-if="this.showModal" class="modal-main">
      <div class="modal">
         <div class="head">
            <h1>Starting Items / Spells / Skill Priority</h1>
            This section displays general data from all observed games of a champion. Most fields are limited to ~10 entries.
         </div>
      </div>
      <div class="modal-back" @click="this.showModal = false" />
   </div>
</template>

<style scoped>
@import url('./styles.css');
</style>