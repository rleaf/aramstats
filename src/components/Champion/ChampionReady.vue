<script>
import axios from 'axios'

export default {
   data() {
      return {
         builds: null,
         patch: null,
         
      }
   },

   created() {

      const test = {
         'item1': {
            'item10': {
               '_inner1': '1'
               },
            'item11': {
               '_inner2': "2"
               }
         },
         'item2': {
            'item20' : {}
         }
      }
      this.getCurrentPatch()
      console.log(this.champion, 'weee')
      this.iterate(test)
      // this.unpack(this.champion.builds)
   },

   methods: {
      async getCurrentPatch() {
         const url = 'https://ddragon.leagueoflegends.com/api/versions.json'

         try {
            // this.patch = (await axios.get(url)).data[0].split('.').slice(0, 2).join('.')
            this.patch = (await axios.get(url)).data[0]
         } catch (e) {
            console.log(e, 'getCurrentPatch')
         }
      },

      mythicImage(Id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${Id}`
      },
      unpack(obj) {
         const stack = [obj]
         console.log(stack)
         while (stack?.length > 0) {
            const currentObj = stack.pop()
            Object.keys(currentObj).forEach(key => {
               if (typeof currentObj[key] === 'object') {

               }
            })
         }
      },

      // https://stackoverflow.com/questions/8085004/iterate-through-nested-javascript-objects
      iterate(obj) {
         console.log(obj, 'everything')
         for (const o of Object.keys(obj)) {
            console.log(o, obj[o])
            const stack = [obj[o]]

            // while (stack.length > 0) {
            //    const curr = stack.pop()
            //    if (typeof )
            // }
         }
         // const stack = [obj]

         // while (stack?.length > 0) {
         //    const currentObj = stack.pop()
         //    Object.keys(currentObj).forEach(key => {
         //       // if (/[0-9]{4}$/.test(key)) console.log(key)
         //       // if (key !== 'meta') console.log(key)
               
         //       console.log(typeof key, currentObj[key], 'toad')
         //       // console.log(`key: ${key}, value: ${currentObj[key]}`)
         //       if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
         //          stack.push(currentObj[key])
         //       }
         //    })
         // }
         // console.log(stack)
      }

   },

   props: {
      champion: null
   }
}


</script>

<template>
   <div class="champion-ready-main">

   </div>
</template>

<style scoped></style>