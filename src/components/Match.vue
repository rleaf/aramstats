<script>
import MatchInfo from './MatchInfo.vue'

export default {
   components: {
      MatchInfo
   },

   data() {
      return {
         gamePlayed: Number,
         daysSince: Number,
         gameDuration: Number,
         date: null,
         kda: `${this.match.k}/${this.match.d}/${this.match.a}`,
         // primaryRune: this.match.primaryRune,
         // secondaryTree: this.match.secondaryTree,
         items: [[], []],
         matchInfo: false,
      }
   },

   created() {
      this.timeSet()

      this.itemImages()
      // const url = `http://ddragon.leagueoflegends.com/cdn/12.23.1/data/en_US/runesReforged.json`
      // axios.get(url)
      //    .then((res) => {
      //       console.log(res)
      //    })
      // console.log(this.match)
   },

   // watch: {
   //    currentPatch(curr, _) {
   //       /* 
   //          Component loads faster than async getCurrentPatch() responds on UserReady,
   //          so only fire when this.currentPatch not falsey
   //       */
   //       if (curr) this.itemImages()
   //    }
   // },

   props: {
      match: Object,
      currentPatch: ''
   },

   methods: {
      timeSet() {
         this.date = new Date(this.match.gc)
         const now = Date.now()
         const diffTime = Math.abs(this.date - now)
         this.daysSince = Math.round(diffTime / (1000 * 60 * 60 * 24))
         this.date = this.date.toLocaleString().split(/[ ,]+/)[0]
      },

      itemImages() {
         for (let i = 0; i < 6; i++) {
            if (this.match.i) {
               if (this.match.i[i] != 0) {
                  let x = `https://ddragon.leagueoflegends.com/cdn/${this.currentPatch}/img/item/${this.match.i[i]}.png`
                  if (i < 3) {
                     this.items[0].push(x)
                  } else {
                     this.items[1].push(x)
                  }
               }
            }
         }
      },

      matchDetail() {
         // console.log('soon.tm')
         this.matchInfo =! this.matchInfo
      },

      perMinute(unit) {
         return Math.round(unit / this.match.gd)
      }
   },

   computed: {
      primary() {
         return new URL(`../assets/runes/${this.match.pr}.png`, import.meta.url).href
      },
      secondary() {
         return new URL(`../assets/runes/${this.match.sr}.png`, import.meta.url).href
      },
      damageShare() {
         return Math.round(this.match.ds * 100)
      },
      killParticipation() {
         // return `${this.match.killParticipation}`
         return Math.round(this.match.kp * 100)
      },
      rotateArrow() {
         return (this.matchInfo) ? 'transform: rotate(180deg);' : ''
      }

   },

}
</script>

<template>
   <div class="match-container" :class="(this.match.w) ? 'win' : 'loss'">
      <div class="match-left">
         <button @click="matchDetail">
            <img src="../assets/svg/arrow3.svg" alt="" :style="rotateArrow"/>
         </button>
         <div class="match-date">
            <span class="date-minor">{{ this.daysSince }} days ago</span>
            <span>{{ this.match.gd }} min</span>
            <span class="date-minor">{{ this.date }}</span>
         </div>
         <div class="match-runes">
            <img class="primary" :src="primary" alt="">
            <img class="secondary" :src="secondary" alt="">
         </div>
         <div class="match-kda">
            <!-- <span class="match-minor">KDA</span> -->
            <span class="kda">{{ this.kda }}</span>
            {{ killParticipation || 0 }}% <span class="unit">KP</span>
         </div>
         <div class="match-items">
            <img v-for="(item, i) in this.items[0]"
               :key="i"
               :src="item"/>
               <br>
            <img v-for="(item, i) in this.items[1]"
               :key="i"
               :src="item"/>
         </div>
      </div>
      <div class="match-right">
         <div class="multikills">
            <span class="triple">{{ this.match.mk.t }}</span>
            <span class="quadra">{{ this.match.mk.q }}</span>
            <span class="penta">{{ this.match.mk.p }}</span>
         </div>
         <div class="damage">
            <h5>Damage</h5>
            {{ this.match.t.dtc }}, {{ damageShare }}% <span class="unit">DS</span>
            <div class="per-minute">
               {{ perMinute(this.match.t.dtc) }} / m
            </div>
         </div>
         <div class="healing">
            <h5>Healing</h5>
            {{ this.match.t.h }}
            <div class="per-minute">
               {{ perMinute(this.match.t.h) }} / m
            </div>
         </div>
         <div class="ally">
            <h5>Ally Heals</h5>
            {{ this.match.t.ah }}
            <div class="per-minute">
               {{ perMinute(this.match.t.ah) }} / m
            </div>
         </div>
         <div class="taken">
            <h5>Taken</h5>
            {{ this.match.t.dt }}
            <div class="per-minute">
               {{ perMinute(this.match.t.dt) }} / m
            </div>
         </div>
         <div class="mitigated">
            <h5>Mitigated</h5>
            {{ this.match.t.sm }}
            <div class="per-minute">
               {{ perMinute(this.match.t.sm) }} / m
            </div>
         </div>
         <div class="gold">
            <h5>Gold</h5>
            {{ this.match.t.g }}
            <div class="per-minute">
               {{ perMinute(this.match.t.g) }} / m
            </div>
         </div>
      </div>
   </div>
   <MatchInfo v-if="this.matchInfo" :matchId="this.match.mId" :currentPatch="this.currentPatch"/>
</template>

<style scoped>
@import url('../assets/stats.css');

.match-container {
   display: flex;
   width: 745px;
   height: 65px;
   background: var(--cell-panel);
   margin-bottom: 10px;
   margin-left: auto;
   border-radius: 15px;
   font-size: 0.8rem;
   align-items: center;
}

.win {
   background: linear-gradient(to right, var(--win) 0%, var(--cell-panel));
}

.loss {
   background: linear-gradient(to right, var(--loss) 0%, var(--cell-panel));
}

.match-left {
   display: flex;
   height: inherit;
   align-items: center;
   justify-content: space-between;
   width: 500px;
}

.match-right {
   align-items: center;
   height: inherit;
   width: 100%;
   padding-right: 10px;
   justify-content: space-evenly;
   font-size: 0.9rem;
}

.match-left button {
   background: none;
   border: none;
   height: 100%;
   transition: 0.25s;
   cursor: pointer;
   border-radius: 15px 0 0 15px;
}

.match-left button:hover {
   background: var(--alpha-05);
}

.match-date {
   display: flex;
   flex-direction: column;
}

.match-right {
   display: flex;
   align-items: center;
}

.date-minor {
   color: var(--color-font-faded);
   font-size: 0.7rem;
}

.match-runes {
   text-align: center;
}

.primary {
   width: 28px;
   filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 1));
}

.secondary {
   margin-left: -17px;
   margin-bottom: -5px;
   filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 1)) saturate(1.25);
   border-radius: 15px;
   padding: 2px;
   width: 17px;
}


.kda {
   display: block;
   font-size: 1rem;
   margin-bottom: 2px;
}

.unit {
   font-size: 0.75rem;
   color: var(--color-font-faded);
}

.match-items {
   min-width: 75px;
}

.match-items img {

   width: 23px;
   padding-left: 2px;
   border-radius: 3px;
}

.multikills {
   display: flex;
   gap: 2px;
   flex-direction: column;
   justify-content: center;
}

.multikills span {
   background-repeat: no-repeat;
   background-position: center;
   background-size: 60%;
   text-align: center;
   width: 30px;
}

.triple {
   background-image: url('../assets/svg/triple_small.svg')      
}

.quadra {
   background-image: url('../assets/svg/diamond_small.svg')
}

.penta {
   background-image: url('../assets/svg/penta_small.svg')
}

h5 {
   margin: 0;
   color: var(--color-font-faded);
   font-weight: normal;
   font-size: 0.75rem;
}

.per-minute {
   color: var(--color-font-faded);
   font-size: 0.75rem;
}
</style>