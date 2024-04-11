<script>
// import...

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
      cleanedGameVersion() {
         return this.data.gv.split('.').slice(0, 2).join('.') + '.1'
      },

      kda() {
         return `${this.data.k}/${this.data.d}/${this.data.a}`
      },

      damage() {
         return this.data.d
      },

      taken() {

      },

      mitigated() {

      },

      healed() {

      },

      allyHealing() {

      },

      gold() {

      }
   },

   props: {
      data: null
   }
}
</script>

<template>
   <div class="match-main">
      <span>
         <hr>
      </span>
      <div class="match-details" :class="(this.data.w ? 'win' : 'loss')">
         <div class="time">
            <div class="date">
               {{ this.date }}
            </div>
            <div class="delta">
               {{ this.daysSince }} days ago
            </div>
         </div>
         <div class="items">
            <div v-for="item in this.data.i"> 
               <img :src="`https://ddragon.leagueoflegends.com/cdn/${cleanedGameVersion}/img/item/${item}.png`" alt="">
            </div>
            <!-- <img v-for="item in this.data.i" :src="`https://ddragon.leagueoflegends.com/cdn/${cleanedGameVersion}/img/item/${item}.png`" alt=""> -->
         </div>
         <div class="match-rhs">
            <div> <!-------- KDA ----------->
               {{ kda }}
            </div>
            <div> <!-------- KP ------------>
               {{ this.data.kp * 100 }}%
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
      gap: 16px;
      /* min-height: 39px; */
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
      padding: 0 10px;
      width: 68px;
      font-size: 0.7rem;
   }

   .time .delta {
      color: var(--color-font-faded);
   }

   .items {
      display: flex;
      height: 22px;
      min-width: 144px;
      padding-right: 24px;
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
      /* width: 100%; */
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