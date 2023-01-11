<script>
import Histogram from './Histogram.vue'
import ChampSearch from './ChampSearch.vue'

export default {
   components: {
      Histogram,
      ChampSearch
   },
   data() {
      return {
         championFilter: null,
      }
   },
   watch: {
      championFilter() {
         this.getChampionIndex()
      }
   },

   methods: {
      getChampionIndex() {
         return this.data.findIndex((e) => {
            if (e.trueChampionName) {
               return e.trueChampionName == this.championFilter
            } else {
               return e.championName == this.championFilter
            }
         })
      }
   },
   props: {
      data: null
   }
}
</script>

<template>
   <ChampSearch :data="this.data" @championFocus="champion => championFilter = champion" />
   <div class="offensive-main">
      <div class="offensive-left">
         <div class="stats-a">
            <div>
               Total Games: {{ 'starthere' }}
            </div>
            <div>
               Wins: 
            </div>
         </div>
         <Histogram :data="this.data" :championIndex="this.getChampionIndex()"/>
         <!-- <Histogram :data="this.data" :championFilter="this.championFilter"/> -->
         <!-- <hr class="vert"> -->
      </div>

   </div>
</template>

<style scoped>
.stats-a {
   display: flex;
   padding-top: 20px;
   justify-content: center;
   gap: 20px;
   text-align: center;
   color: var(--color-font);

}
.offensive-left {
   /* border-right: 1px solid white; */
   padding-left: 10px;
   /* height: 87%; */
   }
.vert {
   display: inline-block;
   width: 0.1em;
   height: 100%;
   background: var(--color-font);
}
.offensive-main {
   display: flex;
   flex-direction: row;
}
</style>