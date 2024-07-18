<script>
import _tooltips from '@/constants/tooltips'

export default {
   data() {
      return {
         tooltips: _tooltips
      }
   }, 

   props: {
      tip: null,
      align: null,
   }
}
</script>

<template>
   <div class="tooltip">
      <img src="@/assets/svg/information.svg" alt="">
      <div :class="this.align" class="tip">
         <ul>
            <li v-for="(t, i) in this.tooltips[this.tip]" :key="i">
               <span v-html="t"></span>
            </li>
         </ul>
      </div>
   </div>
</template>

<style scoped>
.tooltip img {
   cursor: pointer;
   z-index: 1;
   -webkit-touch-callout: none; /* iOS Safari */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Old versions of Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

.tooltip {
   position: relative;
   display: inline-block;
   height: 16px;
}

.tooltip:hover .tip {
   visibility: visible;
}

.tip {
   visibility: hidden;
   position: absolute;
   z-index: 10;
   color: var(--color-font-faded);
   font-size: 0.8rem;
   line-height: 1.35;
   font-style: normal;
   background: var(--off-blue);
   border: 1px solid var(--cell-border);
   border-radius: 8px;
   padding: 0.2rem 1.5rem;
   width: 300px;

   top: 130%;
   left: 50%;
   margin-left: -150px;
}

.right {
   left: 50%;
   margin-left: -360px;
}

.left {
   left: 50%;
   margin-left: 0;
}

.tip ul {
   padding-left: 1rem;
   list-style-type: none;
   padding: 0;
}

.tip ul li:not(:last-child) { 
   margin-bottom: 0.7rem;  
}
</style>