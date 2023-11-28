<script>
import championNameBook from '../constants/championNames'

export default {
   data() {
      return {
         championFilter: '',
         champSearchFocus: false,
         championBook: [],
      }
   },

   mounted() {
      for (let i = 0; i < this.data.length; i++) {
         let champ = {}

         if (this.data[i].name in championNameBook) {
            champ.name = championNameBook[this.data[i].name]
         } else {
            champ.name = this.data[i].name
         }

         champ.image = `https://ddragon.leagueoflegends.com/cdn/${this.currentPatch}/img/champion/${this.data[i].name}.png`
         // champ.image = new URL(`../assets/champion_icons/${this.data[i].name.toLowerCase()}.png`, import.meta.url).href
         this.championBook.push(champ)
      }
      this.championBook.sort((a, b) => a.name.localeCompare(b.name))
   },

   methods: {
      championSearch() {
         if (this.championFilter != '') {
            this.championFilter = ''
         }
         this.champSearchFocus = true
      },

      selectChampion(name) {
         this.championFocus = name
         this.championFilter = name
         this.champSearchFocus = false

         this.$emit('championFocus', name)
      },

      
      champName(name) {
         return (name in championNameBook) ? 
            championNameBook[name] : 
            name
      }
   },

   computed: {
      champSearchList() {
         return this.championBook.filter(champ => champ.name.toLowerCase().includes(this.championFilter.toLowerCase()))
      }
   },

   props: {
      data: null,
      currentPatch: null
   }
}
</script>

<template>
   <div class="champion-search">
      <input type="text" placeholder="Search champion" v-model="championFilter" @click="championSearch"
         @keyup.esc="champSearchFocus = false">
      <div class="champion-search-list" v-show="champSearchFocus">
         <div class="champion-search-select" v-for="champ in champSearchList" :key="champ.name"
            @click="selectChampion(champ.name)">
            <img :src="champ.image" alt="">
            {{ champName(champ.name) }}
         </div>
      </div>
      <div class="outside-search" v-show="champSearchFocus" @click="champSearchFocus = false"></div>
   </div>
</template>

<style scoped>
.champion-search {
   width: 280px;
}

.champion-search input {
   background: var(--alpha-04);
   color: var(--color-font);
   padding: 0.5rem 0.8rem;
   border: none;
   border-radius: 7px;
   width: inherit;
   box-sizing: border-box;
   transition: 0.2s;
}

.champion-search input:hover {
   background: var(--alpha-06);
}

.champion-search input:focus {
   outline: none;
   background: var(--light-15);
}

.champion-search-select {
   display: flex;
   gap: 10px;
   align-items: center;
   padding: 5px 10px;
   font-size: 0.9rem;
   cursor: pointer;
   -webkit-touch-callout: none; /* iOS Safari */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Old versions of Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none;
}

.champion-search-select img {
   width: 30px;
}

.champion-search-list {
   position: absolute;
   /* margin-left: 8px; */
   z-index: 2;
   backdrop-filter: blur(13px) saturate(120%);
   -webkit-backdrop-filter: blur(13px) saturate(120%);
   background-color: rgba(var(--cold-blue-rgb), 0.2);
   border-radius: 12px;
   box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.65);
   color: var(--color-font);
   height: 300px;
   width: 280px;
   overflow-y: scroll;
}

.champion-search-select:hover {
   background: var(--alpha-05);
}

.champion-search-list::-webkit-scrollbar {
   width: 8px;
   background: var(--alpha-01);
   border-radius: 3px;
}

.champion-search-list::-webkit-scrollbar-thumb {
   background-color: var(--alpha-06);
   border-radius: 3px;
}
.champion-search-list::-webkit-scrollbar-thumb:hover {
   background-color: var(--light-12);;
}

.outside-search {
   position: fixed;
   z-index: 1;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
}
</style>