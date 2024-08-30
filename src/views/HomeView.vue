<!-- <script setup>
// @ts-ignore
import Search from '../components/Search.vue'
import Legal from '../components/Legal.vue'
import Experience from '../components/Experience.vue'
</script> -->

<script>
import Search from '../components/Search.vue'
import Legal from '../components/Legal.vue'
import Experience from '../components/Experience.vue'

export default {
  components: {
    Search,
    Legal,
    Experience
  },

  head: {
    meta: [
      { property: 'og:title', content: `ARAM Stats` },
      { property: 'og:type', content: `website` },
      { property: 'og:url', content: `https://aramstats.lol`  },
      { property: 'og:description', content: `Aramstats provides insightful Howling Abyss summoner and champion statistics.`  },
      { name: 'description', content: `Aramstats provides insightful Howling Abyss summoner and champion statistics`  },
      { name: 'keywords', content: `ARAM, Howling Abyss, Stats` },
    ]
  }

}
</script>

<template>
  <main>
    <Search />
    <Legal />
    <Experience />
  </main>
</template>