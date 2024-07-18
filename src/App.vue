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
  try {
    const url = 'https://ddragon.leagueoflegends.com/api/versions.json'
    store.patches = (await axios.get(url)).data.slice(0, 10)
    
  } catch (e) {
    if (e instanceof Error) console.log(e)
  }

  // Items
  try {
    const url = `https://ddragon.leagueoflegends.com/cdn/${store.patches[0]}/data/en_US/item.json`
    store.items = (await axios.get(url)).data.data
  } catch (e){
    if (e instanceof Error) console.log(e)
  }

  // Spells
  try {
    const url = `https://ddragon.leagueoflegends.com/cdn/${store.patches[0]}/data/en_US/item.json`
    store.spells = (await axios.get(url)).data.data
  } catch (e){
    if (e instanceof Error) console.log(e)
  }

  // // Skills
  // try {
  //   const url = `https://ddragon.leagueoflegends.com/cdn/${store.patches[0]}/data/en_US/item.json`
  //   store.skills = (await axios.get(url)).data.data
  // } catch (e){
  //   if (e instanceof Error) console.log(e)
  // }

  // Runes
  try {
    const url = `https://ddragon.leagueoflegends.com/cdn/${store.patches[0]}/data/en_US/runesReforged.json`
    store.runes = (await axios.get(url)).data.data
  } catch (e){
    if (e instanceof Error) console.log(e)
  }

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
