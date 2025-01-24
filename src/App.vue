<script setup>
import Nav from './components/Nav.vue'
import SmallScreen from './components/SmallScreen.vue';
import { superStore } from './stores/superStore'
import Header from './components/Header.vue'
import { onMounted } from 'vue'
// import Notification from './components/Notification.vue'

const store = superStore()

onMounted(async () => {
  await store.initPatches()
  await store.initItems()
})
</script>

<template>
    <SmallScreen />
    <Header />
    <!-- <Notification /> -->
    <Nav />
</template>

<style>

</style>
