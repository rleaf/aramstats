<script setup>
import axios from 'axios'
import Nav from './components/Nav.vue'
import SmallScreen from './components/SmallScreen.vue';
import champions from './constants/champions';
import { superStore } from './stores/superStore'
import Header from './components/Header.vue'
import { onMounted } from 'vue'
import Notification from './components/Notification.vue'

const store = superStore()

for (const champion of champions.names) {
    let x = {}
    x.back = (champion[1] === "MonkeyKing") ? 'wukong' : champion[1].toLowerCase()
    x.front = champion[2]
    // x.image = `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/${champion[1]}.png`
    x.image = champion[1].toLowerCase()
    store.champions.push(x)
}

onMounted(async () => {
  await store.initPatches()
  await store.initItems()
})
</script>

<template>
    <SmallScreen />
    <!-- <Header /> -->
    <!-- <Notification /> -->
    <Nav />
</template>

<style>

</style>
