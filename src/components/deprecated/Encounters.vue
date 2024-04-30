<script>
export default {
   data() {
      return {
         tab: 0,
         populate: false,
         friendlies: [],
         enemies: []
      }
   },

   created() {
      this.populateSummoners()
   },

   methods: {
      populateSummoners() {
         let friends = []
         let enemies = []

         for (const champion of this.championData) {
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
         const algo = (arr, n) => {
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
            
            if (n) {
               this.friendlies = burger
            } else {
               this.enemies = burger
            }
         }
         algo(friends, 1)
         algo(enemies, 0)
      },

      winrate(wins, total) {
         return `${Math.round((wins / total) * 1000) / 10}%`
      }
   },

   computed: {
      summonersCompute() {
         // return this.summoners.sort((a, b) => b.encounters - a.encounters).slice(0, 100)
         return this.friendlies.sort((a, b) => b.encounters - a.encounters)
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
         <div @click="this.tab = 0" :class="{ 'active': !this.tab }"> 
            Friendly
         </div>
         <div @click="this.tab = 1" :class="{ 'active': this.tab }">
            Enemy
         </div>
      </div>
      <div class="description">
         {{ (this.tab) ? `People you've played against` : `People you've played with` }}
      </div>
      <div class="headers">
         <div style="margin-left: 40px;">Summoner</div>
         <div class="rhs-headers">
            <div>WR</div>
            <div style="width: 60px;">Wins</div>
         </div>
      </div>
      <div class="encounters" v-show="this.tab === 0">
         <div class="table">
            <div class="row" :class="i % 2 == 0 ? `alt` : ``" v-for="(summoner, i) in this.friendlies">
               <div class="name">{{ summoner[0] }}</div>
               <div class="ratio">
                  {{ this.winrate(summoner[1][1], summoner[1][0]) }}
                  <div class="ratio-sub">
                     {{ summoner[1][1] }}/{{ summoner[1][0] }}
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="encounters" v-show="this.tab === 1">
         <div class="table">
            <div class="row" :class="i % 2 == 0 ? `alt` : ``" v-for="(summoner, i) in this.enemies">
               <div class="name">{{ summoner[0] }}</div>
               <div class="ratio">
                  {{ this.winrate(summoner[1][1], summoner[1][0]) }}
                  <div class="ratio-sub">
                     {{ summoner[1][1] }}/{{ summoner[1][0] }}
                  </div>
               </div>
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
   margin-top: 10px;
   align-items: center;
   height: 35px;
}

.pancakes-tabs > div {
   cursor: pointer;
   padding: 0.25rem 1rem;
   border-radius: 8px;
   transition: 0.2s;
   -webkit-touch-callout: none; /* iOS Safari */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Old versions of Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none;
}
.pancakes-tabs > div:hover {
   background: var(--alpha-06);
   cursor: pointer;
}

.active {
   color: var(--color-font-focus);
   background: var(--alpha-06);
}

.pancakes-main {
   display: flex;
   flex-direction: column;
   background: var(--cell-panel);
   border-radius: 15px;
   overflow: hidden;
   /* Hello future ryan, pls make it so height of lhs and rhs are identical by having them fit to user-ready-main property */
   height: 430px; 
}

.description {
   text-align: center;
   margin: 10px 0;
   font-size: 0.8rem;
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
   /* line-height: 1.25; */
   height: 97%;
}

.alt {
   background: var(--alpha-00);
}

.headers {
   display: flex;
   justify-content: space-between;
   width: calc(100% - 8px);
   padding: 0.25rem 0;
   font-size: 0.8rem;
   color: var(--color-font);
   font-weight: 500;
}

.rhs-headers {
   display: flex;
   justify-content: space-between;
   width: 120px;
   margin-right: 30px;
}

.table {
   margin-top: 5px;
   overflow-y: scroll;
   height: 320px;
}

.encounters .row {
   display: flex;
   justify-content: space-between;
   width: 100%;
   padding: 5px 0;
}

.name {
   margin-left: 40px;
}
.ratio {
   display: flex;
   justify-content: space-between;
   line-height: 1rem;
   width: 120px;
   margin-right: 30px;
   align-items: center;
}
.ratio-sub {
   display: inline-block;
   text-align: left;
   font-size: .75rem;
   width: 60px;
   color: var(--color-font-faded);
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