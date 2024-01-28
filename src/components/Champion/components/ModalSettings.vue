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
               <h2>Sort by winrate</h2>
               <svg @click="this.config.winrateSort = !this.config.winrateSort" fill="none">
                  <rect x="0.5" y="0.5" rx="13"/>
                  <circle :class="{ 'storage-active': this.config.winrateSort }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg>
            </div>
            <p>
               Data defaults to showing by popularity. Instead, sort information by highest winrate.
            </p>
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Winrate threshold</h2>
               <div class="options">
                  <div :class="{ 'active-option': this.config.winrateThreshold == 0.05 }" @click="this.config.winrateThreshold = 0.05">5%</div>
                  <div :class="{ 'active-option': this.config.winrateThreshold == 0.08 }" @click="this.config.winrateThreshold = 0.08">8%</div>
                  <div :class="{ 'active-option': this.config.winrateThreshold == 0.1 }" @click="this.config.winrateThreshold = 0.1">10%</div>
               </div>
               <!-- <svg @click="this.config.localStorage = !this.config.localStorage" fill="none">
                  <rect x="0.5" y="0.5" rx="13"/>
                  <circle :class="{ 'storage-active': this.config.localStorage }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg> -->
            </div>
            <p>
               Set the lower bound of observed data when viewing by winrate. This is to exclude games with too little sample size.
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

   .setting-head .options {
      display: flex;
      gap: 20px;
   }

   
   .setting-head .options div {
      padding: 0.4rem;
      font-size: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.25s ease-in-out;
      border: 1px solid rgba(0, 0, 0, 0);
   }
   
   .setting-head .options div:hover {
      background: var(--cold-blue-focus);
   }

   .setting-head .options .active-option {
      background: var(--cold-blue-focus);
      color: var(--color-font);
      border: 1px solid var(--cell-border);
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
      width: 320px;
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
      z-index: 2;
   }
</style>