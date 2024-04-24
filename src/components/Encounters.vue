<script>
import StatDropdown from './StatDropdown.vue'

export default {
   components: {
      StatDropdown
   },
   data() {
      return {
         friendlies: {},
         enemies: {},
      }
   },

   created() {
      this.populate()
   },

   methods: {
      populate() {
         const af = (prop, x, arr) => {
            if (!x.gn) return
            let o = `${x.gn}#${x.tl}`
            if (prop[o]) {
               prop[o][0] += arr[0]
               prop[o][1] += arr[1]
            } else {
               prop[o] = arr
            }
         }

         for (const champion of this.data) {
            for (const match of champion.matches) {
               if (match.w) {
                  match.te.forEach(x => af(this.friendlies, x, [1, 1])) // times you've won with player
                  match.ee.forEach(x => af(this.enemies, x, [1, 1]))    // times you've won against player
               } else {
                  match.te.forEach(x => af(this.friendlies, x, [0, 1])) // times you've lost with player
                  match.ee.forEach(x => af(this.enemies, x, [0, 1]))    // times you've lost against player
               }
            }
         }

      }
   },

   computed: {
      getFriendlies() {
         return Object.entries(this.friendlies).sort((a, b) => b[1][1] - a[1][1]).slice(0, 50)
      },
      
      getEnemies() {
         return Object.entries(this.enemies).sort((a, b) => b[1][1] - a[1][1]).slice(0, 50)
      }
   },

   props: {
      data: null,
   }
}
</script>

<template>
   <StatDropdown
      :header="'Friendlies'"
      :stats="this.getFriendlies"
      :encounters="true"
      :tooltip="'friendlies'"/>
   <StatDropdown
      :header="'Enemies'"
      :stats="this.getEnemies"
      :encounters="true"
      :tooltip="'enemies'"/>
</template>

<style scoped>

</style>