// /* 
//    hm
// */

// import { defineStore } from "pinia"
// import axios from 'axios'

// export const globalsStore = defineStore('globe', {
//    state() {
//       return {
//          patch: null
//       }
//    },
//    actions: {
//       increment() {
//          this.count++
//       },
//       async getPatch() {
//          const url = 'https://ddragon.leagueoflegends.com/api/versions.json'

//          try {
//             this.patch = (await axios.get(url)).data[0]
//          } catch (e) {
//             console.log(e, 'getCurrentPatch')
//          }
//       }
//    },
// })