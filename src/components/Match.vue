<script>

export default {
   data() {
      return {
         datum: null,
         date: Number,       
         daysSince: Number,
      }
   },

   mounted() {
      this.computeTime()
   },

   methods: {
      computeTime() {
         this.date = new Date(this.data.gc)
         const now = Date.now()
         const diffTime = Math.abs(this.date - now)
         this.daysSince = Math.round(diffTime / (1000 * 60 * 60 * 24))
         this.date = this.date.toLocaleString().split(/[ ,]+/)[0]
      },

      perMinute(v) {
         return Math.round(v / this.data.gd)
      }
   },

   computed: {
      gameDuration() {
         if (Number.isInteger(this.data.gd)) {
            return `${this.data.gd}m`
         } else {
            let x = this.data.gd.toString().split('.')
            x[1] = Math.floor((+`.${x[1]}` * 60))
            return `${x[0]}m ${x[1]}s`
         }
      },

      getPrimaryRune() {
         return new URL(`../assets/runes/${this.data.pr}.png`, import.meta.url).href
      },

      getSecondaryRune() {
         return new URL(`../assets/runes/${this.data.sr}.png`, import.meta.url).href
      }

   },

   props: {
      data: null,
      patch: null,
      newPatch: false,
   }
}
</script>

<template>
   <div class="match-main">
      <span v-if="this.newPatch">
         <p class="patch-change">
            {{ this.data.gv.split('.').slice(0, 2).join('.') }}
         </p>
      </span>
      <span v-else>
         <hr>
      </span>
      <div class="match-details" :class="(this.data.w ? 'win' : 'loss')">
         <div class="time">
            <div class="date">
               {{ this.date }}
            </div>
            <div class="delta">
               {{ this.gameDuration }}
            </div>
         </div>
         <div class="runes">
            <img :src="getPrimaryRune" alt="">
            <img :src="getSecondaryRune" alt="">
         </div>
         <div class="items">
            <div v-for="item in this.data.i"> 
               <img :src="`https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${item}.png`" alt="">
            </div>
         </div>
         <div class="match-rhs">
            <div> <!-------- KDA ----------->
               {{ `${this.data.k}/${this.data.d}/${this.data.a}` }}
            </div>
            <div> <!-------- KP ------------>
               {{ Math.round(this.data.kp * 100) }}%
            </div>
            <div> <!-------- Damage -------->
               {{ this.data.t.dtc }}
               <span class="sub">
                  {{ this.perMinute(this.data.t.dtc) }}
               </span>
            </div>
            <div> <!-------- Taken --------->
               {{ this.data.t.dt }}
               <span class="sub">
                  {{ this.perMinute(this.data.t.dt) }}
               </span>
            </div>
            <div> <!-------- Mitigated ----->
               {{ this.data.t.sm }}
               <span class="sub">
                  {{ this.perMinute(this.data.t.sm) }}
               </span>
            </div>
            <div> <!-------- Healed -------->
               {{ this.data.t.h }}
               <span class="sub">
                  {{ this.perMinute(this.data.t.h) }}
               </span>
            </div>
            <div> <!-------- Ally Healing -->
               {{ this.data.t.ah }}
               <span class="sub">
                  {{ this.perMinute(this.data.t.ah) }}
               </span>
            </div>
            <div> <!-------- Gold ---------->
               {{ this.data.t.g }}
               <span class="sub">
                  {{ this.perMinute(this.data.t.g) }}
               </span>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
   .match-main {
      display: flex;
      align-items: center;
      gap: 16px;
   }

   .match-main > span {
      width: 13px;
   }

   .patch-change {
      transform: rotate(-40deg);
      transform-origin: 100% 50%;
      font-size: 0.7rem;
      color: var(--color-font-faded);
      margin: 0;
   }

   hr {
      min-height: 39px;
      width: 1px;
      border: none;
      background-color: var(--cell-border);
      margin: 0;
      margin-left: 12px;
   }

   .match-details {
      display: flex;
      margin-bottom: 2px;
      min-height: 37px;
      align-items: center;
      width: 100%;
      font-size: 0.75rem;
      border-radius: 3px;
      background: linear-gradient(to right, rgba(var(--cell-panel-rgb), 1.0), rgba(var(--cell-panel-rgb), 0.9) 10%, rgba(var(--cell-panel-rgb), .8) 60%, rgba(var(--cell-panel-rgb), .7) 90%);
   }

   .win {
      background: linear-gradient(to right, var(--win) 0%, transparent);
   }
   
   .loss {
      background: linear-gradient(to right, var(--loss) 0%, transparent);
   }

   .time {
      /* padding: 0 10px; */
      padding-left: 10px;
      width: 55px;
      font-size: 0.7rem;
   }

   .runes {
      /* padding: 0 5px; */
      width: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      align-items: flex-end;
   }

   .runes img:first-child {
      width: 21px;
      filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8));
   }

   .runes img:last-child {
      margin-left: -10px;
      filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 1)) saturate(1.5);
      width: 13px;
   }

   .time .delta {
      color: var(--color-font-faded);
   }

   .items {
      display: flex;
      height: 22px;
      min-width: 144px;
      padding-right: 15px;
   }

   .items div {
      width: 22px;
      height: 22px;
      background: var(--alpha-05);
      margin-left: 2px;
      border-radius: 3px;
      overflow: hidden;
   }

   .items img {
      width: 22px;
   }

   .match-rhs {
      display: flex;
      align-items: center;
      gap: 5px;
      justify-content: flex-end;
   }

   .match-rhs div span {
      display: block;
      font-size: 0.7rem;
      font-style: italic ;
      color: var(--color-font-faded);
   }

   .match-rhs div:nth-child(1) {
      width: 65px; /* KDA */
   }

   .match-rhs div:nth-child(2) {
      width: 40px; /* KP */
   }

   .match-rhs div:nth-child(3) {
      width: 70px; /* Damage */
   }

   .match-rhs div:nth-child(4) {
      width: 60px; /* Taken */
   }

   .match-rhs div:nth-child(5) {
      width: 70px; /* Mitigated */
   }

   .match-rhs div:nth-child(6) {
      width: 55px; /* Healed */
   }

   .match-rhs div:nth-child(7) {
      width: 75px; /* Ally Healing */
   }

   .match-rhs div:nth-child(8) {
      margin-left: 5px;
      width: 40px; /* Gold */
   }
</style>