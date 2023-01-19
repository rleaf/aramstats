<script>
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
         if ('championName' in this.data[i]) {
            if (this.data[i].trueChampionName) {
               champ.trueChampionName = this.data[i].trueChampionName
            }

            champ.championName = this.data[i].championName

            if (champ.championName == 'FiddleSticks') {
               champ.image = `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/Fiddlesticks.png`
            } else {
               champ.image = `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champ.championName}.png`
            }

            this.championBook.push(champ)
         }
      }
      this.championBook.sort((a, b) => a.championName.localeCompare(b.championName))
   },

   methods: {
      championSearch() {
         if (this.championFilter != '') {
            this.championFilter = ''
         }
         this.champSearchFocus = true
      },

      selectChampion(champion) {
         this.championFocus = champion
         this.championFilter = champion
         this.champSearchFocus = false

         this.$emit('championFocus', champion)
      },
   },

   computed: {
      champSearchList() {
         return this.championBook.filter(champ => {
            if (champ.trueChampionName) {
               return champ.trueChampionName.toLowerCase().includes(this.championFilter.toLowerCase())
            } else {
               return champ.championName.toLowerCase().includes(this.championFilter.toLowerCase())
            }
         })
      },
   }, 

   props: {
      data: null
   }
}
</script>

<template>
   <div class="champion-search">
      <input type="text" placeholder="Search champion..." v-model="championFilter" @click="championSearch"
         @keyup.esc="champSearchFocus = false">
      <div class="champion-search-list" v-show="champSearchFocus">
         <div class="champion-search-select" v-for="champ in champSearchList" :key="champ.championName"
            @click="selectChampion(champ.trueChampionName || champ.championName)">
            <img :src="champ.image" alt="">
            {{ champ.trueChampionName || champ.championName }}
         </div>
      </div>
      <div class="outside-search" v-show="champSearchFocus" @click="champSearchFocus = false"></div>
   </div>
</template>

<style scoped>
.champion-search {
      width: 100%;
   }
   .champion-search input {
      /* background: var(--champion-search-bar); */
      background: var(--champion-search-bar);
      color: var(--color-font);
      margin: 8px 8px 0 8px;
      padding: 0.5rem 0.8rem;
      border: none;
      /* border-radius: 10px 10px 0 0; */
      border-radius: 5px;
      width: calc(100% - 16px);
      /* width: calc(100% - 1.0rem); */
      box-sizing: border-box;
      /* width: calc(100% - 30px); */
   }

   .champion-search input:focus {
      outline: none;
      background: var(--champion-search-bar-focus);
      /* background: var(--blue600s); */
   }

   .champion-search-select {
      /* padding-bottom: 5px; */
      display: flex;
      gap: 10px;
      align-items: center;
      padding: 5px 10px;
      /* width: 180px; */
      width: 200px;
      font-size: 0.9rem;
   }

   .champion-search-select img {
      width: 30px;
   }

   .champion-search-list {
      position: absolute;
      /* margin-top: 2px; */
      margin-left: 8px;
      z-index: 2;
      background: var(--champion-filter-list);
      color: var(--color-font);
      height: 150px;
      overflow-y: scroll;
   }

   .champion-search-select:hover {
      background: var(--champion-filter-list-hover);
   }

   .champion-search-list::-webkit-scrollbar-track {
      background-color: var(--champion-filter-scroll-track);
   }

   .champion-search-list::-webkit-scrollbar {
      width: 15px;
   }

   .champion-search-list::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background-color: var(--scroll-thumb);
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