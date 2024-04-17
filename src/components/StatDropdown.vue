<script>
import Tooltip from './Tooltip.vue';
import { summonerStore } from '@/stores/summonerStore'

export default {
   components: {
      Tooltip
   },
   data() {
      return {
         store: summonerStore(),
         state: false
      }
   },
   
   methods: {
      toggle() {
         this.state = !this.state

         if (this.state) {
            this.$refs.matchContainer.style.display = 'block'
            this.$refs.matchContainer.style.opacity = `1`
            setTimeout(() => this.$refs.matchContainer.style['max-height'] = `${this.data.matches.length * 39}px`, 500)
         } else {
            this.$refs.matchContainer.style['max-height'] = `0px`
            this.$refs.matchContainer.style.opacity = `0`
            setTimeout(() => this.$refs.matchContainer.style.display = 'none', 500)
         }
      },
   },

   props: {
      header: null,
      stats: null,
      persist: false,
   }
}
</script>

<template>
<div class="stat-main">
   <div class="stat-header">
      <div v-if="this.header">
         {{ this.header }}
         <img class="arrow" @click="this.state = !this.state" src="@/assets/svg/arrow3.svg" :class="{ 'arrow-up': this.state }" alt="">
      </div>
      <Tooltip v-if="!this.persist" :align="'left'" :tip="'implement'" />
   </div>
   <div class="stat-body" :class="{ 'truncated': this.state }" :style="`max-height: ${this.stats.length * 25}px`">
      <div v-for="(s, i) in this.stats" :class="{ 'o': i % 2 === 0 }" :key="i">
         {{ s[0] }}
         <span v-if="this.persist">{{ s[1] }}</span>
         <span v-else-if="this.store.championPool.size > 0">{{ s[1] }}</span>
         <span v-else style="color: var(--color-font-faded);">-</span>
      </div>
   </div>
</div>
</template>

<style scoped>


.stat-main {
   padding-bottom: 30px;
}

.stat-header {
   font-size: 0.9rem;
}

.stat-header {
   display: flex;
   font-weight: 600;
   justify-content: space-between;
   padding: 0 0.5rem;
   margin-bottom: 5px;
}

.stat-header .arrow {
   cursor: pointer;
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
}

.stat-body {
   overflow: hidden;
   transition: max-height 200ms ease-in-out;
}

div.truncated {
   max-height: 0 !important;
   opacity: 1;
}

.arrow-up {
   transform: rotate(180deg);
}

.stat-body div {
   font-size: 0.8rem;
   display: flex;
   margin-top: 1px;
   padding: 0.2rem 0.5rem;
   border-radius: 3px;
   justify-content: space-between;
   align-items: center;
}

.stat-body span {
   font-size: 0.8rem;
}

.o {
   background: var(--alpha-01);
}
</style>