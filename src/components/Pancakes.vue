<script>
// Temporarily called pancakes while I think of a better name.
export default {
   data() {
      return {
         tab: 1,
         populate: false,
         summoners: []
      }
   },

   created() {
      this.populateSummoners()
   },

   methods: {
      counter() {

      },
      
      populateSummoners() {
         /* 
         Algorithmically concerning, probably okay. Do this in aggregation?
            champion: unbounded
               what: amount of champions in League of Legends.
               why: is okay because champ release is slow. (~164 on naafiri)
            match: unbounded
               what: number the num of games a summ has played on that champ.
               why: fastesst growing metric, but operates in <1000 matches domain
            summoner: bounded
               what: number of players in game excluding yourself.
               why: will always be 9. 5 players on enemy team, 4 bots on mine.
         */
         let j = []
         
         for (const champion of this.championData) {
            for (const match of champion.matches) {
               j.push(match.summonerEncounters)
            }
         }
         j = j.flat().sort()
         
         /* 
         ALGO 1
         ---
         0.8ms-2.5ms. Generally <1ms. on ryi
         8-15ms on Night Owl (760x faster than one below)
         ---
         */
         // Count redundant summoner names
         let counter = j.reduce((o, c) => {
            o[c] = 1 + o[c] || 1
            return o
         }, {})

         // First filter for summoners encountered gt 5, then sort by frequency
         this.summoners = Object.entries(counter).filter(x => x[1] > 5).sort((a, b) => b[1] - a[1])


         /*
         ALGO 2
         ---
         7999-9500 ms on Night Owl
         ---
         */
         // for (const summoner of j) {
         //    if (!this.summoners.some(e => e[0] === summoner)) {
         //       // Summ DNE, push to this.summoners
         //       let s = [summoner, 1]
         //       this.summoners.push(s)
         //    } else {
         //       let s = this.summoners.find(e => e[0] === summoner)
         //       s[1]++
         //    }
         // }
         // this.summoners = this.summoners.filter(x => x[1] > 5).sort((a, b) => b[1] - a[1])
      }
   },

   computed: {
      summonersCompute() {
         // return this.summoners.sort((a, b) => b.encounters - a.encounters).slice(0, 100)
         return this.summoners.sort((a, b) => b.encounters - a.encounters)
      }
   },

   props: {
      championData: null
   }
}
</script>

<template>
   <div class="pancakes-main">
      <!-- <div class="pancakes-tabs">
         <div class="history-tab"
         @click="this.tab = 0"
         :class="{ active: !this.tab }">
            History
         </div>
         <div class="encounters-tab"
         @click="this.tab = 1"
         :class="{ active: this.tab }">
            Encounters
         </div>
      </div>
      <div class="history" v-show="this.tab === 0">
         pancakes
      </div> -->
      <div class="encounters" v-show="this.tab === 1">
         <div class="description">
            People you've encountered >5 times.
         </div>
         <div class="headers">
            <div>Summoner</div>
            <div>Games</div>
         </div>
         <div class="table">
            <div class="row" :class="i % 2 == 0 ? `alt` : ``" v-for="(summoner, i) in this.summoners">
               <div>{{ summoner[0] }}</div>
               <div>{{ summoner[1] }}</div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>

.pancakes-tabs {
   display: flex;
   flex-direction: row;
   font-size: 0.9rem;
   color: var(--color-font-faded);
   justify-content: space-evenly;
   align-items: center;
   height: 35px;
}

.pancakes-tabs > div {
   cursor: pointer;
   padding: 0.25rem 1rem;
   border-radius: 8px;
}

.active {
   color: var(--color-font);
   background: var(--alpha-06);
}

.pancakes-main {
   display: flex;
   flex-direction: column;
   background: var(--cell-panel);
   border-radius: 15px;
   /* Hello future ryan, pls make it so height of lhs and rhs are identical by having them fit to user-ready-main property */
   height: 430px; 
}

.description {
   text-align: center;
   margin: 10px 0;
   font-style: italic;
   color: var(--color-font-faded);
}

.history, .encounters {
   width: 100%;
}

.history {
   text-align: center;
}

.encounters {
   width: inherit;
   display: flex;
   flex-direction: column;
   font-size: 0.8rem;
   line-height: 1.25;
   height: 97%;
}

.alt {
   background: var(--alpha-00);
}

.encounters .headers {
   display: flex;
   justify-content: space-evenly;
   width: calc(100% - 8px);
   padding: 0.25rem 0;
   font-weight: 600;
}

.table {
   overflow-y: scroll;
}

.encounters .row {
   display: flex;
   justify-content: space-evenly;
   width: 100%;
   padding: 5px 0;
}

.row div:first-child, .headers div:first-child {
   flex: 0 0 150px;
}
.row div:nth-child(2), .headers div:nth-child(2) {
   flex: 0 0 70px;
}

.table::-webkit-scrollbar {
   width: 8px;
   background: var(--alpha-01);
   border-radius: 3px;
}

.table::-webkit-scrollbar-thumb {
   background-color: var(--alpha-06);
   border-radius: 3px;
}
.table::-webkit-scrollbar-thumb:hover {
   background-color: var(--light-12);
}
</style>