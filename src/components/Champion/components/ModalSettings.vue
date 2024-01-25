<script>
import { championStore } from '@/stores/championConfig'

export default {
   data() {
      return {
         config: championStore(),
      }
   },

   props: {
      title: null,
   }
}
</script>

<template>
   <div class="modal-main">
      <div class="modal">
         <div class="head">
            <h1>{{ this.title }}</h1>
            The "Tldr" section provides a synopsis, by winrate or popularity, of games with the selected core build.
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Local Storage</h2>
               <svg @click="this.config.localStorage = !this.config.localStorage" fill="none">
                  <rect x="0.5" y="0.5" rx="13"/>
                  <circle :class="{ 'storage-active': this.config.localStorage }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg>
            </div>
            <p>
               Save settings to local storage? Data auto-purges when toggled off.
            </p>
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Combinations over permutations?</h2>
               <svg @click="this.config.localStorage = !this.config.localStorage" fill="none">
                  <rect x="0.5" y="0.5" rx="13"/>
                  <circle :class="{ 'storage-active': this.config.localStorage }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg>
            </div>
            <p>
               View core builds as combinations to consolidate data. This may slow down performance.
            </p>
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Boots</h2>
               <svg @click="this.config.localStorage = !this.config.localStorage" fill="none">
                  <rect x="0.5" y="0.5" rx="13"/>
                  <circle :class="{ 'storage-active': this.config.localStorage }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg>
            </div>
            <p>
               hmm?
            </p>
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Sort by winrate</h2>
               <svg @click="this.config.localStorage = !this.config.localStorage" fill="none">
                  <rect x="0.5" y="0.5" rx="13"/>
                  <circle :class="{ 'storage-active': this.config.localStorage }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg>
            </div>
            <p>
               Data defaults to showing by popularity. Instead, sort information by highest winrate.
            </p>
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Winrate threshold</h2>
               <svg @click="this.config.localStorage = !this.config.localStorage" fill="none">
                  <rect x="0.5" y="0.5" rx="13"/>
                  <circle :class="{ 'storage-active': this.config.localStorage }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg>
            </div>
            <p>
               Set the lower bound of observed data when viewing by winrate. This is to preclude games with too little sample size from biasing data.
            </p>
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>View More Items</h2>
               <svg @click="this.config.localStorage = !this.config.localStorage" fill="none">
                  <rect x="0.5" y="0.5" rx="13"/>
                  <circle :class="{ 'storage-active': this.config.localStorage }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg>
            </div>
            <p>
               Show 3, instead of 2, items per slot in Items.
            </p>
         </div>
      </div>
      <div class="modal-back" @click ="this.config.modals.tldr = false" />
   </div>
</template>

<style scoped>

   h1 {
      font-family: 'Thestral';
      color: var(--color-font);
      font-size: 1.5rem;
      margin: 0;
      padding-bottom: 0.5rem;
   }

   .setting {
      padding-top: 2rem;
      /* border-bottom: 1px solid var(--cell-border); */
   }

   .setting-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 3px;
   }

   h2 {
      font-weight: normal;
      color: var(--color-font);
      font-size: 0.9rem;
      margin: 0;
      display: inline-block;
   }
   svg {
      width: 50px;
      height: 26px;
      overflow: hidden;
      cursor: pointer;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
   }

   rect {
      width: calc(100% - 1px);
      height: calc(100% - 1px);
      /* height: 100%; */
      stroke: var(--light-10);
      /* stroke-width: 2; */
   }

   circle {
      fill: var(--alpha-07);
      height: calc(100% - 8px);
      transition: 0.2s cubic-bezier(.25,.52,.64,.84);
   }
   circle.storage-active {
      transform: translateX(50%);
      fill: var(--light-01); 
   }
   p {
      margin: 0;
      width: 380px;
   }
   .modal {
      position: absolute;
      left: 0;
      right: 0;
      width: 500px;
      /* height: 300px; */
      margin: 0 auto;
      margin-top: 15vh;
      padding: 30px;
      font-size: 0.8rem;
      color: var(--color-font-faded);
      border-radius: 8px;
      background: var(--cell-panel);
      z-index: 2;
   }
   .modal-back {
      position: absolute;
      background-color: var(--black-alpha-9);
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
   }
   .modal-main {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
   }
</style>