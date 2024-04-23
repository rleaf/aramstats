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
      // this.populate()
      this.populate2()
   },

   methods: {
      populate() {
         let friends = []
         let enemies = []
         for (const champion of this.data) {
            for (const match of champion.matches) {
               if (match.w) {
                  match.te.forEach(x => x.win = 1)
                  match.ee.forEach(x => x.win = 1)
               } else {
                  match.te.forEach(x => x.win = 0)
                  match.ee.forEach(x => x.win = 0)
               }
               friends.push(match.te)
               enemies.push(match.ee)
            }
         }
         const algo = (arr, obj) => {
            arr = arr.flat().sort((a, b) => a.gn.localeCompare(b.gn))

            let counter = arr.reduce((o, c) => {
               const key = (c.gn) ? `${c.gn}#${c.tl}` : c.name
               // (o[key]) ? o[key] = [o[key][0] + 1, o[key][1] + c.win] : o[key] = [1, c.win]
               if (o[key]) {
                  o[key] = [o[key][0] + 1, o[key][1] + c.win]
               } else {
                  o[key] = [1, c.win]
               }
               return o
            }, {})
            const burger = Object.entries(counter).filter(x => x[1][0] > 5).sort((a, b) => b[1][0] - a[1][0])
            
            return burger
         }
         this.friendlies = algo(friends)
         this.enemies = algo(enemies)

         console.log(this.friendlies, 'toad')
      },

      populate2() {
         for (const champion of this.data) {
            for (const match of champion.matches) {
               if (match.w) {
                  match.te.forEach(x => x.win = 1)
                  match.ee.forEach(x => x.win = 1)
               } else {
                  match.te.forEach(x => x.win = 0)
                  match.ee.forEach(x => x.win = 0)
               }
               friends.push(match.te)
               enemies.push(match.ee)
            }
         }
      }
   },

   props: {
      data: null,
   }
}
</script>

<template>
   <div class="encounters-main">
      <div class="friendlies">
         toad
      </div>
      <div class="enemies">
         frog
      </div>
   </div>
</template>

<style scoped>

</style>