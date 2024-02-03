<script>
import { championStore } from '@/stores/championConfig'

export default {
   data() {
      return {
         config: championStore(),
      }
   },


}
</script>

<template>
   <div class="modal-main">
      <div class="modal">
         <div class="head">
            <h1>Runes</h1>
            The Runes section displays individual rune observations & winrate.
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Heatmap</h2>
               <div class="options">
                  <div :class="{ 'active-option': this.config.runes.heatmap == 0 }" @click="this.config.runes.heatmap = 0">Off</div>
                  <div :class="{ 'active-option': this.config.runes.heatmap == 1 }" @click="this.config.runes.heatmap = 1">Popularity</div>
                  <div :class="{ 'active-option': this.config.runes.heatmap == 2 }" @click="this.config.runes.heatmap = 2">Winrate</div>
               </div>
            </div>
            <p>
               Toggle heatmap to help visually discern rune data.
            </p>
         </div>
         <div class="setting">
            <div class="setting-head">
               <h2>Desaturate colors</h2>
               <svg @click="this.config.runes.clarity = !this.config.runes.clarity" fill="none">
                  <rect x="0.5" y="0.5" rx="13"/>
                  <circle :class="{ 'storage-active': this.config.runes.clarity }" cx="25%" cy="50%" r="22%" rx="12"/>
               </svg>
            </div>
            <p>
               To help with visual clarity.
            </p>
         </div>
      </div>
      <div class="modal-back" @click ="this.config.modals.runes = false" />
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

   .head {
      border-bottom: 1px solid var(--cell-border);
      padding-bottom: 2rem;
      line-height: 1.25;
   }

   .setting {
      padding-top: 2rem;
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
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
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