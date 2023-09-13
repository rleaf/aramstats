<script>
/* 
   Temporarily called pancakes while I think of a better name.

   Component houses two tabs. One tab is for a match history, similar to waht you'd
   see on op.gg and the other tab displays summoner frequency. See if there are any
   familiar faces.
*/
import axios from 'axios'


export default {
   data() {
      return {
         tab: 0,
         summoners: [],
         populate: false,
         test: []
      }
   },

   created() {
      // Populate array of all encountered summoners 
      let j = []
      for (const champion of this.championData) {
         for (const match of champion.matches) {
            j.push(match.summonerEncounters)
         }
      }
      j = j.flat().sort()
      console.log(j)

      // Count redundant summoner names
      let counter = j.reduce((o, c) => {
         o[c] = 1 + o[c] || 1
         return o
      }, {})

      // First filter for summoners encountered gt 5, then sort by frequency
      this.test = Object.entries(counter).filter(x => x[1] > 5).sort((a, b) => b[1] - a[1])
      // console.log(counter, ' count')
      console.log(this.test, ' test')
   },

   mounted() {      
      // console.log(this.championData)
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
               why: fastest growing metric, but operates in <1000 matches domain
            summoner: bounded
               what: number of players in game excluding yourself.
               why: will always be 9. 5 players on enemy team, 4 bots on mine.
         */

         this.populate = true

         // for (const summoner of this.test) {
         //    if (!this.summoners.some(e => e.name === summoner.name)) {
         //       // Summ DNE, push to this.summoners
         //       let s = {
         //          name: summoner.name,
         //          encounters: 1,
         //          win: 0,
         //       }
         //       // if (match.win) s.win++
         //       this.summoners.push(s)
         //    } else {
         //       let s = this.summoners.find(e => e.name === summoner.name)
         //       s.encounters++
         //       // if (match.win) s.win++
         //    }
         // }  
      }
   },

   computed: {
      summonersCompute() {
         // return this.summoners.sort((a, b) => b.encounters - a.encounters).slice(0, 100)
         return this.summoners.sort((a, b) => b.encounters - a.encounters).filter(e => e.encounters > 5)
      }
   },

   props: {
      championData: null
   }
}
</script>

<template>
   <div class="pancakes-main">
      <div class="pancakes-tabs">
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
      </div>
      <div class="encounters" v-show="this.tab === 1">
         <!-- <div class="load-encounters" v-if="!this.populate">
            <p>
               Iterate through matches and show summoners you've encountered >5 times. This is...experimental. Loading will take a couple
               of seconds.
            </p>
            <button :disabled="this.populate" @click="this.populateSummoners()">
               Load
            </button>
         </div>
         <div class="headers" v-if="this.populate">
            <div>Summoner</div>
            <div>Games</div>
         </div>
         <div class="table" v-if="this.populate"> -->
         <div class="headers">
            <div>Summoner</div>
            <div>Games</div>
         </div>
         <div class="table">
            <!-- <div class="row" :class="i % 2 == 0 ? `alt` : ``" v-for="(summoner, i) in summonersCompute">
               <div>{{ summoner.name }}</div>
               <div>{{ summoner.encounters }}</div>
            </div> -->
            <div class="row" :class="i % 2 == 0 ? `alt` : ``" v-for="(summoner, i) in this.test">
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
   color: var(--light900);
   justify-content: space-evenly;
   align-items: center;
   height: 35px;
   /* gap: 20px; */
   /* padding-bottom: 1rem; */
   /* border-bottom: 1px solid white; */
}

.pancakes-tabs > div {
   cursor: pointer;
   padding: 0.25rem 1rem;
   border-radius: 8px;
}

.active {
   color: var(--color-font);
   background: var(--hoverButton);
}

.load-encounters p {
   text-align: center;
   line-height: 1.5;
   padding: 0 2rem;
   margin-bottom: 1rem;
}

.encounters button {
   display: block;
   margin: 0 auto;
   border: 1px solid var(--color-font);
   border-radius: 8px;
   padding: 0.5rem 1rem;
   color: var(--color-font);
   background: none;
   cursor: pointer;
}

.pancakes-main {
   display: flex;
   flex-direction: column;
   background: var(--tint100);
   border-radius: 15px;
   /* overflow: hidden; */
   /* Make it so height of lhs and rhs are identical by having them fit to user-ready-main property */
   height: 430px; 
}

.history, .encounters {
   width: 100%;
   margin-top: 10px;
}

.history {
   text-align: center;
}

.encounters {
   width: inherit;
   font-size: 0.8rem;
   line-height: 1.25;
   height: 90%;
}

.alt {
   background: var(--runeMythic);
}

.encounters .headers {
   display: flex;
   justify-content: space-evenly;
   width: calc(100% - 8px);
   padding: 0.25rem 0;
   /* border-bottom: 1px solid var(--color-font); */
}

.table {
   overflow-y: scroll;
   height: inherit;
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
   background: var(--hoverButton);
   border-radius: 3px;
}

.table::-webkit-scrollbar-thumb {
   background-color: var(--hoverButton);
   border-radius: 3px;
}
.table::-webkit-scrollbar-thumb:hover {
   background-color: var(--light900);
}
</style>