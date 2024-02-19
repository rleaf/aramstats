<script setup>
import Nav from './components/Nav.vue'
import SmallScreen from './components/SmallScreen.vue';
import champions from './constants/champions';
import { superStore } from './stores/superStore'
import Header from './components/Header.vue'
</script>

<script>
export default {
    data() {
        return {
            store: superStore()
        }
    },

    created() {
        for (const champion of champions.names) {
            let x = {}
            x.back = (champion[1] === "MonkeyKing") ? 'wukong' : champion[1].toLowerCase()
            x.front = champion[2]
            // x.image = `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/${champion[1]}.png`
            x.image = champion[1].toLowerCase()
            this.store.champions.push(x)
        }
    }
}
</script>

<template>
    <SmallScreen />
    <Header />
    <Nav />
</template>

<style>

</style>
